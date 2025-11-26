"use client"

import { useParams, useRouter } from "next/navigation"
import { useMembers, useRemoveMember, useUpdateMemberRole } from "@/lib/hooks/useMembers"
import { useUser } from "@/lib/hooks/useAuth"
import { usePermissions } from "@/lib/hooks/usePermissions"
import { useOrganization } from "@/lib/hooks/useOrganizations"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trash2, Users, Edit, UserPlus, Mail, Crown, Shield, Building2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"
import { ChangeRoleDialog } from "@/components/members/ChangeRoleDialog"
import { SendInvitationDialog } from "@/components/invitations/SendInvitationDialog"
import type { Role, OrganizationMemberWithUser } from "@/lib/types"

function MembersSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-9 w-20" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ onInvite }: { onInvite: () => void }) {
  return (
    <Card className="border-dashed">
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Users className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No team members yet</h3>
        <p className="text-sm text-muted-foreground mt-2 mb-4">
          Get started by inviting team members to collaborate on this organization
        </p>
        <Button onClick={onInvite}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Team Members
        </Button>
      </div>
    </Card>
  )
}

const roleColors: Record<Role, string> = {
  owner: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  manager: "bg-green-100 text-green-800",
  agent: "bg-yellow-100 text-yellow-800",
  viewer: "bg-gray-100 text-gray-800",
}

export default function MembersPage() {
  const params = useParams()
  const router = useRouter()
  const orgId = params?.orgId as string
  const { data: members, isLoading } = useMembers(orgId)
  const { data: orgData, isLoading: orgLoading } = useOrganization(orgId)
  const { data: currentUser } = useUser()
  const removeMember = useRemoveMember(orgId)
  const permissions = usePermissions({ orgId })
  const [error, setError] = useState<string | null>(null)
  const [selectedMember, setSelectedMember] = useState<OrganizationMemberWithUser | null>(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

  const organization = orgData?.organization

  const handleRemove = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return

    setError(null)
    try {
      await removeMember.mutateAsync(memberId)
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

  // Owner should always be able to invite members
  const canInviteMembers = permissions.isOwner || permissions.canInviteMembers

  return (
    <div className="space-y-6">
      {/* Header with action buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Members</h2>
          <p className="text-muted-foreground mt-1">
            {organization ? (
              <>
                {members && members.length > 0 ? (
                  <>
                    {members.length} {members.length === 1 ? 'member' : 'members'} in {organization.name}
                  </>
                ) : (
                  `Manage your team and control access to ${organization.name}`
                )}
              </>
            ) : (
              'Manage your team and control access to your organization'
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {canInviteMembers && (
            <Button onClick={() => setIsInviteDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Members
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <MembersSkeleton />
      ) : members && members.length > 0 ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => {
                const isCurrentUser = member.userId === currentUser?.id
                const isOwner = member.role === "owner"

                return (
                  <TableRow 
                    key={member.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/dashboard/organizations/${orgId}/members/${member.id}`)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {member.name}
                            {isCurrentUser && (
                              <Badge variant="outline" className="text-xs">You</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            @{member.userName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {member.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={roleColors[member.role]} variant="secondary">
                        {isOwner && <Crown className="h-3 w-3 mr-1" />}
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(member.joinedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-2 justify-end">
                        {/* View/Edit button - visible to everyone */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/organizations/${orgId}/members/${member.id}`)}
                          title="View details"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        {/* Change role button - only for those with permission */}
                        {!isOwner && permissions.canModifyMember(member.role) && permissions.canUpdateMemberRoles && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedMember(member)
                              setIsRoleDialogOpen(true)
                            }}
                            title="Change role"
                          >
                            <Shield className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Remove button - only for those with permission */}
                        {!isOwner && !isCurrentUser && permissions.canModifyMember(member.role) && permissions.canRemoveMembers && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(member.id)}
                            disabled={removeMember.isPending}
                            title="Remove member"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <EmptyState onInvite={() => setIsInviteDialogOpen(true)} />
      )}

      {/* Change Role Dialog */}
      {selectedMember && (
        <ChangeRoleDialog
          orgId={orgId}
          member={selectedMember}
          open={isRoleDialogOpen}
          onOpenChange={setIsRoleDialogOpen}
        />
      )}

      {/* Send Invitation Dialog */}
      <SendInvitationDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        defaultOrganizationId={orgId}
      />
    </div>
  )
}
