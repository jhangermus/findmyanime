"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { updateUserProfile, updateUserPassword } from "@/actions/auth-actions"

export default function SettingsTab() {
  const router = useRouter()
  const { user, updateUser, logout } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  async function handleProfileUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsUpdating(true)
    setUpdateSuccess(false)
    setUpdateError(null)

    const formData = new FormData(event.currentTarget)
    const username = formData.get("username") as string

    try {
      if (user?.id) {
        const result = await updateUserProfile(user.id, { username })
        if (result.success) {
          updateUser({ ...user, username })
          setUpdateSuccess(true)
        } else {
          setUpdateError(result.error || "Error updating profile")
        }
      }
    } catch (err) {
      setUpdateError("An error occurred while updating the profile")
      console.error(err)
    } finally {
      setIsUpdating(false)
    }
  }

  async function handlePasswordChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsChangingPassword(true)
    setPasswordSuccess(false)
    setPasswordError(null)

    const formData = new FormData(event.currentTarget)
    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match")
      setIsChangingPassword(false)
      return
    }

    try {
      if (user?.id) {
        const result = await updateUserPassword(user.id, { currentPassword, newPassword })
        if (result.success) {
          setPasswordSuccess(true)
          // Reset form
          event.currentTarget.reset()
        } else {
          setPasswordError(result.error || "Error changing password")
        }
      }
    } catch (err) {
      setPasswordError("An error occurred while changing the password")
      console.error(err)
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-slate-800 text-slate-200">
        <CardHeader>
          <CardTitle className="text-white">Profile Information</CardTitle>
          <CardDescription className="text-slate-400">Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          {updateSuccess && (
            <Alert className="mb-4 bg-green-900/30 border-green-800 text-green-300">
              <AlertDescription>Profile updated successfully</AlertDescription>
            </Alert>
          )}
          {updateError && (
            <Alert className="mb-4 bg-red-900/30 border-red-800 text-red-300">
              <AlertDescription>{updateError}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Email
              </Label>
              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="bg-slate-800 border-slate-700 text-slate-400"
              />
              <p className="text-xs text-slate-500">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-200">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                defaultValue={user?.username || ""}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800 text-slate-200">
        <CardHeader>
          <CardTitle className="text-white">Change Password</CardTitle>
          <CardDescription className="text-slate-400">Update your access password</CardDescription>
        </CardHeader>
        <CardContent>
          {passwordSuccess && (
            <Alert className="mb-4 bg-green-900/30 border-green-800 text-green-300">
              <AlertDescription>Password updated successfully</AlertDescription>
            </Alert>
          )}
          {passwordError && (
            <Alert className="mb-4 bg-red-900/30 border-red-800 text-red-300">
              <AlertDescription>{passwordError}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-slate-200">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-slate-200">
                New Password
              </Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-200">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isChangingPassword}>
              {isChangingPassword ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800 text-slate-200">
        <CardHeader>
          <CardTitle className="text-white">Account Management</CardTitle>
          <CardDescription className="text-slate-400">Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full border-slate-700 text-slate-300" onClick={logout}>
            Log Out
          </Button>
          <Button
            variant="destructive"
            className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400"
            onClick={() => router.push("/profile/delete-account")}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
