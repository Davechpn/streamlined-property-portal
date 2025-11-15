"use client"

import { useState } from "react"
import { useAdminActivities } from "@/lib/hooks/useAdmin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Activity as ActivityIcon } from "lucide-react"
import type { ActivityType, AdminActivity } from "@/lib/types"

function TableSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  )
}

const activityTypes: ActivityType[] = [
  "org_onboarding",
  "property_creation",
  "user_support",
  "system_configuration",
]

export default function AdminActivityPage() {
  const [typeFilter, setTypeFilter] = useState<ActivityType | "all">("all")

  const { data: activities, isLoading } = useAdminActivities({
    activityType: typeFilter !== "all" ? typeFilter : undefined,
    limit: 100,
  })

  const getEventTypeColor = (type: ActivityType) => {
    switch (type) {
      case "org_onboarding":
        return "bg-blue-500/10 text-blue-500"
      case "property_creation":
        return "bg-purple-500/10 text-purple-500"
      case "user_support":
        return "bg-green-500/10 text-green-500"
      case "system_configuration":
        return "bg-orange-500/10 text-orange-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const formatEventType = (type: ActivityType) => {
    return type.split("_").join(" ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Activity Log</h2>
        <p className="text-muted-foreground">
          Platform-wide activity and audit trail
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                {activities?.length || 0} activities recorded
              </CardDescription>
            </div>
            <Select
              value={typeFilter}
              onValueChange={(value) => setTypeFilter(value as ActivityType | "all")}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Filter by activity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="org_onboarding">Org Onboarding</SelectItem>
                <SelectItem value="property_creation">Property Creation</SelectItem>
                <SelectItem value="user_support">User Support</SelectItem>
                <SelectItem value="system_configuration">System Configuration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : activities && activities.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity Type</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Compensation</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <Badge className={getEventTypeColor(activity.activityType)}>
                        {formatEventType(activity.activityType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{activity.admin?.name}</p>
                        <p className="text-xs text-muted-foreground">{activity.admin?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {activity.organization?.name || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{activity.verificationStatus}</Badge>
                    </TableCell>
                    <TableCell>
                      ${activity.compensationValue.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ActivityIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No activities found</h3>
              <p className="text-sm text-muted-foreground">
                {typeFilter !== "all"
                  ? "Try selecting a different activity type"
                  : "No activities have been recorded yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
