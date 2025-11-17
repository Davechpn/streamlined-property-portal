"use client"

import { User, Mail, Phone, Calendar, Shield, CheckCircle2, XCircle, Building2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EditProfileDialog } from "@/components/profile/EditProfileDialog"
import { ChangePasswordDialog } from "@/components/profile/ChangePasswordDialog"
import { AccountSecurityCard } from "@/components/profile/AccountSecurityCard"
import { useProfile } from "@/lib/hooks/useAuth"
import { formatDistanceToNow } from "date-fns"

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return 'N/A'
  }
}

function getRelativeTime(dateString: string) {
  try {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return 'N/A'
  }
}

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useProfile()

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load profile. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const { user, organizations } = profile

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and view your information
        </p>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  {user.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {user.email}
                    </span>
                  )}
                  {user.phoneNumber && (
                    <span className="flex items-center gap-1 ml-4">
                      <Phone className="h-3.5 w-3.5" />
                      {user.phoneNumber}
                    </span>
                  )}
                </CardDescription>
                <div className="flex gap-2 mt-3">
                  {user.isActive ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <XCircle className="h-3 w-3" />
                      Inactive
                    </Badge>
                  )}
                  {user.isEmailVerified && (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Email Verified
                    </Badge>
                  )}
                  {user.isPhoneVerified && (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Phone Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <EditProfileDialog user={user} />
              {user.authenticationMethods.includes('email') && (
                <ChangePasswordDialog userEmail={user.email} />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-muted-foreground mb-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Member Since
              </dt>
              <dd className="text-foreground">{formatDate(user.createdAt)}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground mb-1 flex items-center gap-2">
                <User className="h-4 w-4" />
                Last Active
              </dt>
              <dd className="text-foreground">{getRelativeTime(user.lastActiveAt)}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground mb-1 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Authentication Methods
              </dt>
              <dd className="flex gap-1">
                {user.authenticationMethods.map((method) => (
                  <Badge key={method} variant="outline" className="capitalize">
                    {method}
                  </Badge>
                ))}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground mb-1">Account ID</dt>
              <dd className="text-foreground font-mono text-xs">{user.id}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Account Security Card */}
      <AccountSecurityCard user={user} />

      {/* Organizations Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organizations
          </CardTitle>
          <CardDescription>
            Organizations you belong to and your role in each
          </CardDescription>
        </CardHeader>
        <CardContent>
          {organizations.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              You are not a member of any organizations yet.
            </p>
          ) : (
            <div className="space-y-4">
              {organizations.map((org) => (
                <div
                  key={org.organizationId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {getInitials(org.organizationName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{org.organizationName}</p>
                      <p className="text-sm text-muted-foreground">
                        Joined {formatDate(org.joinedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {org.role}
                    </Badge>
                    {org.isActive && (
                      <Badge variant="default">Active</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification Status */}
      {(!user.isEmailVerified || !user.isPhoneVerified) && (
        <Alert>
          <AlertDescription>
            <div className="flex flex-col gap-2">
              <p className="font-medium">Complete Your Profile</p>
              {!user.isEmailVerified && (
                <p className="text-sm">
                  • Verify your email address to receive important notifications
                </p>
              )}
              {!user.isPhoneVerified && user.phoneNumber && (
                <p className="text-sm">
                  • Verify your phone number for added security
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
