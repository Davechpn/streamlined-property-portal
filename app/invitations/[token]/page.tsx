"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAcceptInvitation } from "@/lib/hooks/useInvitations"
import { useUser } from "@/lib/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function AcceptInvitationPage() {
  const params = useParams()
  const router = useRouter()
  const token = params?.token as string
  const { data: user, isLoading: userLoading } = useUser()
  const acceptInvitation = useAcceptInvitation()

  const [status, setStatus] = useState<"idle" | "accepting" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  // Check if user is authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      // Not authenticated - redirect to sign in with return URL
      const signInUrl = new URL("/signin", window.location.origin)
      signInUrl.searchParams.set("redirect", `/invitations/${token}`)
      router.push(signInUrl.toString())
    }
  }, [user, userLoading, token, router])

  const handleAccept = async () => {
    setStatus("accepting")
    setError(null)

    try {
      await acceptInvitation.mutateAsync({ token })
      setStatus("success")
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/dashboard")
      }, 2000)
    } catch (err: any) {
      setStatus("error")
      setError(err.response?.data?.message || "Failed to accept invitation")
    }
  }

  const handleDecline = () => {
    router.push("/dashboard/dashboard")
  }

  // Loading state
  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-10" />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success state
  if (status === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Invitation Accepted!</CardTitle>
            <CardDescription>
              You have successfully joined the organization
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Redirecting to your dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle>Invitation Error</CardTitle>
            <CardDescription>
              Unable to accept the invitation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                {error || "This invitation may be expired or invalid"}
              </AlertDescription>
            </Alert>
            <Button onClick={() => router.push("/dashboard/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main invitation view
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Organization Invitation</CardTitle>
          <CardDescription>
            You've been invited to join an organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Invited by</p>
              <p className="font-medium">Organization Admin</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium capitalize">Team Member</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your account</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleAccept}
              disabled={status === "accepting"}
              className="w-full"
            >
              {status === "accepting" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Accepting...
                </>
              ) : (
                "Accept Invitation"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleDecline}
              disabled={status === "accepting"}
              className="w-full"
            >
              Decline
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By accepting, you will become a member of this organization and gain access
            to its properties and resources.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
