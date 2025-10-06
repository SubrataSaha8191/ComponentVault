"use client"

import { useState, useEffect } from "react"
import { 
  User, MapPin, Link as LinkIcon, Calendar, Award, Star, 
  TrendingUp, Package, Heart, Download, Eye, Edit, 
  Mail, Twitter, Github, Globe, Users, Activity, Zap 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { toast } from "sonner"

// Icon mapping for achievements
const iconMap: Record<string, any> = {
  Award,
  Star,
  TrendingUp,
  Heart,
  Eye,
  Users,
  Package,
  Zap,
}

interface ProfileData {
  user: {
    uid: string
    email: string
    displayName: string
    photoURL: string
    bio: string
    website: string
    github: string
    twitter: string
    location: string
    createdAt: any
  }
  stats: {
    components: number
    downloads: number
    favorites: number
    views: number
    followers: number
    following: number
  }
}

interface ComponentData {
  id: string
  name: string
  title: string
  thumbnail: string
  downloads: number
  favorites: number
  views: number
  category: string
  framework: string
}

interface ActivityData {
  id: string
  type: string
  text: string
  description: string
  date: string
}

interface AchievementData {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

export default function ProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false)
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [components, setComponents] = useState<ComponentData[]>([])
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [achievements, setAchievements] = useState<AchievementData[]>([])
  const [loadingComponents, setLoadingComponents] = useState(false)
  const [loadingActivities, setLoadingActivities] = useState(false)

  // Get user display name and fallback
  const displayName = profileData?.user?.displayName || user?.displayName || "User"
  const email = profileData?.user?.email || user?.email || ""
  const photoURL = profileData?.user?.photoURL || user?.photoURL || ""
  
  // Create username from email or displayName
  const username = email ? email.split('@')[0] : displayName.toLowerCase().replace(/\s+/g, '')
  
  // Get initials for fallback avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      try {
        setLoading(true)
        const idToken = await user.getIdToken()
        
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }

        const data = await response.json()
        setProfileData(data)
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  // Fetch achievements
  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) return

      try {
        const idToken = await user.getIdToken()
        
        const response = await fetch('/api/profile/achievements', {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch achievements')
        }

        const data = await response.json()
        setAchievements(data.achievements)
      } catch (error) {
        console.error('Error fetching achievements:', error)
      }
    }

    fetchAchievements()
  }, [user])

  // Fetch components
  const fetchComponents = async () => {
    if (!user) return

    try {
      setLoadingComponents(true)
      const idToken = await user.getIdToken()
      
      const response = await fetch('/api/profile/components?limit=5', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch components')
      }

      const data = await response.json()
      setComponents(data.components)
    } catch (error) {
      console.error('Error fetching components:', error)
      toast.error('Failed to load components')
    } finally {
      setLoadingComponents(false)
    }
  }

  // Fetch activities
  const fetchActivities = async () => {
    if (!user) return

    try {
      setLoadingActivities(true)
      const idToken = await user.getIdToken()
      
      const response = await fetch('/api/profile/activity?limit=10', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch activities')
      }

      const data = await response.json()
      setActivities(data.activities)
    } catch (error) {
      console.error('Error fetching activities:', error)
      toast.error('Failed to load activities')
    } finally {
      setLoadingActivities(false)
    }
  }

  // Fetch data when tabs change
  useEffect(() => {
    if (user) {
      fetchComponents()
      fetchActivities()
    }
  }, [user])

  // If user is not authenticated, show login message
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <Card className="mx-auto max-w-md text-center">
          <CardContent className="p-8">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign in to view your profile</h2>
            <p className="text-muted-foreground mb-4">You need to be signed in to access your profile page.</p>
            <Link href="/">
              <Button>Go to Homepage</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-background backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="h-32 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 animate-gradient-x" />
          <CardContent className="relative pt-0 pb-6">
            {/* Avatar */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 mb-6">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl ring-2 ring-purple-500/20 hover:scale-105 transition-transform duration-300">
                <AvatarImage src={photoURL} alt={displayName} />
                <AvatarFallback className="text-3xl bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold animate-in slide-in-from-left-4 duration-500">{displayName}</h1>
                  <Badge variant="secondary" className="animate-in slide-in-from-right-4 duration-500">
                    @{username}
                  </Badge>
                </div>
                <p className="text-muted-foreground max-w-2xl animate-in fade-in duration-700">
                  {loading 
                    ? "Loading..." 
                    : profileData?.user?.bio || "UI/UX Designer & Frontend Developer. Creating beautiful, accessible components for the web."}
                </p>
                
                {/* Profile Info */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground animate-in fade-in duration-700 delay-100">
                  {profileData?.user?.location ? (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profileData.user.location}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-muted-foreground/50">Add your location</span>
                    </div>
                  )}
                  {profileData?.user?.website ? (
                    <a 
                      href={profileData.user.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-purple-600 transition-colors"
                    >
                      <LinkIcon className="h-4 w-4" />
                      <span className="text-purple-600">{profileData.user.website.replace(/^https?:\/\//, '')}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-1">
                      <LinkIcon className="h-4 w-4" />
                      <span className="text-muted-foreground/50">Add your website</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined {profileData?.user?.createdAt 
                        ? new Date(profileData.user.createdAt.toDate ? profileData.user.createdAt.toDate() : profileData.user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        : new Date(user?.metadata?.creationTime || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-2 animate-in fade-in duration-700 delay-200">
                  {profileData?.user?.twitter && (
                    <a href={`https://twitter.com/${profileData.user.twitter}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Twitter className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  {profileData?.user?.github && (
                    <a href={`https://github.com/${profileData.user.github}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Github className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  {profileData?.user?.website && (
                    <a href={profileData.user.website} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Globe className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  {!profileData?.user?.twitter && !profileData?.user?.github && !profileData?.user?.website && (
                    <>
                      <Button variant="outline" size="sm" disabled>
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        <Github className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        <Globe className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 animate-in fade-in duration-700 delay-300">
                <Button 
                  variant={isFollowing ? "outline" : "default"} 
                  className={isFollowing ? "" : "bg-purple-600 hover:bg-purple-700"}
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4" />
                </Button>
                <Link href="/settings">
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-background dark:from-purple-950/20">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {loading ? "..." : profileData?.stats?.components || 0}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Components</div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {loading ? "..." : (profileData?.stats?.downloads || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Downloads</div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-red-50 to-background dark:from-red-950/20">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {loading ? "..." : (profileData?.stats?.favorites || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Favorites</div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-background dark:from-green-950/20">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {loading ? "..." : (profileData?.stats?.views || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Views</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs for Components and Activity */}
            <Tabs defaultValue="components" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="components">Recent Components</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="components" className="space-y-4 mt-6">
                {loadingComponents ? (
                  <div className="text-center py-8 text-muted-foreground">Loading components...</div>
                ) : components.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No components yet</p>
                      <Link href="/dashboard">
                        <Button className="mt-4" size="sm">Upload Your First Component</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {components.map((component, index) => (
                      <Card 
                        key={component.id} 
                        className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              <img 
                                src={component.thumbnail || '/placeholder.svg'} 
                                alt={component.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-1 space-y-3">
                              <div>
                                <h3 className="font-semibold text-lg group-hover:text-purple-600 transition-colors">
                                  {component.name || component.title}
                                </h3>
                              </div>
                              <div className="flex gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Download className="h-4 w-4" />
                                  <span>{component.downloads.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="h-4 w-4" />
                                  <span>{component.favorites}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  <span>{component.views.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            <Link href={`/component/${component.id}`}>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Link href="/my-components">
                      <Button variant="outline" className="w-full">View All Components</Button>
                    </Link>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-3 mt-6">
                {loadingActivities ? (
                  <div className="text-center py-8 text-muted-foreground">Loading activities...</div>
                ) : activities.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No recent activity</p>
                    </CardContent>
                  </Card>
                ) : (
                  activities.map((item, index) => (
                    <Card 
                      key={item.id} 
                      className="hover:bg-muted/50 transition-all duration-300 animate-in fade-in slide-in-from-left-4"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Activity className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm">{item.text || item.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card className="animate-in fade-in slide-in-from-right-4 duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.length === 0 ? (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    No achievements yet. Keep creating!
                  </div>
                ) : (
                  achievements.map((achievement, index) => {
                    const Icon = iconMap[achievement.icon] || Award
                    return (
                      <div 
                        key={achievement.id} 
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 hover:scale-105 cursor-pointer animate-in fade-in"
                        style={{ animationDelay: `${(index + 3) * 100}ms` }}
                        title={achievement.description}
                      >
                        <Icon className={`h-6 w-6 ${achievement.color}`} />
                        <span className="font-medium text-sm">{achievement.name}</span>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Followers</span>
                    <span className="font-semibold">
                      {loading ? "..." : (profileData?.stats?.followers || 0).toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(((profileData?.stats?.followers || 0) / 100) * 100, 100)} 
                    className="h-2" 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Following</span>
                    <span className="font-semibold">
                      {loading ? "..." : (profileData?.stats?.following || 0).toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(((profileData?.stats?.following || 0) / 100) * 100, 100)} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="animate-in fade-in slide-in-from-right-4 duration-500 delay-300">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/my-components">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    My Components
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
