"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { auth } from '@/lib/firebase'
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  googleSignIn: () => Promise<void>
  logOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  googleSignIn: async () => {},
  logOut: async () => {}
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSigningIn, setIsSigningIn] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const googleSignIn = async () => {
    // Prevent multiple simultaneous sign-in attempts
    if (isSigningIn) {
      console.warn('Sign-in already in progress')
      return
    }

    setIsSigningIn(true)
    const provider = new GoogleAuthProvider()
    
    try {
      await signInWithPopup(auth, provider)
    } catch (error: any) {
      // Handle specific Firebase errors
      if (error.code === 'auth/cancelled-popup-request') {
        console.warn('Sign-in popup was cancelled')
        // This is not a real error, just a cancelled request
        return
      }
      
      console.error('Error signing in with Google:', error)
      throw error
    } finally {
      setIsSigningIn(false)
    }
  }

  const logOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    googleSignIn,
    logOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}