"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star,
  Download,
  Eye,
  Heart,
  MapPin,
  LinkIcon,
  Calendar,
  Award,
  TrendingUp,
  MessageSquare,
  Users,
  Code,
  Trophy,
  Target,
  Zap,
  Crown,
  Shield,
} from "lucide-react"

// Mock user data
const mockUser = {
  username: "johndoe",
  name: "John Doe",
  avatar: "/diverse-user-avatars.png",
  bio: "Full-stack developer passionate about creating beautiful and accessible UI components. Open source enthusiast.",
  location: "San Francisco, CA",
  website: "https://johndoe.dev",
  joinDate: "January 2024",
  stats: {
    components: 12,
    downloads: 8934,
    followers: 234,
    following: 89,
    totalViews: 15678,
    avgRating: 4.8,
  },
  badges: [
    { id: 1, name: "Top Contributor", icon: Crown, color: "text-yellow-500", description: "100+ downloads" },
    {
      id: 2,
      name: "Accessibility Champion",
      icon: Shield,
      color: "text-blue-500",
      description: "All components A11y compliant",
    },
    { id: 3, name: "Early Adopter", icon: Zap, color: "text-purple-500", description: "Joined in first month" },
    { id: 4, name: "Community Favorite", icon: Heart, color: "text-red-500", description: "50+ favorites" },
  ],
  achievements: [
    { id: 1, name: "First Component", progress: 100, total: 1, icon: Target },
    { id: 2, name: "10 Components", progress: 100, total: 10, icon: Trophy },
    { id: 3, name: "1K Downloads", progress: 100, total: 1000, icon: TrendingUp },
    { id: 4, name: "100 Followers", progress: 234, total: 100, icon: Users },
  ],
}

const mockComponents = [
  {
    id: 1,
    name: "Animated Card",
    description: "A beautiful card with hover animations",
    category: "cards",
    frameworks: ["React", "Vue"],
    accessibilityScore: 95,
    downloads: 1234,
    rating: 4.8,
    thumbnail: "/animated-card-component.jpg",
    views: 2345,
  },
  {
    id: 2,
    name: "Navigation Menu",
    description: "Responsive navigation with dropdown support",
    category: "navigation",
    frameworks: ["React", "Svelte"],
    accessibilityScore: 98,
    downloads: 3456,
    rating: 4.9,
    thumbnail: "/navigation-menu-component.jpg",
    views: 4567,
  },
  {
    id: 3,
    name: "Form Builder",
    description: "Dynamic form with validation",
    category: "forms",
    frameworks: ["React", "Vue", "Svelte"],
    accessibilityScore: 92,
    downloads: 2345,
    rating: 4.7,
    thumbnail: "/form-builder-component.jpg",
    views: 3456,
  },
]

const mockReviews = [
  {
    id: 1,
    componentName: "Animated Card",
    rating: 5,
    comment: "Excellent component! Very smooth animations and easy to customize.",
    date: "2 days ago",
    componentId: 1,
  },
  {
    id: 2,
    componentName: "Navigation Menu",
    rating: 5,
    comment: "Perfect for my project. Great accessibility features!",
    date: "1 week ago",
    componentId: 2,
  },
  {
    id: 3,
    componentName: "Form Builder",
    rating: 4,
    comment: "Really useful component. Would love to see more validation options.",
    date: "2 weeks ago",
    componentId: 3,
  },
]

const mockActivity = [
  {
    id: 1,
    type: "component",
    action: "Published new component",
    target: "Animated Card",
    date: "2 days ago",
    icon: Code,
  },
  {
    id: 2,
    type: "review",
    action: "Reviewed",
    target: "Navigation Menu by Jane Smith",
    date: "5 days ago",
    icon: MessageSquare,
  },
  {
    id: 3,
    type: "achievement",
    action: "Earned badge",
    target: "Top Contributor",
    date: "1 week ago",
    icon: Award,
  },
  {
    id: 4,
    type: "component",
    action: "Updated component",
    target: "Form Builder",
    date: "2 weeks ago",
    icon: Code,
  },
]

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState("components")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden border-2">
          <div className="h-32 bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-500" />
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
              {/* Avatar */}
              <Avatar className="h-32 w-32 border-4 border-background -mt-16 shadow-xl">
                <AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.name} />
                <AvatarFallback className="text-3xl">{mockUser.name.charAt(0)}</AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h1 className="text-3xl font-bold">{mockUser.name}</h1>
                  <p className="text-muted-foreground">@{mockUser.username}</p>
                </div>
                <p className="text-sm max-w-2xl">{mockUser.bio}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {mockUser.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{mockUser.location}</span>
                    </div>
                  )}
                  {mockUser.website && (
                    <a
                      href={mockUser.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      <LinkIcon className="h-4 w-4" />
                      <span>{mockUser.website.replace("https://", "")}</span>
                    </a>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {mockUser.joinDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  className="flex-1 md:flex-initial"
                  variant={isFollowing ? "outline" : "default"}
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription>Components</CardDescription>
              <CardTitle className="text-3xl">{mockUser.stats.components}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Code className="h-4 w-4 mr-1" />
                <span>Published</span>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription>Total Downloads</CardDescription>
              <CardTitle className="text-3xl">{mockUser.stats.downloads.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-emerald-500">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+12% this month</span>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription>Followers</CardDescription>
              <CardTitle className="text-3xl">{mockUser.stats.followers}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                <span>{mockUser.stats.following} following</span>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription>Avg Rating</CardDescription>
              <CardTitle className="text-3xl">{mockUser.stats.avgRating}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                <span>Across all components</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badges Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Badges & Achievements
            </CardTitle>
            <CardDescription>Recognition for outstanding contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {mockUser.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg bg-muted ${badge.color}`}>
                    <badge.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockComponents.map((component) => (
                <Card
                  key={component.id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={component.thumbnail || "/placeholder.svg"}
                      alt={component.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <Badge
                      className={`absolute top-2 right-2 ${
                        component.accessibilityScore >= 95
                          ? "bg-emerald-500"
                          : component.accessibilityScore >= 90
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                      } text-white`}
                    >
                      A11y: {component.accessibilityScore}
                    </Badge>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{component.name}</CardTitle>
                    <CardDescription>{component.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {component.category}
                      </Badge>
                      {component.frameworks.map((fw) => (
                        <Badge key={fw} variant="outline" className="text-xs">
                          {fw}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{component.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>{component.downloads}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{component.rating}</span>
                      </div>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">View Component</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            {mockReviews.map((review) => (
              <Card key={review.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        Review for <span className="text-purple-600">{review.componentName}</span>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            {mockActivity.map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <activity.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.action}</span>{" "}
                        <span className="text-primary">{activity.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {mockUser.achievements.map((achievement) => (
                <Card key={achievement.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
                        <achievement.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{achievement.name}</CardTitle>
                        <CardDescription>
                          {achievement.progress >= achievement.total ? "Completed" : "In Progress"}
                        </CardDescription>
                      </div>
                      {achievement.progress >= achievement.total && (
                        <Badge className="bg-emerald-500">
                          <Trophy className="h-3 w-3 mr-1" />
                          Unlocked
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {Math.min(achievement.progress, achievement.total)} / {achievement.total}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                          style={{
                            width: `${Math.min((achievement.progress / achievement.total) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
