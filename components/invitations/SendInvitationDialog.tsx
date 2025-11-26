"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useSendInvitation } from "@/lib/hooks/useInvitations"
import { useOrganizations } from "@/lib/hooks/useOrganizations"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Phone } from "lucide-react"
import type { Role } from "@/lib/types"

interface SendInvitationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultOrganizationId?: string
}

interface InvitationFormData {
  organizationId: string
  contactType: "email" | "phone"
  email?: string
  phoneNumber?: string
  role: Role
  message?: string
}

const roles: { value: Role; label: string; description: string }[] = [
  { value: "viewer", label: "Viewer", description: "Can view organization data" },
  { value: "agent", label: "Agent", description: "Can manage properties and leads" },
  { value: "manager", label: "Manager", description: "Can manage team and settings" },
  { value: "admin", label: "Admin", description: "Full access except ownership transfer" },
]

export function SendInvitationDialog({
  open,
  onOpenChange,
  defaultOrganizationId,
}: SendInvitationDialogProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { data: organizations, isLoading: orgsLoading } = useOrganizations()
  const sendInvitation = useSendInvitation()

  const form = useForm<InvitationFormData>({
    defaultValues: {
      organizationId: defaultOrganizationId || "",
      contactType: "email",
      role: "viewer",
    },
  })

  const contactType = form.watch("contactType")
  
  // Get the current organization name for display
  const currentOrganization = organizations?.find(org => org.id === defaultOrganizationId)

  const onSubmit = async (data: InvitationFormData) => {
    setError(null)
    setSuccess(false)

    try {
      const payload = {
        organizationId: data.organizationId,
        email: data.contactType === "email" ? data.email : undefined,
        phoneNumber: data.contactType === "phone" ? data.phoneNumber : undefined,
        role: data.role,
        message: data.message,
      }

      const result = await sendInvitation.mutateAsync(payload)
      
      if (result.success) {
        setSuccess(true)
        form.reset()
        setTimeout(() => {
          onOpenChange(false)
          setSuccess(false)
        }, 2000)
      } else {
        setError(result.errors?.join(", ") || "Failed to send invitation")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send invitation")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Send Invitation</DialogTitle>
          <DialogDescription>
            {currentOrganization 
              ? `Invite someone to join ${currentOrganization.name}`
              : "Invite someone to join your organization"
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>Invitation sent successfully!</AlertDescription>
              </Alert>
            )}

            {!defaultOrganizationId && (
              <FormField
                control={form.control}
                name="organizationId"
                rules={{ required: "Organization is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {orgsLoading ? (
                          <div className="flex items-center justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : (
                          organizations?.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="contactType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Method</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="email">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </div>
                      </SelectItem>
                      <SelectItem value="phone">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {contactType === "email" ? (
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="phoneNumber"
                rules={{
                  required: "Phone number is required",
                  pattern: {
                    value: /^\+?[1-9]\d{1,14}$/,
                    message: "Invalid phone number (use international format)",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormDescription>Include country code (e.g., +1)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="role"
              rules={{ required: "Role is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{role.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {role.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a personal message..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Max 500 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={sendInvitation.isPending}>
                {sendInvitation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send Invitation
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
