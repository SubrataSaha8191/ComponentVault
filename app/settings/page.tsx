"use client"

import { useState } from "react"
import { 
  User, Mail, MapPin, Link as LinkIcon, Lock, Bell, Palette, 
  Monitor, Moon, Sun, Globe, Shield, Key, Trash2, Save,
  Github, Twitter, Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [theme, setTheme] = useState("system")
  const { user } = useAuth()

  // Get user data with fallbacks
  const displayName = user?.displayName || ""
  const email = user?.email || ""
  const photoURL = user?.photoURL || ""
  const username = email ? email.split('@')[0] : displayName.toLowerCase().replace(/\s+/g, '')

  // Get initials for fallback avatar
  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  // If user is not authenticated, redirect or show message
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <Card className="mx-auto max-w-md text-center">
          <CardContent className="p-8">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign in to access settings</h2>
            <p className="text-muted-foreground mb-4">You need to be signed in to access your settings.</p>
            <Button onClick={() => window.location.href = '/'}>Go to Homepage</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-8 h-auto gap-1">
            <TabsTrigger value="profile" className="flex-col sm:flex-row gap-1 sm:gap-2 py-2.5 sm:py-2 text-xs sm:text-sm">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex-col sm:flex-row gap-1 sm:gap-2 py-2.5 sm:py-2 text-xs sm:text-sm">
              <Shield className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex-col sm:flex-row gap-1 sm:gap-2 py-2.5 sm:py-2 text-xs sm:text-sm">
              <Palette className="h-4 w-4" />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-col sm:flex-row gap-1 sm:gap-2 py-2.5 sm:py-2 text-xs sm:text-sm">
              <Bell className="h-4 w-4" />
              <span className="hidden xs:inline">Notifications</span>
              <span className="xs:hidden">Notifs</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex-col sm:flex-row gap-1 sm:gap-2 py-2.5 sm:py-2 text-xs sm:text-sm">
              <Lock className="h-4 w-4" />
              <span>Privacy</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and public profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-purple-500/20 hover:scale-105 transition-transform duration-300">
                    <AvatarImage src={photoURL} alt="Profile" />
                    <AvatarFallback className="text-xl sm:text-2xl bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <Label>Profile Picture</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">Change Avatar</Button>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto text-red-600 hover:text-red-700">
                        Remove
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="Enter your full name" defaultValue={displayName} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="Enter username" defaultValue={username} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        value={email}
                        readOnly
                        disabled
                        className="pl-10 bg-muted/50"
                        title="Email cannot be changed"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Email address from your authentication provider (cannot be changed)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        id="location" 
                        placeholder="Add your location (e.g., San Francisco, CA)" 
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell us about yourself... (e.g., UI/UX Designer & Frontend Developer. Creating beautiful, accessible components for the web.)" 
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">Brief description for your profile. Max 160 characters.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      id="website" 
                      type="url" 
                      placeholder="https://yourwebsite.com" 
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <Label>Social Links</Label>
                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Add Twitter username" className="pl-10" />
                    </div>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Add GitHub username" className="pl-10" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                  <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
                  <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700" onClick={handleSave}>
                    {saved ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>Manage your password and account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="currentPassword" type="password" className="pl-10" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="newPassword" type="password" className="pl-10" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="confirmPassword" type="password" className="pl-10" />
                    </div>
                  </div>
                </div>

                <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                  Update Password
                </Button>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-500/20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>Irreversible and destructive actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border border-red-500/20 rounded-lg">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how ComponentVault looks for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          English
                        </div>
                      </SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Display more content on screen</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable UI animations and transitions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Followers</Label>
                      <p className="text-sm text-muted-foreground">Get notified when someone follows you</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Component Comments</Label>
                      <p className="text-sm text-muted-foreground">Get notified about comments on your components</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Component Downloads</Label>
                      <p className="text-sm text-muted-foreground">Get notified when your components are downloaded</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Digest</Label>
                      <p className="text-sm text-muted-foreground">Receive a weekly summary of your activity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive updates about new features and promotions</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your privacy and data sharing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">Make your profile visible to everyone</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Email</Label>
                      <p className="text-sm text-muted-foreground">Display your email on your public profile</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Activity</Label>
                      <p className="text-sm text-muted-foreground">Let others see your recent activity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Analytics</Label>
                      <p className="text-sm text-muted-foreground">Help us improve by sharing anonymous usage data</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Data Export</Label>
                  <p className="text-sm text-muted-foreground">Download a copy of your data</p>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Request Data Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
