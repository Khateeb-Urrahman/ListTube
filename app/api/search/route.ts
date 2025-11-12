import { NextResponse } from 'next/server'

// Mock data for demonstration
const mockMediaData = [
  {
    id: "1",
    title: "Next.js 16 Crash Course",
    description: "Learn the latest features of Next.js 16 including the App Router, Server Components, and more.",
    thumbnail: "/placeholder.jpg",
    duration: "25:42"
  },
  {
    id: "2",
    title: "Tailwind CSS Deep Dive",
    description: "Master Tailwind CSS with advanced techniques and best practices for modern web development.",
    thumbnail: "/placeholder.jpg",
    duration: "32:15"
  },
  {
    id: "3",
    title: "TypeScript Advanced Patterns",
    description: "Explore advanced TypeScript patterns and techniques for building robust applications.",
    thumbnail: "/placeholder.jpg",
    duration: "41:30"
  },
  {
    id: "4",
    title: "Building Responsive UIs with shadcn/ui",
    description: "Learn how to create beautiful, responsive user interfaces using the shadcn/ui component library.",
    thumbnail: "/placeholder.jpg",
    duration: "18:22"
  },
  {
    id: "5",
    title: "React Performance Optimization",
    description: "Discover techniques to optimize React application performance and reduce bundle sizes.",
    thumbnail: "/placeholder.jpg",
    duration: "37:45"
  }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  
  // Filter mock data based on query
  const results = mockMediaData.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  )
  
  return NextResponse.json({ results })
}