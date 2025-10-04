"use client"

import { useState } from "react"
import { 
  User, MapPin, Link as LinkIcon, Calendar, Award, Star, 
  TrendingUp, Package, Heart, Download, Eye, Edit, 
  Mail, Twitter, Github, Globe, Users, Activity 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

// Mock user data
const userData = {
  name: "Alex Johnson",
  username: "alexdesigns",
  email: "alex.johnson@example.com",
  avatar: "/placeholder-user.jpg",
  bio: "UI/UX Designer & Frontend Developer. Creating beautiful, accessible components for the web. Open source enthusiast.",
  location: "San Francisco, CA",
  website: "https://alexdesigns.dev",
  twitter: "@alexdesigns",
  github: "alexdesigns",
  joinDate: "January 2024",
  followers: 2847,
  following: 342,
  stats: {
    components: 48,
    downloads: 125340,
    favorites: 1847,
    views: 89234,
  },
  achievements: [
    { name: "Early Adopter", icon: Award, color: "text-purple-500" },
    { name: "Top Contributor", icon: Star, color: "text-yellow-500" },
    { name: "Trending Creator", icon: TrendingUp, color: "text-blue-500" },
    { name: "Community Hero", icon: Heart, color: "text-red-500" },
  ],
  recentComponents: [
    { id: 1, name: "Animated Card", downloads: 12400, favorites: 342, views: 5600, thumbnail: "/animated-card-component.jpg" },
    { id: 2, name: "Data Table", downloads: 8900, favorites: 289, views: 4300, thumbnail: "/data-table-component.png" },
    { id: 3, name: "Modal Dialog", downloads: 15200, favorites: 456, views: 7800, thumbnail: "/modal-dialog-component.png" },
  ],
  activity: [
    { type: "upload", text: "Uploaded new component: Animated Card", date: "2 hours ago" },
    { type: "favorite", text: "Favorited Navigation Menu", date: "5 hours ago" },
    { type: "achievement", text: "Earned 'Top Contributor' badge", date: "1 day ago" },
    { type: "upload", text: "Updated Data Table component", date: "2 days ago" },
  ]
}

export default function ProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false)

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
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="text-3xl bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                  {userData.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold animate-in slide-in-from-left-4 duration-500">{userData.name}</h1>
                  <Badge variant="secondary" className="animate-in slide-in-from-right-4 duration-500">
                    @{userData.username}
                  </Badge>
                </div>
                <p className="text-muted-foreground max-w-2xl animate-in fade-in duration-700">{userData.bio}</p>
                
                {/* Profile Info */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground animate-in fade-in duration-700 delay-100">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{userData.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-4 w-4" />
                    <a href={userData.website} className="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      {userData.website.replace("https://", "")}
                    </a>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {userData.joinDate}</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-2 animate-in fade-in duration-700 delay-200">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`https://twitter.com/${userData.twitter}`} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`https://github.com/${userData.github}`} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={userData.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                    </a>
                  </Button>
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
                  <div className="text-3xl font-bold text-purple-600">{userData.stats.components}</div>
                  <div className="text-sm text-muted-foreground mt-1">Components</div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">{userData.stats.downloads.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground mt-1">Downloads</div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-red-50 to-background dark:from-red-950/20">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-red-600">{userData.stats.favorites.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground mt-1">Favorites</div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-background dark:from-green-950/20">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">{userData.stats.views.toLocaleString()}</div>
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
                {userData.recentComponents.map((component, index) => (
                  <Card 
                    key={component.id} 
                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img 
                            src={component.thumbnail} 
                            alt={component.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="font-semibold text-lg group-hover:text-purple-600 transition-colors">{component.name}</h3>
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
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Link href="/my-components">
                  <Button variant="outline" className="w-full">View All Components</Button>
                </Link>
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-3 mt-6">
                {userData.activity.map((item, index) => (
                  <Card 
                    key={index} 
                    className="hover:bg-muted/50 transition-all duration-300 animate-in fade-in slide-in-from-left-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Activity className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm">{item.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                {userData.achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300 hover:scale-105 cursor-pointer animate-in fade-in"
                    style={{ animationDelay: `${(index + 3) * 100}ms` }}
                  >
                    <achievement.icon className={`h-6 w-6 ${achievement.color}`} />
                    <span className="font-medium text-sm">{achievement.name}</span>
                  </div>
                ))}
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
                    <span className="font-semibold">{userData.followers.toLocaleString()}</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Following</span>
                    <span className="font-semibold">{userData.following.toLocaleString()}</span>
                  </div>
                  <Progress value={25} className="h-2" />
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
