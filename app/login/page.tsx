"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"

export default function LoginPage() {
  const { user, loading, googleSignIn } = useAuth()
  const [signInLoading, setSignInLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/")
    }
  }, [user, loading, router])

  const handleGoogleSignIn = async () => {
    setSignInLoading(true)
    try {
      await googleSignIn()
    } catch (error) {
      console.error("Sign-in failed:", error)
    } finally {
      setSignInLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="w-full max-w-md glass rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to ListTube</h1>
            <p className="text-muted-foreground">
              Create and manage your media playlists with ease
            </p>
          </div>
          
          <div className="space-y-6">
            <Button
              onClick={handleGoogleSignIn}
              disabled={signInLoading}
              className="w-full search-button flex items-center justify-center gap-2"
            >
              {signInLoading ? (
                <>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-8 8z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}