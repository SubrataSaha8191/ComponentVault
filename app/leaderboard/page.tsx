"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Trophy,
  TrendingUp,
  Download,
  Star,
  Code,
  Crown,
  Medal,
  ChevronUp,
  ChevronDown,
  Minus,
  Sparkles,
  Loader2,
} from "lucide-react"
import Link from "next/link"

interface LeaderboardUser {
  id: string
  rank: number
  username: string
  name: string
  avatar: string | null
  components: number
  downloads: number
  rating: number
  change: string
  badges: string[]
}

interface LeaderboardStats {
  totalContributors: number
  totalDownloads: number
  avgRating: number
  activeUsers: number
}

// Mock leaderboard data (fallback)
const mockTopContributors = [
  {
    rank: 1,
    username: "johndoe",
    name: "John Doe",
    avatar: "/diverse-user-avatars.png",
    components: 24,
    downloads: 15678,
    rating: 4.9,
    change: "up",
    badges: ["Top Contributor", "Accessibility Champion"],
  },
  {
    rank: 2,
    username: "janesmith",
    name: "Jane Smith",
    avatar: "/diverse-user-avatars.png",
    components: 18,
    downloads: 12345,
    rating: 4.8,
    change: "up",
    badges: ["Community Favorite"],
  },
  {
    rank: 3,
    username: "alexchen",
    name: "Alex Chen",
    avatar: "/diverse-user-avatars.png",
    components: 16,
    downloads: 10234,
    rating: 4.7,
    change: "down",
    badges: ["Early Adopter"],
  },
  {
    rank: 4,
    username: "sarahwilson",
    name: "Sarah Wilson",
    avatar: "/diverse-user-avatars.png",
    components: 14,
    downloads: 9876,
    rating: 4.8,
    change: "same",
    badges: ["Top Contributor"],
  },
  {
    rank: 5,
    username: "mikebrown",
    name: "Mike Brown",
    avatar: "/diverse-user-avatars.png",
    components: 12,
    downloads: 8765,
    rating: 4.6,
    change: "up",
    badges: [],
  },
  {
    rank: 6,
    username: "emilydavis",
    name: "Emily Davis",
    avatar: "/diverse-user-avatars.png",
    components: 11,
    downloads: 7654,
    rating: 4.7,
    change: "down",
    badges: ["Community Favorite"],
  },
  {
    rank: 7,
    username: "davidlee",
    name: "David Lee",
    avatar: "/diverse-user-avatars.png",
    components: 10,
    downloads: 6543,
    rating: 4.5,
    change: "up",
    badges: [],
  },
  {
    rank: 8,
    username: "lisagarcia",
    name: "Lisa Garcia",
    avatar: "/diverse-user-avatars.png",
    components: 9,
    downloads: 5432,
    rating: 4.6,
    change: "same",
    badges: ["Early Adopter"],
  },
  {
    rank: 9,
    username: "tomjohnson",
    name: "Tom Johnson",
    avatar: "/diverse-user-avatars.png",
    components: 8,
    downloads: 4321,
    rating: 4.4,
    change: "down",
    badges: [],
  },
  {
    rank: 10,
    username: "annamartinez",
    name: "Anna Martinez",
    avatar: "/diverse-user-avatars.png",
    components: 7,
    downloads: 3210,
    rating: 4.5,
    change: "up",
    badges: [],
  },
]

export default function LeaderboardPage() {
  const [timePeriod, setTimePeriod] = useState("alltime")
  const [activeTab, setActiveTab] = useState("contributors")
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([])
  const [stats, setStats] = useState<LeaderboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingTab, setLoadingTab] = useState(false)

  // Fetch stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/leaderboard/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
    fetchStats()
  }, [])

  // Fetch leaderboard data when tab or period changes
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoadingTab(activeTab !== 'contributors' || !loading)
      setLoading(true)
      try {
        const response = await fetch(`/api/leaderboard?type=${activeTab}&period=${timePeriod}&limit=20`)
        if (response.ok) {
          const data = await response.json()
          setLeaderboardData(data)
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
        setLeaderboardData([])
      } finally {
        setLoading(false)
        setLoadingTab(false)
      }
    }
    fetchLeaderboard()
  }, [activeTab, timePeriod])

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const statsCards = stats ? [
    {
      label: "Total Contributors",
      value: formatNumber(stats.totalContributors),
      icon: Code,
      color: "text-purple-500",
    },
    {
      label: "Total Downloads",
      value: formatNumber(stats.totalDownloads),
      icon: Download,
      color: "text-blue-500",
    },
    {
      label: "Avg Rating",
      value: stats.avgRating.toFixed(1),
      icon: Star,
      color: "text-yellow-500",
    },
    {
      label: "Active Users",
      value: formatNumber(stats.activeUsers),
      icon: TrendingUp,
      color: "text-emerald-500",
    },
  ] : []

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return (
        <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0">
          <Crown className="h-3 w-3 mr-1" />
          1st Place
        </Badge>
      )
    if (rank === 2)
      return (
        <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0">
          <Medal className="h-3 w-3 mr-1" />
          2nd Place
        </Badge>
      )
    if (rank === 3)
      return (
        <Badge className="bg-gradient-to-r from-amber-600 to-amber-700 text-white border-0">
          <Medal className="h-3 w-3 mr-1" />
          3rd Place
        </Badge>
      )
    return null
  }

  const getChangeIcon = (change: string) => {
    if (change === "up") return <ChevronUp className="h-4 w-4 text-emerald-500" />
    if (change === "down") return <ChevronDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  const renderLeaderboard = (data: LeaderboardUser[], metric: "components" | "downloads" | "rating") => {
    if (loadingTab || loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
          <p className="text-muted-foreground">Check back later for leaderboard updates</p>
        </div>
      )
    }

    return (
    <div className="space-y-4">
      {/* Top 3 Podium */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {data.slice(0, 3).map((user) => (
          <Card
            key={user.username}
            className={`relative overflow-hidden ${
              user.rank === 1
                ? "border-2 border-yellow-500 shadow-lg shadow-yellow-500/20"
                : user.rank === 2
                  ? "border-2 border-gray-400 shadow-lg shadow-gray-400/20"
                  : "border-2 border-amber-600 shadow-lg shadow-amber-600/20"
            }`}
          >
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${
                user.rank === 1
                  ? "bg-gradient-to-r from-yellow-500 to-amber-500"
                  : user.rank === 2
                    ? "bg-gradient-to-r from-gray-400 to-gray-500"
                    : "bg-gradient-to-r from-amber-600 to-amber-700"
              }`}
            />
            <CardContent className="pt-8 text-center">
              <div className="flex justify-center mb-4">{getRankIcon(user.rank)}</div>
              <Link href={`/user/${user.username}`}>
                <Avatar className="h-20 w-20 mx-auto mb-3 border-4 border-background shadow-lg hover:scale-105 transition-transform cursor-pointer">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
              <h3 className="font-bold text-lg">{user.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">@{user.username}</p>
              {getRankBadge(user.rank)}
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Components</span>
                  <span className="font-semibold">{user.components}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Downloads</span>
                  <span className="font-semibold">{user.downloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {user.rating}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rest of the leaderboard */}
      <div className="space-y-3">
        {data.slice(3).map((user) => (
          <Card key={user.username} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted font-bold">
                  {user.rank}
                </div>

                {/* Avatar */}
                <Link href={`/user/${user.username}`}>
                  <Avatar className="h-12 w-12 border-2 border-background hover:scale-105 transition-transform cursor-pointer">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/user/${user.username}`}>
                      <h3 className="font-semibold hover:text-primary cursor-pointer">{user.name}</h3>
                    </Link>
                    {getChangeIcon(user.change)}
                  </div>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                  {user.badges.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {user.badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Code className="h-4 w-4" />
                    </div>
                    <div className="font-semibold">{user.components}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Download className="h-4 w-4" />
                    </div>
                    <div className="font-semibold">{user.downloads.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="font-semibold">{user.rating}</div>
                  </div>
                </div>

                {/* Action */}
                <Button size="sm" variant="outline">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
              Leaderboard
            </h1>
          </div>
          <p className="text-muted-foreground">Top contributors and rising stars in the community</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Time Period Filter */}
        <div className="flex justify-end mb-6">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
              <SelectItem value="yearly">This Year</SelectItem>
              <SelectItem value="alltime">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Leaderboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-0 h-auto p-1">
            <TabsTrigger value="contributors" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2.5 sm:py-2 px-2 sm:px-3">
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Top Contributors</span>
              <span className="md:hidden">Contributors</span>
            </TabsTrigger>
            <TabsTrigger value="downloads" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2.5 sm:py-2 px-2 sm:px-3">
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Most Downloads</span>
              <span className="md:hidden">Downloads</span>
            </TabsTrigger>
            <TabsTrigger value="rated" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2.5 sm:py-2 px-2 sm:px-3">
              <Star className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Highest Rated</span>
              <span className="md:hidden">Rated</span>
            </TabsTrigger>
            <TabsTrigger value="rising" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2.5 sm:py-2 px-2 sm:px-3">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Rising Stars</span>
              <span className="md:hidden">Rising</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contributors">{renderLeaderboard(leaderboardData, "components")}</TabsContent>

          <TabsContent value="downloads">{renderLeaderboard(leaderboardData, "downloads")}</TabsContent>

          <TabsContent value="rated">{renderLeaderboard(leaderboardData, "rating")}</TabsContent>

          <TabsContent value="rising">
            <Card className="mb-6 border-2 border-emerald-500/20 bg-emerald-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-500" />
                  Rising Stars
                </CardTitle>
                <CardDescription>
                  Contributors with the fastest growth this {timePeriod === 'alltime' ? 'year' : timePeriod.replace("ly", "")}
                </CardDescription>
              </CardHeader>
            </Card>
            {renderLeaderboard(leaderboardData, "components")}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
