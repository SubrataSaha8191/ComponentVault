"use client"

import { useState } from "react"
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
import { FolderOpen, Plus, Search, Lock, Globe, Heart, Eye, Layers, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

// Mock collections data
const collections = [
  {
    id: "1",
    name: "E-commerce Essentials",
    description: "Complete set of components for building modern e-commerce websites",
    components: 24,
    likes: 156,
    views: 2340,
    isPublic: true,
    author: {
      name: "John Doe",
      username: "johndoe",
      avatar: "/diverse-user-avatars.png",
    },
    thumbnail: "/ecommerce-components.png",
    tags: ["E-commerce", "Shopping", "Cart"],
    updatedAt: "2 days ago",
  },
  {
    id: "2",
    name: "Dashboard Components",
    description: "Professional dashboard components with charts and analytics",
    components: 18,
    likes: 234,
    views: 3450,
    isPublic: true,
    author: {
      name: "Jane Smith",
      username: "janesmith",
      avatar: "/diverse-user-avatars.png",
    },
    thumbnail: "/dashboard-analytics.png",
    tags: ["Dashboard", "Analytics", "Charts"],
    updatedAt: "1 week ago",
  },
  {
    id: "3",
    name: "Authentication UI",
    description: "Beautiful login, signup, and password reset components",
    components: 12,
    likes: 189,
    views: 2890,
    isPublic: true,
    author: {
      name: "Alex Chen",
      username: "alexchen",
      avatar: "/diverse-user-avatars.png",
    },
    thumbnail: "/authentication-forms.jpg",
    tags: ["Auth", "Forms", "Security"],
    updatedAt: "3 days ago",
  },
  {
    id: "4",
    name: "My Private Collection",
    description: "Personal collection of experimental components",
    components: 8,
    likes: 0,
    views: 45,
    isPublic: false,
    author: {
      name: "Current User",
      username: "currentuser",
      avatar: "/diverse-user-avatars.png",
    },
    thumbnail: "/diverse-ui-components.png",
    tags: ["Experimental", "WIP"],
    updatedAt: "1 day ago",
  },
  {
    id: "5",
    name: "Landing Page Kit",
    description: "Hero sections, features, testimonials, and more",
    components: 32,
    likes: 312,
    views: 4560,
    isPublic: true,
    author: {
      name: "Sarah Wilson",
      username: "sarahwilson",
      avatar: "/diverse-user-avatars.png",
    },
    thumbnail: "/landing-page-sections.jpg",
    tags: ["Landing", "Marketing", "Hero"],
    updatedAt: "5 days ago",
  },
  {
    id: "6",
    name: "Form Components",
    description: "Advanced form inputs, validation, and multi-step forms",
    components: 16,
    likes: 167,
    views: 2120,
    isPublic: true,
    author: {
      name: "Mike Brown",
      username: "mikebrown",
      avatar: "/diverse-user-avatars.png",
    },
    thumbnail: "/form-inputs.jpg",
    tags: ["Forms", "Validation", "Input"],
    updatedAt: "1 week ago",
  },
]

const stats = [
  {
    label: "Total Collections",
    value: "1,234",
    icon: FolderOpen,
    color: "text-purple-500",
  },
  {
    label: "Public Collections",
    value: "892",
    icon: Globe,
    color: "text-blue-500",
  },
  {
    label: "Total Components",
    value: "15.6K",
    icon: Layers,
    color: "text-emerald-500",
  },
  {
    label: "Trending",
    value: "+23%",
    icon: TrendingUp,
    color: "text-orange-500",
  },
]

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popular")
  const [activeTab, setActiveTab] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredCollections = collections.filter((collection) => {
    const matchesSearch =
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "public" && collection.isPublic) ||
      (activeTab === "private" && !collection.isPublic) ||
      (activeTab === "mine" && collection.author.username === "currentuser")

    return matchesSearch && matchesTab
  })

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

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
                <DialogDescription>Organize your favorite components into a curated collection</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Collection Name</Label>
                  <Input id="name" placeholder="My Awesome Collection" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe your collection..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select defaultValue="public">
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
                  <Input id="tags" placeholder="dashboard, analytics, charts" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>Create Collection</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
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
            {filteredCollections.length === 0 ? (
              <Card className="p-12 text-center">
                <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No collections found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Try adjusting your search" : "Be the first to create a collection!"}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Collection
                  </Button>
                )}
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
                          src={collection.thumbnail || "/placeholder.svg"}
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
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {collection.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Layers className="h-4 w-4" />
                          <span>{collection.components}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{collection.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{collection.views}</span>
                        </div>
                      </div>

                      {/* Author */}
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Link href={`/user/${collection.author.username}`}>
                          <Avatar className="h-8 w-8 hover:scale-105 transition-transform cursor-pointer">
                            <AvatarImage src={collection.author.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{collection.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/user/${collection.author.username}`}>
                            <p className="text-sm font-medium hover:text-primary cursor-pointer truncate">
                              {collection.author.name}
                            </p>
                          </Link>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {collection.updatedAt}
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
