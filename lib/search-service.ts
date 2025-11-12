// Search service for fetching media content

export interface MediaItem {
  id: string
  title: string
  description: string
  thumbnail: string
  duration?: string
}

// Function to extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Function to fetch YouTube video information
export async function getYouTubeVideoInfo(url: string): Promise<MediaItem | null> {
  try {
    const videoId = extractYouTubeId(url);
    if (!videoId) {
      return null;
    }

    // In a real application, you would call the YouTube Data API here
    // For this implementation, we'll simulate fetching video data
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    // Return mock data for demonstration
    // In a real app, you would fetch actual data from YouTube API
    return {
      id: `youtube_${videoId}`, // Prefix to ensure uniqueness
      title: `YouTube Video: ${videoId}`,
      description: `This is a YouTube video with ID ${videoId}. In a real application, this would contain the actual video description.`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      duration: "00:00"
    };
  } catch (error) {
    console.error("Error fetching YouTube video info:", error);
    return null;
  }
}

export async function searchMedia(query: string): Promise<MediaItem[]> {
  try {
    // Check if the query is a YouTube URL
    if (query.includes('youtube.com') || query.includes('youtu.be')) {
      const videoInfo = await getYouTubeVideoInfo(query);
      if (videoInfo) {
        return [videoInfo];
      }
      return [];
    }
    
    // In a real application, this would call an external API
    if (!query.trim()) {
      return []
    }
    
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // For demonstration purposes, we'll return mock data based on the query
    const mockResults: MediaItem[] = [
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
      },
      {
        id: "6",
        title: "State Management in React",
        description: "Comparing different state management solutions for React applications including Context API, Redux, and Zustand.",
        thumbnail: "/placeholder.jpg",
        duration: "29:17"
      },
      {
        id: "7",
        title: "CSS Variables and Custom Properties",
        description: "Learn how to use CSS custom properties to create maintainable and scalable stylesheets.",
        thumbnail: "/placeholder.jpg",
        duration: "22:05"
      }
    ]
    
    // Filter results based on query
    return mockResults.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    )
  } catch (error) {
    console.error("Error searching media:", error)
    return []
  }
}

// In a real application, you might have additional functions like:
// export async function getMediaById(id: string): Promise<MediaItem | null>
// export async function getTrendingMedia(): Promise<MediaItem[]>
// export async function getRecommendedMedia(userId: string): Promise<MediaItem[]>