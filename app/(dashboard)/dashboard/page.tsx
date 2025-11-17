"use client"

import { useOrganizations, useCurrentOrganization } from "@/lib/hooks/useOrganizations"
import { useMembers } from "@/lib/hooks/useMembers"
import { useOrganizationInvitations } from "@/lib/hooks/useInvitations"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Users, Mail, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-64 mt-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  )
}

function EmptyState() {
  const router = useRouter()

  return (
    <Card className="border-dashed">
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Building2 className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">Welcome to Property Portal</h3>
        <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-md">
          Get started by creating your first organization to manage properties and team members
        </p>
        <Button onClick={() => router.push("/dashboard/organizations")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Organization
        </Button>
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: organizations, isLoading: orgsLoading } = useOrganizations()
  const { data: currentOrg, isLoading: currentOrgLoading } = useCurrentOrganization()
  const { data: members } = useMembers(currentOrg?.id || "")
  const { data: invitationsData } = useOrganizationInvitations(currentOrg?.id || "")

  const isLoading = orgsLoading || currentOrgLoading

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (!organizations || organizations.length === 0) {
    return <EmptyState />
  }

  const pendingInvitations = invitationsData?.sentInvitations?.filter((inv) => inv.status.toLowerCase() === "pending") || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {currentOrg?.name || "Dashboard"}
        </h2>
        <p className="text-muted-foreground">
          Overview of your property management activities
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card 
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push("/dashboard/organizations")}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Organizations</h3>
              <p className="text-2xl font-bold mt-1">{organizations.length}</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => currentOrg && router.push(`/dashboard/organizations/${currentOrg.id}/members`)}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Team Members</h3>
              <p className="text-2xl font-bold mt-1">{members?.length || 0}</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push("/dashboard/invitations")}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
              <Mail className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Pending Invitations</h3>
              <p className="text-2xl font-bold mt-1">{pendingInvitations.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/organizations")}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Manage Organizations
            </Button>
            {currentOrg && (
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push(`/dashboard/organizations/${currentOrg.id}/members`)}
              >
                <Users className="mr-2 h-4 w-4" />
                View Team Members
              </Button>
            )}
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/invitations")}
            >
              <Mail className="mr-2 h-4 w-4" />
              Manage Invitations
            </Button>
          </div>
        </Card>

        {currentOrg && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Current Organization</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{currentOrg.name}</p>
              </div>
              {currentOrg.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{currentOrg.description}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{currentOrg.status}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

