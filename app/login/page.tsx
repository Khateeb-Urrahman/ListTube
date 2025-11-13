"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const { user, googleSignIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/playlists")
    }
  }, [user, router])

  const handleSignIn = async () => {
    try {
      setError(null)
      setIsLoading(true)
      await googleSignIn()
    } catch (error: any) {
      console.error("Error signing in:", error)
      setError("Failed to sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    return null // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-xl">⚡</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Welcome to ListTube</CardTitle>
          <CardDescription className="text-center">
            Sign in with Google to create and manage your playlists
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button 
            onClick={handleSignIn} 
            className="w-full"
            variant="default"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}