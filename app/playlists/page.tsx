"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { PlaylistManager } from "@/components/playlist-manager"

export default function PlaylistsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">My Playlists</h1>
          <p className="text-muted-foreground">Create and manage your media playlists</p>
        </div>
        <PlaylistManager />
      </main>
    </div>
  )
}