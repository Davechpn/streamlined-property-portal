"use client"

import { useActivities } from "@/lib/hooks/useActivities"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  UserPlus, 
  UserMinus, 
  UserCog, 
  Building2, 
  Mail,
  CheckCircle,
  XCircle,
  Activity as ActivityIcon
} from "lucide-react"
import type { Activity } from "@/lib/types"

interface ActivityFeedProps {
  orgId: string
  limit?: number
}

const activityIcons: Record<string, any> = {
  "member.invited": Mail,
  "member.joined": UserPlus,
  "member.removed": UserMinus,
  "member.role_changed": UserCog,
  "organization.created": Building2,
  "organization.updated": Building2,
  "invitation.sent": Mail,
  "invitation.accepted": CheckCircle,
  "invitation.revoked": XCircle,
}

const activityColors: Record<string, string> = {
  "member.invited": "text-blue-600 bg-blue-100",
  "member.joined": "text-green-600 bg-green-100",
  "member.removed": "text-red-600 bg-red-100",
  "member.role_changed": "text-purple-600 bg-purple-100",
  "organization.created": "text-primary bg-primary/10",
  "organization.updated": "text-primary bg-primary/10",
  "invitation.sent": "text-blue-600 bg-blue-100",
  "invitation.accepted": "text-green-600 bg-green-100",
  "invitation.revoked": "text-red-600 bg-red-100",
}

function ActivitySkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

function getActivityDescription(activity: Activity): string {
  const metadata = activity.metadata as any
  
  switch (activity.type) {
    case "member.invited":
      return `invited ${metadata?.inviteeEmail || "a new member"} to join as ${metadata?.role || "member"}`
    case "member.joined":
      return `joined the organization as ${metadata?.role || "member"}`
    case "member.removed":
      return `removed ${metadata?.memberName || "a member"} from the organization`
    case "member.role_changed":
      return `changed ${metadata?.memberName || "a member"}'s role from ${metadata?.oldRole || "member"} to ${metadata?.newRole || "member"}`
    case "organization.created":
      return `created the organization`
    case "organization.updated":
      return `updated organization settings`
    case "invitation.sent":
      return `sent an invitation to ${metadata?.inviteeEmail || "a new member"}`
    case "invitation.accepted":
      return `accepted the invitation and joined the organization`
    case "invitation.revoked":
      return `revoked an invitation`
    default:
      return activity.type
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function ActivityFeed({ orgId, limit = 10 }: ActivityFeedProps) {
  const { data: activities, isLoading } = useActivities(orgId, { limit })

  if (isLoading) {
    return <ActivitySkeleton />
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ActivityIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No activity yet</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Organization activities will appear here
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activityIcons[activity.type] || ActivityIcon
        const colorClass = activityColors[activity.type] || "text-gray-600 bg-gray-100"
        
        return (
          <div key={activity.id} className="flex gap-4 items-start">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colorClass}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{activity.actor.name}</span>
                <span className="text-sm text-muted-foreground">
                  {getActivityDescription(activity)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(activity.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Standalone Activity Feed Page
export function ActivityFeedPage({ orgId }: { orgId: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Activity Feed</h2>
        <p className="text-muted-foreground">
          Recent activities in your organization
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Timeline of member and organization activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityFeed orgId={orgId} limit={50} />
        </CardContent>
      </Card>
    </div>
  )
}
