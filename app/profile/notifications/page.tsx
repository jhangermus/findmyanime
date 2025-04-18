"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"

export default function NotificationsPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const [settings, setSettings] = useState({
    newReleases: true,
    recommendations: true,
    watchlistReminders: false,
    newsletter: false,
    emailNotifications: true,
  })

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting],
    })
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // In a real app, this would call an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <Button variant="ghost" className="text-slate-400 hover:text-white mb-2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
          <h1 className="text-2xl font-bold text-white">Notification Settings</h1>
          <p className="text-slate-400">Manage how and when you receive notifications</p>
        </div>

        {success && (
          <Alert className="mb-6 bg-green-900/30 border-green-800 text-green-300">
            <AlertDescription>Notification settings saved successfully</AlertDescription>
          </Alert>
        )}

        <Card className="bg-slate-900 border-slate-800 text-slate-200 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Content Notifications</CardTitle>
            <CardDescription className="text-slate-400">Control notifications about anime content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="new-releases" className="text-slate-200">
                  New Releases
                </Label>
                <p className="text-xs text-slate-400">Get notified when new anime episodes are released</p>
              </div>
              <Switch
                id="new-releases"
                checked={settings.newReleases}
                onCheckedChange={() => handleToggle("newReleases")}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="recommendations" className="text-slate-200">
                  Recommendations
                </Label>
                <p className="text-xs text-slate-400">Receive personalized anime recommendations</p>
              </div>
              <Switch
                id="recommendations"
                checked={settings.recommendations}
                onCheckedChange={() => handleToggle("recommendations")}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="watchlist-reminders" className="text-slate-200">
                  Watchlist Reminders
                </Label>
                <p className="text-xs text-slate-400">Get reminders about anime in your watchlist</p>
              </div>
              <Switch
                id="watchlist-reminders"
                checked={settings.watchlistReminders}
                onCheckedChange={() => handleToggle("watchlistReminders")}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-200 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Communication Preferences</CardTitle>
            <CardDescription className="text-slate-400">Manage how we communicate with you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="newsletter" className="text-slate-200">
                  Newsletter
                </Label>
                <p className="text-xs text-slate-400">Receive our weekly anime newsletter</p>
              </div>
              <Switch
                id="newsletter"
                checked={settings.newsletter}
                onCheckedChange={() => handleToggle("newsletter")}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications" className="text-slate-200">
                  Email Notifications
                </Label>
                <p className="text-xs text-slate-400">Receive notifications via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle("emailNotifications")}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  )
}
