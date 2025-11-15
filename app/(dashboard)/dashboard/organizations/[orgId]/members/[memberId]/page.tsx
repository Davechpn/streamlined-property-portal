"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useMembers, useRemoveMember } from "@/lib/hooks/useMembers"
import { usePermissions } from "@/lib/hooks/usePermissions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Mail, Phone, Calendar, Shield, Trash2, Edit } from "lucide-react"
import { ChangeRoleDialog } from "@/components/members/ChangeRoleDialog"
import { ActivityFeed } from "@/components/activity/ActivityFeed"
import type { OrganizationMemberWithUser } from "@/lib/types"

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6 text-center">
              <Skeleton className="h-24 w-24 rounded-full mx-auto" />
              <Skeleton className="h-6 w-32 mx-auto mt-4" />
              <Skeleton className="h-4 w-48 mx-auto mt-2" />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    </div>
  )
}

const ROLE_DESCRIPTIONS = {
  owner: "Full control over the organization and all its resources",
  admin: "Can manage organization settings, members, and all properties",
  manager: "Can invite members and manage assigned properties",
  agent: "Can view and manage assigned properties",
  viewer: "Read-only access to organization resources",
}

const ROLE_PERMISSIONS = {
  owner: [
    "Manage organization settings",
    "Delete organization",
    "Manage all members and roles",
    "Access all properties",
    "View all activity logs",
  ],
  admin: [
    "Manage organization settings",
    "Manage members and roles",
    "Send and revoke invitations",
    "Access all properties",
    "View activity logs",
  ],
  manager: [
    "Send invitations",
    "View team members",
    "Manage assigned properties",
    "View activity logs",
  ],
  agent: [
    "View team members",
    "Manage assigned properties",
    "View assigned activity",
  ],
  viewer: [
    "View team members",
    "View organization details",
    "Read-only access",
  ],
}

export default function MemberProfilePage() {
  const params = useParams()
  const router = useRouter()
  const orgId = params?.orgId as string
  const memberId = params?.memberId as string
  const { data: members, isLoading } = useMembers(orgId)
  const permissions = usePermissions({ orgId })
  const removeMember = useRemoveMember(orgId)

  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isLoading) {
    return <ProfileSkeleton />
  }

  const member = members?.find((m) => m.id === memberId)

  if (!member) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/dashboard/organizations/${orgId}/members`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Members
        </Button>
        <Alert variant="destructive">
          <AlertDescription>Member not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  const canModify = permissions.canModifyMember(member.role)
  const isOwner = member.role === "owner"

  const handleRemove = async () => {
    setError(null)
    try {
      await removeMember.mutateAsync(memberId)
      router.push(`/dashboard/organizations/${orgId}/members`)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to remove member")
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push(`/dashboard/organizations/${orgId}/members`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Members
        </Button>
        {canModify && !isOwner && (
          <div className="flex gap-2">
            {permissions.canUpdateMemberRoles && (
              <Button
                variant="outline"
                onClick={() => setIsRoleDialogOpen(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Change Role
              </Button>
            )}
            {permissions.canRemoveMembers && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Member
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Team Member?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove {member.user.name} from this
                      organization? They will lose all access immediately.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRemove}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Remove Member
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Profile Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Profile Card */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarFallback className="text-2xl">
                  {getInitials(member.user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{member.user.name}</h2>
                <Badge className="mt-2 capitalize">{member.role}</Badge>
              </div>
              <div className="space-y-2 text-left">
                {member.user.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{member.user.email}</span>
                  </div>
                )}
                {member.user.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{member.user.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Role Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role & Permissions
              </CardTitle>
              <CardDescription>
                {ROLE_DESCRIPTIONS[member.role]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Permissions:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {ROLE_PERMISSIONS[member.role].map((permission, i) => (
                    <li key={i}>{permission}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Activity history for this member
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed orgId={orgId} limit={10} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Change Role Dialog */}
      <ChangeRoleDialog
        orgId={orgId}
        member={member}
        open={isRoleDialogOpen}
        onOpenChange={setIsRoleDialogOpen}
      />
    </div>
  )
}
