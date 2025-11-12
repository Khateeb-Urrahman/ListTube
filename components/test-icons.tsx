"use client"

import { Plus, Search, Play, Trash2 } from "lucide-react"

export function TestIcons() {
  return (
    <div className="flex gap-4">
      <Plus className="w-4 h-4" />
      <Search className="w-4 h-4" />
      <Play className="w-4 h-4" />
      <Trash2 className="w-4 h-4" />
    </div>
  )
}