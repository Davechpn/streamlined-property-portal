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
import { Trash2, Save, Building2, Upload, Image as ImageIcon, CheckCircle2, Loader2 } from "lucide-react"
import type { UpdateOrganizationRequest } from "@/lib/types"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null
  
  return (
    <div className="text-sm text-destructive mt-1">
      {errors.map((error, index) => (
        <p key={index}>{error}</p>
      ))}
    </div>
  )
}

function SettingsSkeleton() {
  return (
    <div className="max-w-5xl space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-32 w-32 rounded-lg" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
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
    website: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    timezone: "",
    currency: "",
  })
  const [hasChanges, setHasChanges] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [success, setSuccess] = useState<string | null>(null)

  // Initialize form when org data loads
  useState(() => {
    if (orgDetails?.organization) {
      setFormData({
        name: orgDetails.organization.name,
        description: orgDetails.organization.description || "",
        website: orgDetails.organization.website || "",
        phoneNumber: orgDetails.organization.phoneNumber || "",
        address: orgDetails.organization.address || "",
        city: orgDetails.organization.city || "",
        state: orgDetails.organization.state || "",
        country: orgDetails.organization.country || "",
        postalCode: orgDetails.organization.postalCode || "",
        timezone: orgDetails.organization.timezone || "",
        currency: orgDetails.organization.currency || "",
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
    setFieldErrors({})
    setSuccess(null)
  }

  const handleSave = async () => {
    setError(null)
    setFieldErrors({})
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
      // Handle validation errors with field-specific messages
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors)
        setError(err.response.data.message || "Please fix the validation errors below")
      } else {
        setError(err.response?.data?.message || "Failed to update organization")
      }
    }
  }

  const handleDelete = async () => {
    // TODO: Implement organization deletion
    alert("Organization deletion will be implemented")
  }

  return (
    <div className="max-w-5xl space-y-8 pb-16">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Organization Settings</h1>
        <p className="text-lg text-muted-foreground">
          Manage your organization's profile, contact information, and preferences
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="animate-in slide-in-from-top-2">
          <AlertDescription className="flex items-center gap-2">
            <span className="font-medium">{error}</span>
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="animate-in slide-in-from-top-2 border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-100">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="flex items-center gap-2">
            <span className="font-medium">{success}</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Organization Branding */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Organization Branding</CardTitle>
              <CardDescription>
                Upload your organization logo and customize your identity
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Logo Upload */}
          <div className="space-y-4">
            <Label>Organization Logo</Label>
            <div className="flex items-start gap-6">
              <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50">
                {org?.name ? (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-2xl font-bold text-primary-foreground">
                      {org.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs text-muted-foreground">Logo</span>
                  </div>
                ) : (
                  <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Upload a square image (recommended: 512x512px). Supported formats: JPG, PNG, SVG
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={!permissions.canUpdateOrganization}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      disabled={!permissions.canUpdateOrganization}
                      className="text-muted-foreground"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Organization Name & Description */}
          <div className="grid gap-6 md:grid-cols-1">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-semibold">
                Organization Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={!permissions.canUpdateOrganization}
                placeholder="Acme Properties"
                className={`h-11 ${fieldErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
              <FieldError errors={fieldErrors.name} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                disabled={!permissions.canUpdateOrganization}
                placeholder="Tell us about your organization..."
                rows={4}
                className={fieldErrors.description ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              <FieldError errors={fieldErrors.description} />
              <p className="text-xs text-muted-foreground">
                Brief description of your organization and what you do
              </p>
            </div>
          </div>
        </CardContent>
        {permissions.canUpdateOrganization && (
          <div className="border-t bg-muted/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {hasChanges ? "You have unsaved changes" : "All changes saved"}
              </p>
              <div className="flex gap-2">
                {hasChanges && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setFormData({
                        name: org.name,
                        description: org.description || "",
                        website: org.website || "",
                        phoneNumber: org.phoneNumber || "",
                        address: org.address || "",
                        city: org.city || "",
                        state: org.state || "",
                        country: org.country || "",
                        postalCode: org.postalCode || "",
                        timezone: org.timezone || "",
                        currency: org.currency || "",
                      })
                      setHasChanges(false)
                      setError(null)
                      setFieldErrors({})
                      setSuccess(null)
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges || updateOrg.isPending}
                  className="gap-2"
                >
                  {updateOrg.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Contact Information */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            How people can reach your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                disabled={!permissions.canUpdateOrganization}
                placeholder="https://example.com"
                className={fieldErrors.website ? "border-destructive" : ""}
              />
              <FieldError errors={fieldErrors.website} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                disabled={!permissions.canUpdateOrganization}
                placeholder="+1 (555) 123-4567"
                className={fieldErrors.phoneNumber ? "border-destructive" : ""}
              />
              <FieldError errors={fieldErrors.phoneNumber} />
            </div>
          </div>
        </CardContent>
        {permissions.canUpdateOrganization && (
          <div className="border-t bg-muted/30 px-6 py-4">
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={!hasChanges || updateOrg.isPending}
                className="gap-2"
              >
                {updateOrg.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Address Information */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <CardTitle>Address Information</CardTitle>
          <CardDescription>
            Your organization's physical location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              disabled={!permissions.canUpdateOrganization}
              placeholder="123 Main Street"
              className={fieldErrors.address ? "border-destructive" : ""}
            />
            <FieldError errors={fieldErrors.address} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                disabled={!permissions.canUpdateOrganization}
                placeholder="New York"
                className={fieldErrors.city ? "border-destructive" : ""}
              />
              <FieldError errors={fieldErrors.city} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
                disabled={!permissions.canUpdateOrganization}
                placeholder="NY"
                className={fieldErrors.state ? "border-destructive" : ""}
              />
              <FieldError errors={fieldErrors.state} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                disabled={!permissions.canUpdateOrganization}
                placeholder="United States"
                className={fieldErrors.country ? "border-destructive" : ""}
              />
              <FieldError errors={fieldErrors.country} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleChange("postalCode", e.target.value)}
                disabled={!permissions.canUpdateOrganization}
                placeholder="10001"
                className={fieldErrors.postalCode ? "border-destructive" : ""}
              />
              <FieldError errors={fieldErrors.postalCode} />
            </div>
          </div>
        </CardContent>
        {permissions.canUpdateOrganization && (
          <div className="border-t bg-muted/30 px-6 py-4">
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={!hasChanges || updateOrg.isPending}
                className="gap-2"
              >
                {updateOrg.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Regional Settings */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <CardTitle>Regional Settings</CardTitle>
          <CardDescription>
            Configure timezone and currency preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={formData.timezone}
                onChange={(e) => handleChange("timezone", e.target.value)}
                disabled={!permissions.canUpdateOrganization}
                placeholder="America/New_York"
                className={fieldErrors.timezone ? "border-destructive" : ""}
              />
              <FieldError errors={fieldErrors.timezone} />
              <p className="text-xs text-muted-foreground">
                Used for scheduling and timestamps
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={formData.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                disabled={!permissions.canUpdateOrganization}
                placeholder="USD"
                className={fieldErrors.currency ? "border-destructive" : ""}
                maxLength={3}
              />
              <FieldError errors={fieldErrors.currency} />
              <p className="text-xs text-muted-foreground">
                ISO 4217 currency code (e.g., USD, EUR, GBP)
              </p>
            </div>
          </div>
        </CardContent>
        {permissions.canUpdateOrganization && (
          <div className="border-t bg-muted/30 px-6 py-4">
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={!hasChanges || updateOrg.isPending}
                className="gap-2"
              >
                {updateOrg.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Organization Info */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <CardTitle>Organization Metadata</CardTitle>
          <CardDescription>
            Read-only information about your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Status</Label>
              <p className="flex items-center gap-2 font-medium">
                <span className={`h-2 w-2 rounded-full ${org.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                {org.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Member Count</Label>
              <p className="font-medium">{org.memberCount || 0} members</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Created</Label>
              <p className="font-medium">
                {new Date(org.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Last Updated</Label>
              <p className="font-medium">
                {new Date(org.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            {org.joinedAt && (
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">You Joined</Label>
                <p className="font-medium">
                  {new Date(org.joinedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
            {org.userRole && (
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Your Role</Label>
                <p className="font-medium capitalize">{org.userRole}</p>
              </div>
            )}
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
