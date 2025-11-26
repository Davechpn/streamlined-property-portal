# Profile Management Implementation

This document describes the profile editing and account management features implemented in the application.

## Features Implemented

### 1. Edit Profile
Users can edit their profile information including:
- **Name**: Update their display name
- **Profile Photo URL**: Add or update their profile picture

**Location**: `components/profile/EditProfileDialog.tsx`

**API Endpoint**: `PUT /api/v1/auth/profile`

**Request Body**:
```json
{
  "name": "string",
  "profilePhotoUrl": "string | null"
}
```

### 2. Change Password
Users can change their password using a secure two-step process:

**Step 1: Request Reset Token**
- User enters their email address
- System sends a reset token to their email
- For development, the token is also returned in the API response

**Step 2: Reset Password**
- User enters the reset token from their email
- User creates a new password
- Password is validated and updated

**Location**: `components/profile/ChangePasswordDialog.tsx`

**API Endpoints**: 
1. `POST /api/v1/auth/forgot-password`
   ```json
   {
     "email": "user@example.com"
   }
   ```
   Response:
   ```json
   {
     "message": "Password reset email sent",
     "resetToken": "token-for-development"
   }
   ```

2. `POST /api/v1/auth/reset-password`
   ```json
   {
     "email": "user@example.com",
     "resetToken": "token-from-email",
     "password": "newPassword123",
     "confirmPassword": "newPassword123"
   }
   ```

> **Security Note**: This uses the existing forgot-password/reset-password flow, which is more secure than a traditional "change password" endpoint as it requires email verification.

### 3. Account Security Overview
Displays user's authentication methods and verification status.

**Location**: `components/profile/AccountSecurityCard.tsx`

**Features**:
- Shows all active authentication methods (Email, Phone, Google)
- Displays verification status for email and phone
- Provides security recommendations

## Components Created

### EditProfileDialog
- Form validation using Zod
- Real-time error handling
- Success feedback
- Integrates with `useUpdateProfile` hook

### ChangePasswordDialog
- Two-step password reset process
- Step 1: Request reset token via email
- Step 2: Enter token and new password
- Password strength validation
- Show/hide password toggle
- Confirmation password matching
- Success/error messaging
- Integrates with `useRequestPasswordReset` and `useResetPassword` hooks

### AccountSecurityCard
- Displays authentication methods with icons
- Shows verification badges
- Security alerts for unverified credentials

## API Integration

### New API Functions (`lib/api/auth.ts`)
```typescript
// Update user profile
export async function updateProfile(data: UpdateProfileRequest): Promise<User>

// Request password reset (already existed, now used for password changes)
export async function requestPasswordReset(data: PasswordResetRequestRequest): Promise<{ message: string; resetToken: string }>

// Reset password with token (already existed, now used for password changes)
export async function resetPassword(data: PasswordResetRequest): Promise<{ success: boolean; message?: string }>
```

### Hooks Used (`lib/hooks/useAuth.ts`)
```typescript
// Update profile mutation
export function useUpdateProfile()

// Request password reset mutation (reused for password changes)
export function useRequestPasswordReset()

// Reset password mutation (reused for password changes)
export function useResetPassword()
```

## Type Definitions

### New/Updated Types (`lib/types/index.ts`)
```typescript
export interface UpdateProfileRequest {
  name: string;
  profilePhotoUrl?: string | null;
}

export interface PasswordResetRequestRequest {
  email: string;
}

export interface PasswordResetRequest {
  email: string;
  resetToken: string;
  password: string;
  confirmPassword: string;
}
```

## Usage

### Profile Page
The profile page now includes:
1. **Edit Profile Button**: Opens dialog to update name and photo
2. **Change Password Button**: Opens dialog with two-step password reset process (only shown for email auth users)
3. **Account Security Section**: Shows authentication methods and verification status

### Integration Example
```tsx
import { EditProfileDialog, ChangePasswordDialog, AccountSecurityCard } from "@/components/profile"

// In your profile component
<EditProfileDialog user={user} />
<ChangePasswordDialog userEmail={user.email} />
<AccountSecurityCard user={user} />
```

## Validation Rules

### Profile Update
- **Name**: 
  - Min length: 2 characters
  - Max length: 100 characters
  - Pattern: Letters, spaces, hyphens, periods, apostrophes only

- **Profile Photo URL**: 
  - Must be a valid URL (if provided)
  - Optional field

### Password Change
- **Step 1 - Request Reset**:
  - User must provide their email address
  - System validates email and sends reset token
  - Token is returned in response (for development)

- **Step 2 - Reset Password**:
  - User enters the reset token from email
  - New password must meet requirements:
    - Min length: 8 characters
    - Max length: 100 characters
    - Must contain: uppercase letter, lowercase letter, and number
  - Confirmation password must match

> **Note**: This two-step process provides additional security by requiring email verification before allowing password changes.

## Backend Requirements

To fully support these features, your backend needs to implement:

1. **Update Profile Endpoint** ✅ (Already exists based on OpenAPI spec)
   - `PUT /api/v1/auth/profile`
   - Validates and updates user profile
   - Returns updated user data

2. **Password Reset Flow** ✅ (Already implemented)
   - `POST /api/v1/auth/forgot-password`
     - Validates email
     - Generates reset token
     - Sends token via email
     - Returns token in response (useful for development/testing)
   
   - `POST /api/v1/auth/reset-password`
     - Validates reset token
     - Validates email
     - Updates password
     - Returns success message

> **Security**: The password change feature uses the existing forgot-password/reset-password flow, which is more secure than a traditional "change password" endpoint as it requires email verification. This prevents unauthorized password changes even if someone gains temporary access to an authenticated session.

## Error Handling

All components include comprehensive error handling:
- API errors are displayed in alert dialogs
- Form validation errors shown inline
- Network errors caught and displayed
- Loading states during API calls

## Future Enhancements

Potential additions based on the OpenAPI spec:
1. **Link/Unlink Authentication Methods** (`/api/v1/auth/methods/link`, `/api/v1/auth/methods/unlink`)
2. **Session Management** (View and terminate active sessions)
3. **Email Verification** (Resend verification email)
4. **Profile Photo Upload** (Direct upload instead of URL)
5. **Two-Factor Authentication** (If implemented in backend)

## Testing Checklist

- [ ] Profile update saves correctly
- [ ] Name validation works as expected
- [ ] Profile photo URL validation works
- [ ] Password reset request sends email
- [ ] Reset token is generated correctly
- [ ] Password reset with valid token works
- [ ] Invalid reset token is rejected
- [ ] Expired reset token is rejected
- [ ] New password meets requirements
- [ ] Password confirmation matching works
- [ ] Error messages display properly
- [ ] Success messages show correctly
- [ ] Dialogs close after successful operations
- [ ] Cache updates properly after mutations
- [ ] Loading states display during API calls
- [ ] Two-step password change flow works smoothly
- [ ] Email field pre-fills with user's email
