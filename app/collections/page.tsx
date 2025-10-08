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
import { FolderOpen, Plus, Search, Lock, Globe, Heart, Eye, Layers, TrendingUp, Clock, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useAllCollections } from "@/hooks/use-collections"
import { useStats } from "@/hooks/use-stats"
import { Collection } from "@/lib/firebase/types"
import { toast } from "sonner"

export default function CollectionsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popular")
  const [activeTab, setActiveTab] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  // Fetch hook for refreshing
  const { refresh: refreshCollections } = useAllCollections({
    userId: user?.uid,
    orderBy: 'updatedAt',
    order: "desc",
    limit: 50,
  })

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

  // Handle thumbnail upload
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }
      setThumbnailFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setThumbnailPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  // Upload image to base64 or external service
  const uploadThumbnail = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size <= 1024 * 1024) {
        // Base64 for small files
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      } else {
        // Compress for larger files
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.onload = () => {
          let { width, height } = img
          const maxWidth = 800
          const maxHeight = 600
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width *= ratio
            height *= ratio
          }
          canvas.width = width
          canvas.height = height
          ctx?.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL(file.type, 0.8))
        }
        img.onerror = () => reject(new Error('Failed to process image'))
        img.src = URL.createObjectURL(file)
      }
    })
  }

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

      // Upload thumbnail if provided
      let coverImage = ''
      if (thumbnailFile) {
        coverImage = await uploadThumbnail(thumbnailFile)
      }

      // Attach Firebase ID token to authorize server-side write
      const idToken = await user.getIdToken()
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name,
          description,
          userName: user.displayName || user.email,
          isPublic: visibility === 'public',
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
          coverImage,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Collection created successfully!')
        setIsCreateDialogOpen(false)
        setThumbnailFile(null)
        setThumbnailPreview(null)
        // Refresh collections instead of page reload
        refreshCollections()
      } else {
        toast.error(`Failed to create collection: ${result.error}${result.details ? ' - ' + result.details : ''}`)
      }
    } catch (error) {
      console.error('Error creating collection:', error)
      toast.error('Error creating collection. Please try again.')
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
                    <div className="space-y-2">
                      <Label htmlFor="thumbnail">Collection Thumbnail (Optional)</Label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('thumbnail')?.click()}
                        className="w-full justify-start"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {thumbnailPreview ? 'Change File' : 'Choose File'}
                      </Button>
                      <input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                      {thumbnailPreview && (
                        <div className="relative mt-2 aspect-video overflow-hidden rounded-lg border">
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Recommended: 800x600px or similar aspect ratio, max 5MB
                      </p>
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
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-0 h-auto p-1">
            <TabsTrigger value="all" className="text-xs sm:text-sm py-2.5 sm:py-2">
              <span className="hidden sm:inline">All Collections</span>
              <span className="sm:hidden">All</span>
            </TabsTrigger>
            <TabsTrigger value="public" className="text-xs sm:text-sm py-2.5 sm:py-2">
              <Globe className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Public</span>
              <span className="sm:hidden ml-1">Public</span>
            </TabsTrigger>
            <TabsTrigger value="private" className="text-xs sm:text-sm py-2.5 sm:py-2">
              <Lock className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Private</span>
              <span className="sm:hidden ml-1">Private</span>
            </TabsTrigger>
            <TabsTrigger value="mine" className="text-xs sm:text-sm py-2.5 sm:py-2">
              <span className="hidden sm:inline">My Collections</span>
              <span className="sm:hidden">Mine</span>
            </TabsTrigger>
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
                    className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                    onClick={() => router.push(`/collections/${collection.id}`)}
                  >
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

                    <CardHeader>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {collection.name}
                      </CardTitle>
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
                      <div 
                        className="flex items-center gap-2 pt-2 border-t cursor-pointer hover:bg-muted/50 -mx-6 px-6 py-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/user/${collection.userId}`)
                        }}
                      >
                        <Avatar className="h-8 w-8 hover:scale-105 transition-transform">
                          <AvatarFallback>{collection.userName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium hover:text-primary truncate">
                            {collection.userName || 'Anonymous'}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(collection.updatedAt)}
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-0">
                      <Button 
                        variant="outline" 
                        className="w-full bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/collections/${collection.id}`)
                        }}
                      >
                        View Collection
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
