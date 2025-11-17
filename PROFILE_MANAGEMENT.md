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
Users can change their password when authenticated with email/password.

**Location**: `components/profile/ChangePasswordDialog.tsx`

**Expected API Endpoint**: `POST /api/v1/auth/change-password`

**Request Body**:
```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

> **Note**: The provided OpenAPI specification does not include a change password endpoint for authenticated users. You have two options:
> 1. Implement the `/api/v1/auth/change-password` endpoint in your backend
> 2. Guide users to use the "Forgot Password" flow (`/api/v1/auth/forgot-password` and `/api/v1/auth/reset-password`)

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
- Password strength validation
- Show/hide password toggle
- Confirmation password matching
- Success/error messaging
- Integrates with `useChangePassword` hook

### AccountSecurityCard
- Displays authentication methods with icons
- Shows verification badges
- Security alerts for unverified credentials

## API Integration

### New API Functions (`lib/api/auth.ts`)
```typescript
// Update user profile
export async function updateProfile(data: UpdateProfileRequest): Promise<User>

// Change password (requires backend implementation)
export async function changePassword(data: ChangePasswordRequest): Promise<{ success: boolean; message: string }>
```

### New Hooks (`lib/hooks/useAuth.ts`)
```typescript
// Update profile mutation
export function useUpdateProfile()

// Change password mutation
export function useChangePassword()
```

## Type Definitions

### New Types (`lib/types/index.ts`)
```typescript
export interface UpdateProfileRequest {
  name: string;
  profilePhotoUrl?: string | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

## Usage

### Profile Page
The profile page now includes:
1. **Edit Profile Button**: Opens dialog to update name and photo
2. **Change Password Button**: Opens dialog to change password (only shown for email auth users)
3. **Account Security Section**: Shows authentication methods and verification status

### Integration Example
```tsx
import { EditProfileDialog, ChangePasswordDialog, AccountSecurityCard } from "@/components/profile"

// In your profile component
<EditProfileDialog user={user} />
<ChangePasswordDialog />
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
- **New Password**:
  - Min length: 8 characters
  - Max length: 100 characters
  - Must contain: uppercase letter, lowercase letter, and number
  
- **Confirm Password**: Must match new password

## Backend Requirements

To fully support these features, your backend needs to implement:

1. **Update Profile Endpoint** (Already exists based on OpenAPI spec)
   - `PUT /api/v1/auth/profile`
   - Validates and updates user profile
   - Returns updated user data

2. **Change Password Endpoint** (Not in OpenAPI spec - needs implementation)
   - `POST /api/v1/auth/change-password`
   - Validates current password
   - Updates to new password
   - Returns success message

   **Alternative**: Direct users to the existing forgot password flow:
   - `POST /api/v1/auth/forgot-password` (already implemented)
   - `POST /api/v1/auth/reset-password` (already implemented)

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
- [ ] Change password validates current password
- [ ] New password meets requirements
- [ ] Password confirmation matching works
- [ ] Error messages display properly
- [ ] Success messages show correctly
- [ ] Dialogs close after successful operations
- [ ] Cache updates properly after mutations
- [ ] Loading states display during API calls
