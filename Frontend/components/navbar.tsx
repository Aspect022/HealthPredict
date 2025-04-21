"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/context/auth-context"

interface NavbarProps {
  showBackButton?: boolean
}

export function Navbar({ showBackButton = false }: NavbarProps) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/signup"
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    // If we're on a protected page, redirect to home
    if (pathname !== "/") {
      window.location.href = "/"
    }
  }

  return (
    <div className="container flex items-center justify-between py-4">
      <div>
        {showBackButton ? (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        ) : (
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-xl">HealthPredict</span>
          </Link>
        )}
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {!showBackButton && !isAuthPage && (
          <>
            {isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-1">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Register</Link>
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
