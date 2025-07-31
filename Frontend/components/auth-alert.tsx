"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { usePathname } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AuthAlert() {
  const { isAuthenticated } = useAuth()
  const pathname = usePathname()
  const [showAlert, setShowAlert] = useState(false)

  const protectedPaths = [
    "/diabetes",
    "/heart",
    "/depression",
    "/stroke",
    "/thyroid",
    "/parkinsons",
    "/kidney",
    "/hepatitis",
    "/alzheimers",
    "/maternal",
    "/profile",
  ]

  useEffect(() => {
    // Check if current path is a protected path and user is not authenticated
    if (protectedPaths.some((path) => pathname.startsWith(path)) && !isAuthenticated) {
      setShowAlert(true)
    } else {
      setShowAlert(false)
    }
  }, [pathname, isAuthenticated])

  if (!showAlert) return null

  return (
    <Alert variant="destructive" className="mx-auto max-w-4xl mt-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Authentication Required</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row items-center gap-4">
        <span>You need to be logged in to access this service.</span>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button asChild size="sm" variant="outline">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
