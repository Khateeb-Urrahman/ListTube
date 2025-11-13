"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, googleSignIn, logOut } = useAuth()
  const router = useRouter()

  return (
    <header className="navbar-glass">
      <div className="container mx-auto flex items-center justify-between">
        <div 
          className="logo-glow cursor-pointer"
          onClick={() => router.push("/")}
        >
          ListTube
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <span 
            className="nav-text cursor-pointer"
            onClick={() => router.push("/")}
          >
            Home
          </span>
          <span 
            className="nav-text cursor-pointer"
            onClick={() => router.push("/playlists")}
          >
            Playlists
          </span>
          <span className="nav-text cursor-pointer">
            Discover
          </span>
        </nav>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-foreground text-sm hidden sm:block">
                {user.displayName}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={logOut}
                className="nav-text"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={googleSignIn}
              className="nav-text"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}