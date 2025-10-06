"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import ClientOnly from "@/components/client-only"
import { FolderOpen, Plus, Search, Lock, Globe, Heart, Eye, Layers, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useAllCollections } from "@/hooks/use-collections"
import { useStats } from "@/hooks/use-stats"
import { Collection } from "@/lib/firebase/types"

export default function CollectionsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popular")
  const [activeTab, setActiveTab] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Fetch all collections with current user context
  const { collections, loading: collectionsLoading, error: collectionsError } = useAllCollections({
    userId: user?.uid,
    orderBy: 'updatedAt', // Always use updatedAt to avoid composite index issues
    order: "desc",
    limit: 50, // Add a reasonable limit
  })

  // Fetch platform statistics
  const { stats, loading: statsLoading } = useStats()

  // Format stats for display
  const formattedStats = useMemo(() => {
    if (!stats) return []
    
    return [
      {
        label: "Total Collections",
        value: stats.totalCollections.toLocaleString(),
        icon: FolderOpen,
        color: "text-purple-500",
      },
      {
        label: "Public Collections",
        value: stats.publicCollections.toLocaleString(),
        icon: Globe,
        color: "text-blue-500",
      },
      {
        label: "Total Components",
        value: stats.totalComponents >= 1000 ? `${(stats.totalComponents / 1000).toFixed(1)}K` : stats.totalComponents.toString(),
        icon: Layers,
        color: "text-emerald-500",
      },
      {
        label: "Trending",
        value: stats.trending,
        icon: TrendingUp,
        color: "text-orange-500",
      },
    ]
  }, [stats])

  // Filter and sort collections based on search and active tab
  const filteredCollections = useMemo(() => {
    if (!collections) return []

    let filtered = collections.filter((collection: Collection) => {
      const matchesSearch =
        collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "public" && collection.isPublic) ||
        (activeTab === "private" && !collection.isPublic) ||
        (activeTab === "mine" && user && collection.userId === user.uid)

      return matchesSearch && matchesTab
    })

    // Client-side sorting to avoid Firebase composite index issues
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return (b.likes || 0) - (a.likes || 0)
        case "components":
          return (b.componentIds?.length || 0) - (a.componentIds?.length || 0)
        case "likes":
          return (b.likes || 0) - (a.likes || 0)
        case "recent":
        default:
          const aDate = a.updatedAt ? ((a.updatedAt as any).toDate ? (a.updatedAt as any).toDate() : new Date(a.updatedAt)) : new Date(0)
          const bDate = b.updatedAt ? ((b.updatedAt as any).toDate ? (b.updatedAt as any).toDate() : new Date(b.updatedAt)) : new Date(0)
          return bDate.getTime() - aDate.getTime()
      }
    })

    return filtered
  }, [collections, searchQuery, activeTab, user, sortBy])

  // Handle collection creation
  const handleCreateCollection = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user || isCreating) return

    const formData = new FormData(event.currentTarget)
    
    try {
      setIsCreating(true)
      const name = formData.get('name') as string
      const description = formData.get('description') as string
      const visibility = formData.get('visibility') as string
      const tags = formData.get('tags') as string

      console.log('Creating collection with:', {
        name,
        description,
        userId: user.uid,
        userName: user.displayName || user.email,
        isPublic: visibility === 'public',
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      })

      // Attach Firebase ID token to authorize server-side write
      const idToken = await user.getIdToken();
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name,
          description,
          // userId comes from token on server to avoid spoofing
          userName: user.displayName || user.email,
          isPublic: visibility === 'public',
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      })

      const result = await response.json()
      console.log('API Response:', result)
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (response.ok) {
        setIsCreateDialogOpen(false)
        // You might want to add a refresh function to the hook instead of reloading
        window.location.reload()
      } else {
        console.error('Failed to create collection:', result)
        alert(`Failed to create collection: ${result.error}${result.details ? ' - ' + result.details : ''}`)
      }
    } catch (error) {
      console.error('Error creating collection:', error)
      alert('Error creating collection. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const formatTimeAgo = (date: Date | any) => {
    if (!date) return 'Unknown'
    
    const dateObj = (date as any).toDate ? (date as any).toDate() : new Date(date)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FolderOpen className="h-8 w-8 text-purple-500" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                Collections
              </h1>
            </div>
            <p className="text-muted-foreground">Curated sets of components for every project</p>
          </div>

          <ClientOnly>
            {user && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Create Collection
                  </Button>
                </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleCreateCollection}>
                  <DialogHeader>
                    <DialogTitle>Create New Collection</DialogTitle>
                    <DialogDescription>Organize your favorite components into a curated collection</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Collection Name</Label>
                      <Input id="name" name="name" placeholder="My Awesome Collection" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" placeholder="Describe your collection..." rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visibility">Visibility</Label>
                      <Select name="visibility" defaultValue="public">
                        <SelectTrigger id="visibility">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              Public - Anyone can view
                            </div>
                          </SelectItem>
                          <SelectItem value="private">
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4" />
                              Private - Only you can view
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input id="tags" name="tags" placeholder="dashboard, analytics, charts" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? 'Creating...' : 'Create Collection'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            )}
          </ClientOnly>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-lg" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            formattedStats.map((stat, index) => (
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
            ))
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="recent">Recently Updated</SelectItem>
              <SelectItem value="components">Most Components</SelectItem>
              <SelectItem value="likes">Most Liked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Collections</TabsTrigger>
            <TabsTrigger value="public">
              <Globe className="h-4 w-4 mr-2" />
              Public
            </TabsTrigger>
            <TabsTrigger value="private">
              <Lock className="h-4 w-4 mr-2" />
              Private
            </TabsTrigger>
            <TabsTrigger value="mine">My Collections</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {collectionsLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index}>
                    <div className="aspect-video">
                      <Skeleton className="w-full h-full" />
                    </div>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 mb-4">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <div className="flex gap-4 mb-4">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : collectionsError ? (
              <Card className="p-12 text-center">
                <div className="text-red-500 mb-4">Error loading collections</div>
                <p className="text-muted-foreground">{collectionsError}</p>
              </Card>
            ) : filteredCollections.length === 0 ? (
              <Card className="p-12 text-center">
                <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No collections found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Try adjusting your search" : "Be the first to create a collection!"}
                </p>
                <ClientOnly>
                  {!searchQuery && user && (
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Collection
                    </Button>
                  )}
                </ClientOnly>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCollections.map((collection) => (
                  <Card
                    key={collection.id}
                    className="group hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <Link href={`/collections/${collection.id}`}>
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        <img
                          src={collection.coverImage || "/placeholder.svg"}
                          alt={collection.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge variant={collection.isPublic ? "default" : "secondary"} className="gap-1">
                            {collection.isPublic ? (
                              <>
                                <Globe className="h-3 w-3" />
                                Public
                              </>
                            ) : (
                              <>
                                <Lock className="h-3 w-3" />
                                Private
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </Link>

                    <CardHeader>
                      <Link href={`/collections/${collection.id}`}>
                        <CardTitle className="group-hover:text-primary transition-colors cursor-pointer">
                          {collection.name}
                        </CardTitle>
                      </Link>
                      <CardDescription className="line-clamp-2">{collection.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Layers className="h-4 w-4" />
                          <span>{collection.componentIds?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{collection.likes || 0}</span>
                        </div>
                      </div>

                      {/* Author */}
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Link href={`/user/${collection.userId}`}>
                          <Avatar className="h-8 w-8 hover:scale-105 transition-transform cursor-pointer">
                            <AvatarFallback>{collection.userName?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/user/${collection.userId}`}>
                            <p className="text-sm font-medium hover:text-primary cursor-pointer truncate">
                              {collection.userName || 'Anonymous'}
                            </p>
                          </Link>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(collection.updatedAt)}
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-0">
                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <Link href={`/collections/${collection.id}`}>View Collection</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
