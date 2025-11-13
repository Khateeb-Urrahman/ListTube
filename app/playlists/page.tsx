"use client"

import { Header } from "@/components/header"
import { PlaylistManager } from "@/components/playlist-manager"

export default function PlaylistsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <PlaylistManager />
      </main>
    </div>
  )
}