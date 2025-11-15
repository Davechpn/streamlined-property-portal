"use client"

import { useState } from "react"
import { useUpdateMemberRole } from "@/lib/hooks/useMembers"
import { usePermissions } from "@/lib/hooks/usePermissions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import type { Role, OrganizationMemberWithUser } from "@/lib/types"

interface ChangeRoleDialogProps {
  orgId: string
  member: OrganizationMemberWithUser
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  owner: "Full control over the organization. Cannot be assigned.",
  admin: "Can manage organization settings, members, and all properties.",
  manager: "Can invite members and manage assigned properties.",
  agent: "Can view and manage assigned properties.",
  viewer: "Read-only access to organization resources.",
}

const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  manager: "Manager",
  agent: "Agent",
  viewer: "Viewer",
}

export function ChangeRoleDialog({
  orgId,
  member,
  open,
  onOpenChange,
}: ChangeRoleDialogProps) {
  const permissions = usePermissions({ orgId })
  const updateRole = useUpdateMemberRole(orgId, member.id)
  const [selectedRole, setSelectedRole] = useState<Role>(member.role)
  const [error, setError] = useState<string | null>(null)

  const assignableRoles = permissions.getAssignableRoles()
  const canChange = permissions.canChangeRole(member.role, selectedRole)
  const isUpgrade = getRolePriority(selectedRole) < getRolePriority(member.role)
  const isCriticalChange = selectedRole === "admin" || member.role === "admin"

  function getRolePriority(role: Role): number {
    const priorities: Record<Role, number> = {
      owner: 0,
      admin: 1,
      manager: 2,
      agent: 3,
      viewer: 4,
    }
    return priorities[role]
  }

  const handleSubmit = async () => {
    if (!canChange) {
      setError("You don't have permission to make this role change")
      return
    }

    if (selectedRole === member.role) {
      onOpenChange(false)
      return
    }

    setError(null)

    try {
      await updateRole.mutateAsync({ role: selectedRole })
      onOpenChange(false)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update member role")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Member Role</DialogTitle>
          <DialogDescription>
            Update the role for {member.user.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Current Role */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Role</label>
            <div className="flex items-center gap-2">
              <Badge>{ROLE_LABELS[member.role]}</Badge>
              <span className="text-sm text-muted-foreground">
                {ROLE_DESCRIPTIONS[member.role]}
              </span>
            </div>
          </div>

          {/* New Role Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">New Role</label>
            <Select value={selectedRole} onValueChange={(value: Role) => setSelectedRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assignableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRole && (
              <p className="text-sm text-muted-foreground">
                {ROLE_DESCRIPTIONS[selectedRole]}
              </p>
            )}
          </div>

          {/* Warning for critical changes */}
          {isCriticalChange && selectedRole !== member.role && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {isUpgrade ? (
                  <>
                    <strong>Important:</strong> Promoting to Admin grants extensive permissions
                    including member management and organization settings access.
                  </>
                ) : (
                  <>
                    <strong>Important:</strong> Demoting from Admin will remove their ability to
                    manage members and organization settings.
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Permission warning */}
          {!canChange && selectedRole !== member.role && (
            <Alert variant="destructive">
              <AlertDescription>
                You don't have permission to assign this role or modify this member.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !canChange ||
              selectedRole === member.role ||
              updateRole.isPending
            }
          >
            {updateRole.isPending ? "Updating..." : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
