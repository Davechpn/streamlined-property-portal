"use client"

import { useState } from "react"
import { useUserInvitations, useCancelInvitation } from "@/lib/hooks/useInvitations"
import { useCurrentOrganization } from "@/lib/hooks/useOrganizations"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SendInvitationDialog } from "@/components/invitations/SendInvitationDialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Mail,
  Phone,
  UserPlus,
  X,
  Clock,
  AlertCircle,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { InvitationWithDetails } from "@/lib/types"

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="border-dashed">
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <UserPlus className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      </div>
    </Card>
  )
}

function InvitationRow({
  invitation,
  type,
  onCancel,
}: {
  invitation: InvitationWithDetails
  type: "sent" | "received"
  onCancel?: (id: string) => void
}) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const contact = invitation.email || invitation.phoneNumber

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            {invitation.email ? (
              <Mail className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Phone className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <div className="font-medium">{type === "sent" ? contact : invitation.organizationName}</div>
            <div className="text-sm text-muted-foreground">
              {type === "sent" ? invitation.organizationName : `From ${invitation.inviterName}`}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(invitation.status)}>
          {invitation.status}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{invitation.role}</Badge>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          {invitation.isExpired ? (
            <span className="text-red-600">Expired</span>
          ) : (
            <span className="text-muted-foreground">
              {invitation.daysRemaining} days left
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDistanceToNow(new Date(invitation.createdAt), { addSuffix: true })}
      </TableCell>
      <TableCell className="text-right">
        {type === "sent" && invitation.status.toLowerCase() === "pending" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCancel?.(invitation.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}

export default function InvitationsPage() {
  const [activeTab, setActiveTab] = useState<"sent" | "received">("received")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { data, isLoading } = useUserInvitations()
  const { data: currentOrg } = useCurrentOrganization()
  const cancelInvitation = useCancelInvitation()

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this invitation?")) return

    setError(null)
    try {
      await cancelInvitation.mutateAsync(id)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to cancel invitation")
    }
  }

  // Filter invitations by current organization
  const sentInvitations = currentOrg 
    ? (data?.sentInvitations || []).filter(inv => inv.organizationId === currentOrg.id)
    : []
  const receivedInvitations = data?.receivedInvitations || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invitations</h2>
          <p className="text-muted-foreground">
            {currentOrg 
              ? `Manage invitations for ${currentOrg.name}`
              : "Manage invitations you've sent and received"
            }
          </p>
        </div>
        {currentOrg && (
          <Button onClick={() => setIsDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Send Invitation
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === "received" ? "default" : "ghost"}
          onClick={() => setActiveTab("received")}
          className="rounded-b-none"
        >
          <Clock className="mr-2 h-4 w-4" />
          Received ({receivedInvitations.length})
        </Button>
        <Button
          variant={activeTab === "sent" ? "default" : "ghost"}
          onClick={() => setActiveTab("sent")}
          className="rounded-b-none"
        >
          <Mail className="mr-2 h-4 w-4" />
          Sent ({sentInvitations.length})
        </Button>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <Card>
          {activeTab === "received" ? (
            receivedInvitations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receivedInvitations.map((invitation) => (
                    <InvitationRow
                      key={invitation.id}
                      invitation={invitation}
                      type="received"
                    />
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState
                title="No invitations received"
                description="You haven't received any organization invitations yet"
              />
            )
          ) : (
            sentInvitations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sentInvitations.map((invitation) => (
                    <InvitationRow
                      key={invitation.id}
                      invitation={invitation}
                      type="sent"
                      onCancel={handleCancel}
                    />
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState
                title="No invitations sent"
                description="You haven't sent any invitations yet"
              />
            )
          )}
        </Card>
      )}

      <SendInvitationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        defaultOrganizationId={currentOrg?.id}
      />
    </div>
  )
}
