// Playlist service for managing playlists
import { MediaItem } from './search-service'
import { app } from './firebase'
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc,
  query,
  where
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export interface Playlist {
  id: string
  name: string
  items: MediaItem[]
  createdAt: Date
  userId: string
}

// Initialize Firestore
const db = getFirestore(app)
const auth = getAuth(app)

// Get current user ID
const getUserId = () => {
  const user = auth.currentUser
  return user ? user.uid : null
}

export class PlaylistService {
  static async getPlaylists(): Promise<Playlist[]> {
    try {
      const userId = getUserId()
      if (!userId) {
        console.warn('No user logged in')
        return []
      }
      
      // Query playlists for the current user
      const q = query(collection(db, "playlists"), where("userId", "==", userId))
      const querySnapshot = await getDocs(q)
      const playlists: Playlist[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        playlists.push({
          id: doc.id,
          name: data.name,
          items: data.items || [],
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
          userId: data.userId
        })
      })
      
      return playlists
    } catch (error: any) {
      console.error('Error loading playlists:', error)
      // Handle permission errors gracefully
      if (error.code === 'permission-denied') {
        console.warn('Permission denied when fetching playlists. Returning empty array.')
        return []
      }
      return []
    }
  }

  static async savePlaylist(playlist: Playlist): Promise<void> {
    try {
      await setDoc(doc(db, "playlists", playlist.id), {
        userId: playlist.userId,
        name: playlist.name,
        items: playlist.items,
        createdAt: playlist.createdAt
      })
    } catch (error: any) {
      console.error('Error saving playlist:', error)
      // Handle permission errors gracefully
      if (error.code === 'permission-denied') {
        console.warn('Permission denied when saving playlist. Operation skipped.')
      }
    }
  }

  static async createPlaylist(name: string): Promise<Playlist> {
    const userId = getUserId()
    if (!userId) {
      throw new Error('User not authenticated')
    }
    
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      items: [],
      createdAt: new Date(),
      userId
    }
    
    await this.savePlaylist(newPlaylist)
    return newPlaylist
  }

  static async addMediaToPlaylist(playlistId: string, mediaItem: MediaItem): Promise<void> {
    try {
      const userId = getUserId()
      if (!userId) {
        throw new Error('User not authenticated')
      }
      
      // First verify the playlist exists and belongs to the user
      const playlistDoc = doc(db, "playlists", playlistId)
      const docSnap = await getDoc(playlistDoc)
      
      if (docSnap.exists() && docSnap.data().userId === userId) {
        const playlistData = docSnap.data()
        // Check if item already exists in playlist
        const itemExists = playlistData.items.some((item: MediaItem) => item.id === mediaItem.id)
        
        if (!itemExists) {
          const updatedItems = [...playlistData.items, mediaItem]
          await updateDoc(playlistDoc, {
            items: updatedItems
          })
        }
      } else {
        console.warn('Playlist not found or does not belong to user')
      }
    } catch (error: any) {
      console.error('Error adding media to playlist:', error)
      // Handle permission errors gracefully
      if (error.code === 'permission-denied') {
        console.warn('Permission denied when adding media to playlist. Operation skipped.')
      }
    }
  }

  static async removeMediaFromPlaylist(playlistId: string, mediaId: string): Promise<void> {
    try {
      const userId = getUserId()
      if (!userId) {
        throw new Error('User not authenticated')
      }
      
      // First verify the playlist exists and belongs to the user
      const playlistDoc = doc(db, "playlists", playlistId)
      const docSnap = await getDoc(playlistDoc)
      
      if (docSnap.exists() && docSnap.data().userId === userId) {
        const playlistData = docSnap.data()
        const updatedItems = playlistData.items.filter((item: MediaItem) => item.id !== mediaId)
        await updateDoc(playlistDoc, {
          items: updatedItems
        })
      } else {
        console.warn('Playlist not found or does not belong to user')
      }
    } catch (error: any) {
      console.error('Error removing media from playlist:', error)
      // Handle permission errors gracefully
      if (error.code === 'permission-denied') {
        console.warn('Permission denied when removing media from playlist. Operation skipped.')
      }
    }
  }

  static async deletePlaylist(playlistId: string): Promise<void> {
    try {
      const userId = getUserId()
      if (!userId) {
        throw new Error('User not authenticated')
      }
      
      // First verify the playlist exists and belongs to the user
      const playlistDoc = doc(db, "playlists", playlistId)
      const docSnap = await getDoc(playlistDoc)
      
      if (docSnap.exists() && docSnap.data().userId === userId) {
        await deleteDoc(playlistDoc)
      } else {
        console.warn('Playlist not found or does not belong to user')
      }
    } catch (error: any) {
      console.error('Error deleting playlist:', error)
      // Handle permission errors gracefully
      if (error.code === 'permission-denied') {
        console.warn('Permission denied when deleting playlist. Operation skipped.')
      }
    }
  }
}