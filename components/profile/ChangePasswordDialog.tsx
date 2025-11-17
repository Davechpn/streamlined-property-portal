"use client"

import { useState } from "react"
import { Lock, Loader2, Eye, EyeOff, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRequestPasswordReset, useResetPassword } from "@/lib/hooks/useAuth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// Step 1: Request reset token
const requestResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

// Step 2: Reset password with token
const resetPasswordSchema = z.object({
  resetToken: z.string().min(1, "Reset token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type RequestResetFormValues = z.infer<typeof requestResetSchema>
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

interface ChangePasswordDialogProps {
  userEmail?: string | null
}

export function ChangePasswordDialog({ userEmail }: ChangePasswordDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"request" | "reset">("request")
  const [resetToken, setResetToken] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  const requestReset = useRequestPasswordReset()
  const resetPassword = useResetPassword()

  const requestForm = useForm<RequestResetFormValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: userEmail || "",
    },
  })

  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      resetToken: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onRequestReset = async (data: RequestResetFormValues) => {
    try {
      setSuccessMessage(null)
      const result = await requestReset.mutateAsync(data)
      
      // The API returns the reset token in the response for development
      // In production, this would be sent via email
      if (result.resetToken) {
        setResetToken(result.resetToken)
        resetForm.setValue("resetToken", result.resetToken)
        setSuccessMessage("Reset token generated! Check your email or enter the token below.")
        setStep("reset")
      }
    } catch (error: any) {
      console.error("Failed to request password reset:", error)
    }
  }

  const onResetPassword = async (data: ResetPasswordFormValues) => {
    try {
      setSuccessMessage(null)
      const email = requestForm.getValues("email")
      
      await resetPassword.mutateAsync({
        email,
        resetToken: data.resetToken,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      
      setSuccessMessage("Password changed successfully! You can now sign in with your new password.")
      
      // Close dialog after 3 seconds
      setTimeout(() => {
        handleClose()
      }, 3000)
    } catch (error: any) {
      console.error("Failed to reset password:", error)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setStep("request")
    setResetToken("")
    setSuccessMessage(null)
    requestForm.reset()
    resetForm.reset()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose()
      else setOpen(true)
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Lock className="h-4 w-4 mr-2" />
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            {step === "request" 
              ? "We'll send you a password reset token to your email."
              : "Enter the reset token from your email and choose a new password."
            }
          </DialogDescription>
        </DialogHeader>

        {successMessage && (
          <Alert>
            <AlertDescription className="text-green-600">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Step 1: Request Reset Token */}
        {step === "request" && (
          <Form {...requestForm}>
            <form onSubmit={requestForm.handleSubmit(onRequestReset)} className="space-y-4">
              {requestReset.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {requestReset.error instanceof Error
                      ? requestReset.error.message
                      : "Failed to request password reset. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

              <FormField
                control={requestForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          className="pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter your email to receive a password reset token
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={requestReset.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={requestReset.isPending}>
                  {requestReset.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Send Reset Token
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {/* Step 2: Reset Password */}
        {step === "reset" && (
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-4">
              {resetPassword.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {resetPassword.error instanceof Error
                      ? resetPassword.error.message
                      : "Failed to reset password. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

              <FormField
                control={resetForm.control}
                name="resetToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reset Token</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the token from your email"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Check your email for the reset token
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={resetForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={resetForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep("request")
                    resetForm.reset()
                  }}
                  disabled={resetPassword.isPending}
                >
                  Back
                </Button>
                <Button type="submit" disabled={resetPassword.isPending}>
                  {resetPassword.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Change Password
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}

