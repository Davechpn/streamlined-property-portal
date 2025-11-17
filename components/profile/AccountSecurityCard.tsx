"use client"

import { Shield, Mail, Phone, Chrome } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { User } from "@/lib/types"

interface AccountSecurityCardProps {
  user: User
}

export function AccountSecurityCard({ user }: AccountSecurityCardProps) {
  const authMethods = user.authenticationMethods

  const getAuthMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      case "google":
        return <Chrome className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getAuthMethodLabel = (method: string) => {
    switch (method.toLowerCase()) {
      case "email":
        return "Email & Password"
      case "phone":
        return "Phone (OTP)"
      case "google":
        return "Google OAuth"
      default:
        return method
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Account Security
        </CardTitle>
        <CardDescription>
          Your authentication methods and security settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-3">Active Authentication Methods</h3>
          <div className="space-y-2">
            {authMethods.map((method) => (
              <div
                key={method}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getAuthMethodIcon(method)}
                  <div>
                    <p className="font-medium text-sm">
                      {getAuthMethodLabel(method)}
                    </p>
                    {method.toLowerCase() === "email" && user.email && (
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    )}
                    {method.toLowerCase() === "phone" && user.phoneNumber && (
                      <p className="text-xs text-muted-foreground">{user.phoneNumber}</p>
                    )}
                  </div>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            ))}
          </div>
        </div>

        {authMethods.length === 1 && (
          <Alert>
            <AlertDescription className="text-sm">
              For better security, consider adding additional authentication methods to your account.
            </AlertDescription>
          </Alert>
        )}

        {!user.isEmailVerified && user.email && (
          <Alert variant="destructive">
            <AlertDescription className="text-sm">
              Your email address is not verified. Please check your inbox for a verification link.
            </AlertDescription>
          </Alert>
        )}

        {!user.isPhoneVerified && user.phoneNumber && (
          <Alert variant="destructive">
            <AlertDescription className="text-sm">
              Your phone number is not verified. Verify it for additional security.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
