"use client"

import { useUser } from "@/lib/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || !user.platformAdminRole)) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || !user.platformAdminRole) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="border-b sticky top-0 z-10 bg-background">
            <div className="flex h-14 items-center px-4 lg:px-6">
              <SidebarTrigger className="mr-2" />
              <div className="flex-1" />
            </div>
          </div>
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
