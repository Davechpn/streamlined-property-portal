"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useCurrentOrganization } from "@/lib/hooks/useOrganizations"
import { usePermissions } from "@/lib/hooks/usePermissions"
import {
  useInvitations,
  useCreateInvitation,
  useResendInvitation,
  useCancelInvitation,
} from "@/lib/hooks/useInvitations"
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
import { UserPlus, Send, X, Plus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { InviteMemberRequest, Role, InvitationStatus } from "@/lib/types"

function InvitationsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
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
          <UserPlus className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No pending invitations</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Send invitations to add new team members
        </p>
      </div>
    </Card>
  )
}

const statusColors: Record<InvitationStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  expired: "bg-gray-100 text-gray-800",
  revoked: "bg-red-100 text-red-800",
}

export default function InvitationsPage() {
  const params = useParams()
  const { data: currentOrg } = useCurrentOrganization()
  const orgId = currentOrg?.id || ""
  const { data: invitations, isLoading } = useInvitations(orgId)
  const permissions = usePermissions({ orgId })
  const createInvitation = useCreateInvitation(orgId)
  const resendInvitation = useResendInvitation(orgId)
  const cancelInvitation = useCancelInvitation(orgId)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<InviteMemberRequest>({
    inviteeContact: "",
    role: "viewer",
    message: "",
  })
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.inviteeContact.trim()) {
      setError("Email or phone number is required")
      return
    }

    try {
      await createInvitation.mutateAsync(formData)
      setIsDialogOpen(false)
      setFormData({ inviteeContact: "", role: "viewer", message: "" })
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send invitation")
    }
  }

  const handleResend = async (invitationId: string) => {
    setError(null)
    try {
      await resendInvitation.mutateAsync(invitationId)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend invitation")
    }
  }

  const handleCancel = async (invitationId: string) => {
    if (!confirm("Are you sure you want to cancel this invitation?")) return

    setError(null)
    try {
      await cancelInvitation.mutateAsync(invitationId)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to cancel invitation")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invitations</h2>
          <p className="text-muted-foreground">
            Send and manage team invitations
          </p>
        </div>
        {permissions.canManageInvitations && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Send Invitation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Send Invitation</DialogTitle>
                <DialogDescription>
                  Invite a new team member to join this organization
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="contact">Email or Phone *</Label>
                  <Input
                    id="contact"
                    type="text"
                    placeholder="user@example.com or +1234567890"
                    value={formData.inviteeContact}
                    onChange={(e) =>
                      setFormData({ ...formData, inviteeContact: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: Role) =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Input
                    id="message"
                    placeholder="Welcome to the team!"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createInvitation.isPending}>
                  {createInvitation.isPending ? "Sending..." : "Send Invitation"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <InvitationsSkeleton />
      ) : invitations && invitations.length > 0 ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell className="font-medium">
                    {invitation.inviteeContact}
                  </TableCell>
                  <TableCell>
                    <Badge className="capitalize">{invitation.assignedRole}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[invitation.status]}>
                      {invitation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(invitation.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      {invitation.status === "pending" && (
                        <>
                          {permissions.canResendInvitations && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResend(invitation.id)}
                              disabled={resendInvitation.isPending}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          {permissions.canRevokeInvitations && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancel(invitation.id)}
                              disabled={cancelInvitation.isPending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}
