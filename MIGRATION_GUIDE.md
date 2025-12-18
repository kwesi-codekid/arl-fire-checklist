# Employee ID Migration Guide

## Overview
The authentication system has been updated to use **Employee IDs** instead of names for login. Users now enter their employee ID, and their name is automatically fetched from the database.

## Changes Made

### 1. Database Schema Updates
- Added `employeeId` field to the User model (unique, required)
- `name` field is no longer unique (multiple users can have the same name)

### 2. Login System Updates
- Login form now accepts **Employee ID** instead of name
- Users must exist in the database before they can log in
- No auto-creation of users on first login

### 3. TypeScript Interface Updates
- Updated `User` interface to include `employeeId` field

## Migration Steps

### Step 1: Initialize First Admin (Fresh Install)

If you are starting with a **fresh database**, you need to create your first Admin user via script (since you can't log in yet).

1. Edit `app/scripts/add-user.ts` (optional, strictly to check the default admin details).
2. Run the add-user script:
   ```bash
   npm run add-user
   ```
   This creates: `Admin User` with ID `ADMIN001`.

### Step 2: Manage Users

To add more users (inspectors or admins), you must use the `add-user` script:

1. Edit `app/scripts/add-user.ts` and add your new users to the list.
2. Run the script:
   ```bash
   npm run add-user
   ```

### Step 3: Migrate Existing Users (Legacy Only)

If you have an old database with users lacking IDs:

```bash
npm run migrate-users
```

This will:
- Find all users without employee IDs
- Auto-generate employee IDs in the format: `EMP001`, `EMP002`, etc.
- Display a list of all users with their new employee IDs

**IMPORTANT:** Save the employee IDs displayed after migration. Users will need these to log in.

### Step 2: Add New Users

To add new users to the system:

1. Edit the file `app/scripts/add-user.ts`
2. Update the `newUsers` array with your user data:

```typescript
const newUsers = [
    {
        employeeId: 'EMP001',
        name: 'John Doe',
        role: 'inspector'
    },
    {
        employeeId: 'ADMIN001',
        name: 'Admin User',
        role: 'admin'
    }
];
```

3. Run the script:

```bash
npm run add-user
```

### Step 3: Distribute Employee IDs

Share the employee IDs with your users. They will need these to log in to the system.

## Login Process (After Migration)

1. Users open the login page
2. Enter their **Employee ID** (e.g., `EMP001`)
3. Click "Sign In"
4. System fetches their name from the database and logs them in

## Employee ID Format Recommendations

- **Inspectors:** `EMP001`, `EMP002`, `EMP003`, etc.
- **Admins:** `ADMIN001`, `ADMIN002`, etc.
- **Custom:** You can use any format that suits your organization

## Troubleshooting

### "Employee ID not found" Error
- The employee ID doesn't exist in the database
- Run `npm run add-user` to add the user
- Or run `npm run migrate-users` if migrating existing users

### Duplicate Employee ID Error
- Each employee ID must be unique
- Check existing users before adding new ones

### View All Users
You can view all users by running either migration script - it will display all users at the end.

## Example Users

After running the migration or add-user script, you might have:

| Employee ID | Name | Role |
|------------|------|------|
| EMP001 | John Doe | inspector |
| EMP002 | Jane Smith | inspector |
| ADMIN001 | Admin User | admin |

## Notes

- Employee IDs are case-sensitive
- Keep a record of all employee IDs for reference
- Users cannot self-register - an admin must add them to the database
