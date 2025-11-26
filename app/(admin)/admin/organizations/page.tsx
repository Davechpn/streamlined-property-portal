"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAllOrganizations, useUpdateOrganizationStatus } from "@/lib/hooks/useAdmin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, Search } from "lucide-react"
import { Toaster, toast } from "sonner"
import type { OrganizationStatus } from "@/lib/types"

function TableSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  )
}

export default function AdminOrganizationsPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrganizationStatus | "all">("all")
  const [selectedOrg, setSelectedOrg] = useState<{ id: string; name: string; newStatus: OrganizationStatus } | null>(null)

  const { data: organizations, isLoading } = useAllOrganizations({
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    limit: 50,
  })

  const updateStatusMutation = useUpdateOrganizationStatus()

  const handleStatusChange = (orgId: string, orgName: string, newStatus: OrganizationStatus) => {
    setSelectedOrg({ id: orgId, name: orgName, newStatus })
  }

  const confirmStatusChange = async () => {
    if (!selectedOrg) return

    try {
      await updateStatusMutation.mutateAsync({
        orgId: selectedOrg.id,
        status: selectedOrg.newStatus,
      })
      toast.success(`Organization status updated to ${selectedOrg.newStatus}`)
      setSelectedOrg(null)
    } catch (error) {
      toast.error("Failed to update organization status")
    }
  }

  const getStatusColor = (status?: OrganizationStatus) => {
    if (!status) return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "inactive":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "archived":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Organization Management</h2>
        <p className="text-muted-foreground">
          View and manage all organizations on the platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>
            {organizations?.length || 0} organizations found
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as OrganizationStatus | "all")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {isLoading ? (
            <TableSkeleton />
          ) : organizations && organizations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  {/* <TableHead>Owner</TableHead> */}
                  <TableHead>Members</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{org.name}</p>
                          <p className="text-xs text-muted-foreground">{org.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      <p className="text-sm">{org.ownerId}</p>
                    </TableCell> */}
                    <TableCell>
                      <span className="text-sm">-</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(org.status)}>
                        {org.status || 'unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(org.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/organizations/${org.id}`)}
                        >
                          View
                        </Button>
                        <Select
                          value={org.status || 'active'}
                          onValueChange={(value) =>
                            handleStatusChange(org.id, org.name, value as OrganizationStatus)
                          }
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No organizations found</h3>
              <p className="text-sm text-muted-foreground">
                {search || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No organizations have been created yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Toast Container */}
      <Toaster position="top-right" />

      {/* Confirmation Dialog */}
      <AlertDialog open={!!selectedOrg} onOpenChange={(open) => !open && setSelectedOrg(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status of <strong>{selectedOrg?.name}</strong> to{" "}
              <strong>{selectedOrg?.newStatus}</strong>?
              {selectedOrg?.newStatus === "inactive" && (
                <span className="block mt-2 text-yellow-600">
                  Marking an organization as inactive will prevent all members from accessing it.
                </span>
              )}
              {selectedOrg?.newStatus === "archived" && (
                <span className="block mt-2 text-destructive">
                  Archiving an organization will permanently disable it. This action should be used with caution.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
