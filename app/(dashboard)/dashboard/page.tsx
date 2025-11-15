export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your property management portal
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Organizations</h3>
          <p className="text-2xl font-bold mt-2">-</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Team Members</h3>
          <p className="text-2xl font-bold mt-2">-</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Pending Invitations</h3>
          <p className="text-2xl font-bold mt-2">-</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">
          Use the sidebar to navigate to Organizations, Team Members, or Invitations.
        </p>
      </div>
    </div>
  )
}
