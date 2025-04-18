"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

// In a real app, you would use a database
// This is a mock implementation for demonstration purposes
const USERS_DB = new Map()

export async function registerUser({
  username,
  email,
  password,
}: {
  username: string
  email: string
  password: string
}) {
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if user already exists
  if (Array.from(USERS_DB.values()).some((user) => (user as any).email === email)) {
    return { success: false, error: "Email is already registered" }
  }

  // Create user
  const userId = `user_${Date.now()}`
  const newUser = {
    id: userId,
    username,
    email,
    password, // In a real app, you would hash this password
    createdAt: new Date().toISOString(),
    isFirstLogin: true,
  }

  // Save user
  USERS_DB.set(userId, newUser)

  // Set session cookie
  const sessionId = `session_${Date.now()}`
  cookies().set("sessionId", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser
  return { success: true, user: userWithoutPassword }
}

export async function loginUser({
  email,
  password,
}: {
  email: string
  password: string
}) {
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Find user
  const user = Array.from(USERS_DB.values()).find((user: any) => user.email === email && user.password === password)

  if (!user) {
    return { success: false, error: "Invalid email or password" }
  }

  // Set session cookie
  const sessionId = `session_${Date.now()}`
  cookies().set("sessionId", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  // Store session (in a real app, this would be in a database)
  const session = {
    id: sessionId,
    userId: user.id,
    createdAt: new Date().toISOString(),
  }

  // Check if it's the user's first login
  const isFirstLogin = user.isFirstLogin || false

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return { success: true, user: userWithoutPassword, isFirstLogin }
}

export async function setFirstLoginComplete(userId: string) {
  const user = USERS_DB.get(userId)
  if (user) {
    user.isFirstLogin = false
    USERS_DB.set(userId, user)
  }
  return { success: true }
}

export async function checkSession() {
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const sessionId = cookies().get("sessionId")?.value

  if (!sessionId) {
    return { success: false }
  }

  // In a real app, you would verify the session in a database
  // This is a mock implementation
  const userId = sessionId.replace("session_", "")
  const user = USERS_DB.get(userId)

  if (!user) {
    return { success: false }
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return { success: true, user: userWithoutPassword }
}

export async function updateUserProfile(userId: string, { username }: { username: string }) {
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = USERS_DB.get(userId)

  if (!user) {
    return { success: false, error: "User not found" }
  }

  // Update user
  user.username = username
  USERS_DB.set(userId, user)

  revalidatePath("/profile")
  return { success: true }
}

export async function updateUserPassword(
  userId: string,
  { currentPassword, newPassword }: { currentPassword: string; newPassword: string },
) {
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = USERS_DB.get(userId)

  if (!user) {
    return { success: false, error: "User not found" }
  }

  if (user.password !== currentPassword) {
    return { success: false, error: "Current password is incorrect" }
  }

  // Update password
  user.password = newPassword
  USERS_DB.set(userId, user)

  return { success: true }
}
