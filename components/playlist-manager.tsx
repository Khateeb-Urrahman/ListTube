"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MediaItem, searchMedia } from "@/lib/search-service"
import { Playlist, PlaylistService } from "@/lib/playlist-service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function PlaylistManager() {
  const { user, loading: authLoading, googleSignIn } = useAuth()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null)
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaylistsLoading, setIsPlaylistsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null)
  
  // YouTube player modal state
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false)
  const [playerVideoId, setPlayerVideoId] = useState<string | null>(null)
  const lastClickedThumbnailRef = useRef<HTMLElement | null>(null)

  // Load playlists on component mount and when user changes
  useEffect(() => {
    const loadPlaylists = async () => {
      if (authLoading) return
      
      if (!user) {
        setPlaylists([])
        setActivePlaylist(null)
        setIsPlaylistsLoading(false)
        return
      }
      
      setIsPlaylistsLoading(true)
      setError(null)
      try {
        const loadedPlaylists = await PlaylistService.getPlaylists()
        setPlaylists(loadedPlaylists)
        
        // Set first playlist as active if none is selected
        if (loadedPlaylists.length > 0 && !activePlaylist) {
          setActivePlaylist(loadedPlaylists[0])
        }
      } catch (error: any) {
        console.error("Error loading playlists:", error)
        setError("Failed to load playlists. You may need to configure Firebase permissions.")
      } finally {
        setIsPlaylistsLoading(false)
      }
    }
    
    loadPlaylists()
  }, [user, authLoading])

  const createPlaylist = async () => {
    if (!user) {
      setError("Please log in to create playlists")
      return
    }
    
    if (newPlaylistName.trim()) {
      try {
        const newPlaylist = await PlaylistService.createPlaylist(newPlaylistName)
        const updatedPlaylists = [...playlists, newPlaylist]
        setPlaylists(updatedPlaylists)
        setNewPlaylistName("")
        setActivePlaylist(newPlaylist)
      } catch (error: any) {
        console.error("Error creating playlist:", error)
        setError("Failed to create playlist. You may need to configure Firebase permissions.")
      }
    }
  }

  const deletePlaylist = async (id: string) => {
    if (!user) {
      setError("Please log in to delete playlists")
      return
    }
    
    try {
      await PlaylistService.deletePlaylist(id)
      const updatedPlaylists = playlists.filter(playlist => playlist.id !== id)
      setPlaylists(updatedPlaylists)
      if (activePlaylist?.id === id) {
        setActivePlaylist(updatedPlaylists.length > 0 ? updatedPlaylists[0] : null)
      }
    } catch (error: any) {
      console.error("Error deleting playlist:", error)
      setError("Failed to delete playlist. You may need to configure Firebase permissions.")
    }
  }

  const addToPlaylist = async (playlistId: string, item: MediaItem) => {
    if (!user) {
      setError("Please log in to add items to playlists")
      return
    }
    
    try {
      await PlaylistService.addMediaToPlaylist(playlistId, item)
      
      // Update local state
      setPlaylists(prevPlaylists => 
        prevPlaylists.map(playlist => 
          playlist.id === playlistId 
            ? { ...playlist, items: [...playlist.items, item] } 
            : playlist
        )
      )
      
      if (activePlaylist?.id === playlistId) {
        setActivePlaylist({
          ...activePlaylist,
          items: [...activePlaylist.items, item]
        })
      }
    } catch (error: any) {
      console.error("Error adding to playlist:", error)
      setError("Failed to add item to playlist. You may need to configure Firebase permissions.")
    }
  }

  const removeFromPlaylist = async (playlistId: string, itemId: string) => {
    if (!user) {
      setError("Please log in to remove items from playlists")
      return
    }
    
    try {
      await PlaylistService.removeMediaFromPlaylist(playlistId, itemId)
      
      // Update local state
      setPlaylists(prevPlaylists => 
        prevPlaylists.map(playlist => 
          playlist.id === playlistId 
            ? { ...playlist, items: playlist.items.filter(item => item.id !== itemId) } 
            : playlist
        )
      )
      
      if (activePlaylist?.id === playlistId) {
        setActivePlaylist({
          ...activePlaylist,
          items: activePlaylist.items.filter(item => item.id !== itemId)
        })
      }
    } catch (error: any) {
      console.error("Error removing from playlist:", error)
      setError("Failed to remove item from playlist. You may need to configure Firebase permissions.")
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    
    setIsLoading(true)
    try {
      const results = await searchMedia(searchQuery)
      setSearchResults(results)
      
      // If the search query is a YouTube URL and we have results, show the first result in a dialog
      if ((searchQuery.includes('youtube.com') || searchQuery.includes('youtu.be')) && results.length > 0) {
        setSelectedVideo(results[0])
        setIsDialogOpen(true)
      }
    } catch (error: any) {
      console.error("Search error:", error)
      setSearchResults([])
      setError("Failed to search media.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToPlaylist = (item: MediaItem) => {
    if (activePlaylist) {
      addToPlaylist(activePlaylist.id, item)
      setIsDialogOpen(false)
    }
  }

  if (authLoading || isPlaylistsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to ListTube</h2>
          <p className="text-muted-foreground mb-6">
            Create and manage your media playlists with ease. Sign in with Google to get started.
          </p>
          <Button 
            onClick={async () => {
              try {
                await googleSignIn();
              } catch (error) {
                console.error("Sign-in failed:", error);
                // Error is handled in the auth context, no need to show it here
              }
            }} 
            className="w-full"
          >
            Sign in with Google
          </Button>
        </div>
      </div>
    )
  }

  // Function to extract YouTube ID from various sources
  const extractYouTubeId = useCallback((element: HTMLImageElement): string | null => {
    // Check data-video-id attribute
    if (element.dataset.videoId) {
      return element.dataset.videoId;
    }
    
    // Check alt attribute for pattern "YouTube Video: VIDEO_ID"
    if (element.alt && element.alt.startsWith('YouTube Video: ')) {
      const parts = element.alt.split('YouTube Video: ');
      if (parts.length > 1) {
        return parts[1];
      }
    }
    
    // Check src attribute for YouTube thumbnail pattern
    if (element.src && element.src.includes('youtube.com/vi/')) {
      const match = element.src.match(/youtube\.com\/vi\/([^/]+)/);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  }, []);

  // Function to open YouTube player modal
  const openYouTubePlayer = useCallback((element: HTMLImageElement) => {
    const videoId = extractYouTubeId(element);
    if (videoId) {
      setPlayerVideoId(videoId);
      setIsPlayerModalOpen(true);
      lastClickedThumbnailRef.current = element;
    }
  }, [extractYouTubeId]);

  // Function to close YouTube player modal
  const closeYouTubePlayer = useCallback(() => {
    setIsPlayerModalOpen(false);
    setPlayerVideoId(null);
    
    // Return focus to the last clicked thumbnail
    if (lastClickedThumbnailRef.current) {
      lastClickedThumbnailRef.current.focus();
    }
  }, []);

  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPlayerModalOpen) {
        closeYouTubePlayer();
      }
    };

    if (isPlayerModalOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Re-enable body scrolling when modal is closed
      document.body.style.overflow = '';
    };
  }, [isPlayerModalOpen, closeYouTubePlayer]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {error && (
        <div className="col-span-full">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      
      {/* Playlist Sidebar */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Playlists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="New playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
              />
              <Button onClick={createPlaylist}>+</Button>
            </div>
            
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {playlists.map((playlist) => (
                  <div 
                    key={playlist.id}
                    className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${
                      activePlaylist?.id === playlist.id 
                        ? "bg-primary/20" 
                        : "hover:bg-accent"
                    }`}
                    onClick={() => setActivePlaylist(playlist)}
                  >
                    <div>
                      <div className="font-medium">{playlist.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {playlist.items.length} items
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        deletePlaylist(playlist.id)
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-2 space-y-6">
        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle>Search Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Search for videos, music, or podcasts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Search Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                      <div 
                        className="bg-muted rounded-md w-16 h-16 flex-shrink-0 overflow-hidden cursor-pointer"
                        onClick={(e) => {
                          const imgElement = e.currentTarget.querySelector('img');
                          if (imgElement && item.id.startsWith('youtube_')) {
                            openYouTubePlayer(imgElement);
                          } else if (item.id.startsWith('youtube_')) {
                            // Fallback if we can't get the img element
                            const videoId = item.id.replace('youtube_', '');
                            setPlayerVideoId(videoId);
                            setIsPlayerModalOpen(true);
                            lastClickedThumbnailRef.current = e.currentTarget;
                          } else {
                            // For non-YouTube videos, we could implement a different playback method
                            // For now, we'll just log to console
                            console.log('Non-YouTube video clicked:', item);
                          }
                        }}
                      >
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium w-full text-foreground overflow-hidden text-ellipsis whitespace-nowrap">{item.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" onClick={() => activePlaylist && addToPlaylist(activePlaylist.id, item)}>
                            Add to Playlist
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {searchResults.length === 0 && searchQuery && !isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                No results found for "{searchQuery}"
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Playlist */}
        {activePlaylist && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{activePlaylist.name}</CardTitle>
                <Button variant="outline" size="sm">
                  Play All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activePlaylist.items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  This playlist is empty. Search for media and add items to get started.
                </div>
              ) : (
                <div className="space-y-3">
                  {activePlaylist.items.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="text-muted-foreground w-6">#{index + 1}</div>
                      <div 
                        className="bg-muted rounded-md w-16 h-16 flex-shrink-0 overflow-hidden cursor-pointer"
                        onClick={(e) => {
                          const imgElement = e.currentTarget.querySelector('img');
                          if (imgElement && item.id.startsWith('youtube_')) {
                            openYouTubePlayer(imgElement);
                          } else if (item.id.startsWith('youtube_')) {
                            // Fallback if we can't get the img element
                            const videoId = item.id.replace('youtube_', '');
                            setPlayerVideoId(videoId);
                            setIsPlayerModalOpen(true);
                            lastClickedThumbnailRef.current = e.currentTarget;
                          } else {
                            // For non-YouTube videos, we could implement a different playback method
                            // For now, we'll just log to console
                            console.log('Non-YouTube video clicked:', item);
                          }
                        }}
                      >
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium w-full text-foreground overflow-hidden text-ellipsis whitespace-nowrap">{item.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeFromPlaylist(activePlaylist.id, item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* YouTube Player Modal */}
      {isPlayerModalOpen && playerVideoId && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="YouTube Video Player"
          onClick={(e) => {
            // Close modal when clicking outside the iframe
            if (e.target === e.currentTarget) {
              closeYouTubePlayer();
            }
          }}
        >
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              className="absolute -top-12 right-0 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={closeYouTubePlayer}
              aria-label="Close video player"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${playerVideoId}?autoplay=1&modestbranding=1&rel=0`}
              className="w-full h-full rounded-lg"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="YouTube Video Player"
            />
          </div>
        </div>
      )}

      {/* YouTube Video Preview Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>YouTube Video Preview</DialogTitle>
            <DialogDescription>
              Preview of the YouTube video you're about to add to your playlist
            </DialogDescription>
          </DialogHeader>
          {selectedVideo && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                <img 
                  src={selectedVideo.thumbnail} 
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={(e) => {
                    const imgElement = e.currentTarget;
                    if (imgElement && selectedVideo.id.startsWith('youtube_')) {
                      openYouTubePlayer(imgElement);
                    } else if (selectedVideo.id.startsWith('youtube_')) {
                      // Fallback if needed
                      const videoId = selectedVideo.id.replace('youtube_', '');
                      setPlayerVideoId(videoId);
                      setIsPlayerModalOpen(true);
                      lastClickedThumbnailRef.current = e.currentTarget;
                    } else {
                      // For non-YouTube videos, we could implement a different playback method
                      // For now, we'll just log to console
                      console.log('Non-YouTube video clicked:', selectedVideo);
                    }
                  }}
                />
              </div>
              <div>
                <h3 className="font-medium line-clamp-2 w-full text-foreground overflow-hidden text-ellipsis whitespace-nowrap">{selectedVideo.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                  {selectedVideo.description}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleAddToPlaylist(selectedVideo)}
                  disabled={!activePlaylist}
                  className="flex-1"
                >
                  Add to Playlist
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
              {!activePlaylist && (
                <p className="text-sm text-muted-foreground text-center">
                  Select a playlist to add this video
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}