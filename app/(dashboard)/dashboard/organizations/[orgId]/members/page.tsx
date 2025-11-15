"use client"

import { useParams } from "next/navigation"
import { useMembers, useRemoveMember, useUpdateMemberRole } from "@/lib/hooks/useMembers"
import { useUser } from "@/lib/hooks/useAuth"
import { usePermissions } from "@/lib/hooks/usePermissions"
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
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trash2, Users, Edit } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"
import { ChangeRoleDialog } from "@/components/members/ChangeRoleDialog"
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

function EmptyState() {
  return (
    <Card className="border-dashed">
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Users className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No team members yet</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Invite team members to collaborate on this organization
        </p>
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
  const orgId = params?.orgId as string
  const { data: members, isLoading } = useMembers(orgId)
  const { data: currentUser } = useUser()
  const removeMember = useRemoveMember(orgId)
  const permissions = usePermissions({ orgId })
  const [error, setError] = useState<string | null>(null)
  const [selectedMember, setSelectedMember] = useState<OrganizationMemberWithUser | null>(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Team Members</h2>
        <p className="text-muted-foreground">
          Manage team members and their roles
        </p>
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
                const isCurrentUser = member.user.id === currentUser?.id
                const isOwner = member.role === "owner"

                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {getInitials(member.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{member.user.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{member.user.email}</TableCell>
                    <TableCell>
                      <Badge className={roleColors[member.role]}>
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {!isOwner && permissions.canModifyMember(member.role) && (
                          <>
                            {permissions.canUpdateMemberRoles && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedMember(member)
                                  setIsRoleDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {!isCurrentUser && permissions.canRemoveMembers && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemove(member.id)}
                                disabled={removeMember.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </>
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
        <EmptyState />
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
    </div>
  )
}
