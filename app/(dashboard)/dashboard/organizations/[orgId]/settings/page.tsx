"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useOrganization, useUpdateOrganization } from "@/lib/hooks/useOrganizations"
import { usePermissions } from "@/lib/hooks/usePermissions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
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
import { Trash2, Save, Building2 } from "lucide-react"
import type { UpdateOrganizationRequest } from "@/lib/types"

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-64" />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    </div>
  )
}

export default function OrganizationSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const orgId = params?.orgId as string
  const { data: orgDetails, isLoading } = useOrganization(orgId)
  const permissions = usePermissions({ orgId })
  const updateOrg = useUpdateOrganization(orgId)

  const [formData, setFormData] = useState<UpdateOrganizationRequest>({
    name: "",
    description: "",
  })
  const [hasChanges, setHasChanges] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Initialize form when org data loads
  useState(() => {
    if (orgDetails?.organization) {
      setFormData({
        name: orgDetails.organization.name,
        description: orgDetails.organization.description || "",
      })
    }
  })

  // Check permissions
  if (!isLoading && !permissions.canViewSettings) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <Alert variant="destructive">
          <AlertDescription>
            You don't have permission to view organization settings.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading) {
    return <SettingsSkeleton />
  }

  const org = orgDetails?.organization
  if (!org) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <Alert variant="destructive">
          <AlertDescription>Organization not found.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const handleChange = (field: keyof UpdateOrganizationRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
    setError(null)
    setSuccess(null)
  }

  const handleSave = async () => {
    setError(null)
    setSuccess(null)

    if (!formData.name?.trim()) {
      setError("Organization name is required")
      return
    }

    try {
      await updateOrg.mutateAsync(formData)
      setSuccess("Organization updated successfully")
      setHasChanges(false)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update organization")
    }
  }

  const handleDelete = async () => {
    // TODO: Implement organization deletion
    alert("Organization deletion will be implemented")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Organization Settings</h2>
        <p className="text-muted-foreground">
          Manage your organization's details and preferences
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>
            Update your organization's name and description
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={!permissions.canUpdateOrganization}
              placeholder="Acme Properties"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              disabled={!permissions.canUpdateOrganization}
              placeholder="Brief description of your organization"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={org.slug}
              disabled
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              The slug is auto-generated and cannot be changed
            </p>
          </div>

          {permissions.canUpdateOrganization && (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={!hasChanges || updateOrg.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {updateOrg.isPending ? "Saving..." : "Save Changes"}
              </Button>
              {hasChanges && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      name: org.name,
                      description: org.description || "",
                    })
                    setHasChanges(false)
                    setError(null)
                    setSuccess(null)
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Organization Info */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>
            View your organization's metadata
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <p className="font-medium capitalize">{org.status}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Created</Label>
              <p className="font-medium">
                {new Date(org.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Last Active</Label>
              <p className="font-medium">
                {new Date(org.lastActive).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Owner ID</Label>
              <p className="font-medium truncate">{org.ownerId}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      {permissions.canDeleteOrganization && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Organization
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    organization "{org.name}" and remove all associated data including:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>All team members and their access</li>
                      <li>All pending invitations</li>
                      <li>All properties and listings</li>
                      <li>All activity logs</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, delete organization
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
