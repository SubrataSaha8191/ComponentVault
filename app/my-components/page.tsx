"use client"

import { useState, useEffect } from "react"
import { 
  Search, Package, Heart, Download, Eye, Star, Edit, Trash2, 
  Upload, Filter, SortAsc, Grid3x3, List, Copy, Check, Plus,
  Monitor, Tablet, Smartphone, Sun, Moon, Code2, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { Component } from "@/lib/firebase/types"
import { downloadComponent } from "@/lib/download-utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function MyComponentsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [myComponents, setMyComponents] = useState<Component[]>([])
  const [savedComponents, setSavedComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(true)
  const [totalDownloads, setTotalDownloads] = useState(0)
  const [totalFavorites, setTotalFavorites] = useState(0)
  const [totalViews, setTotalViews] = useState(0)
  
  // Live preview modal states
  const [previewComponent, setPreviewComponent] = useState<Component | null>(null)
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showCode, setShowCode] = useState(false)

  // Fetch user's uploaded components and saved components
  useEffect(() => {
    const fetchData = async () => {
      // Wait for auth to initialize
      if (authLoading) {
        return
      }

      if (!user) {
        router.push('/auth/sign-in')
        return
      }

      try {
        setLoading(true)

        // Fetch uploaded components
        const uploadedQuery = query(
          collection(db, 'components'),
          where('authorId', '==', user.uid)
        )
        const uploadedSnapshot = await getDocs(uploadedQuery)
        const uploaded = uploadedSnapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        } as Component))
        setMyComponents(uploaded)

        // Calculate totals
        const downloads = uploaded.reduce((sum, comp) => sum + (comp.stats?.downloads || comp.downloads || 0), 0)
        const views = uploaded.reduce((sum, comp) => sum + (comp.stats?.views || comp.views || 0), 0)
        const likes = uploaded.reduce((sum, comp) => sum + (comp.stats?.likes || comp.likes || 0), 0)
        
        setTotalDownloads(downloads)
        setTotalViews(views)
        setTotalFavorites(likes)

        // Fetch saved/favorited components via server API (avoids client perms issues)
        try {
          const res = await fetch(`/api/favorites?userId=${encodeURIComponent(user.uid)}`)
          if (res.ok) {
            const saved = await res.json()
            setSavedComponents(saved as Component[])
          } else {
            console.warn('Failed to load saved components:', await res.text())
          }
        } catch (e) {
          console.warn('Saved components fetch failed:', e)
        }

      } catch (error) {
        console.error('Error fetching components:', error)
        toast.error('Failed to load components')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, router, authLoading])

  const previewSizes = {
    desktop: "w-full",
    tablet: "w-[768px] mx-auto",
    mobile: "w-[375px] mx-auto",
  }

  const handleViewComponent = (component: Component) => {
    setPreviewComponent(component)
    setPreviewMode("desktop")
    setIsDarkMode(true)
    setShowCode(false)
  }

  const handleCopy = async (component: Component) => {
    try {
      await navigator.clipboard.writeText(component.code || "")
      setCopiedId(component.id)
      toast.success("Component code copied to clipboard!")
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error("Error copying component:", error)
      toast.error("Failed to copy component")
    }
  }

  const handleDownload = async (component: Component) => {
    try {
      toast.loading("Preparing download...")
      
      // Download the component as ZIP
      await downloadComponent(component)
      
      // Update download count via server API to bypass client security restrictions
      try {
        await fetch(`/api/components/${component.id}/metrics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'download' })
        })
      } catch (e) {
        console.warn('Metrics update failed:', e)
      }
      
      toast.success("Component downloaded successfully!")
      
      // Update local state
      setMyComponents(prev => prev.map(c => 
        c.id === component.id 
          ? { 
              ...c, 
              downloads: (c.downloads || 0) + 1,
              stats: c.stats ? { 
                ...c.stats, 
                downloads: (c.stats.downloads || 0) + 1 
              } : {
                downloads: (c.downloads || 0) + 1,
                views: c.views || 0,
                likes: c.likes || 0,
                rating: 0
              }
            }
          : c
      ))
      
      // Update totals
      setTotalDownloads(prev => prev + 1)
      
    } catch (error) {
      console.error("Error downloading component:", error)
      toast.error("Failed to download component")
    }
  }

  const filteredMyComponents = myComponents.filter((component) =>
    (component.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (component.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredSavedComponents = savedComponents.filter((component) =>
    (component.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (component.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your components...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/20 to-background dark:from-background dark:via-purple-950/10">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                My Components
              </h1>
              <p className="text-muted-foreground mt-2">Manage your uploaded and saved components</p>
            </div>
            <Button 
              className="bg-purple-600 hover:bg-purple-700  hover:shadow-xl transition-all duration-300"
              onClick={() => router.push('/dashboard?tab=submit')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Component
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-background dark:from-purple-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Components</p>
                  <p className="text-3xl font-bold text-purple-600">{myComponents.length}</p>
                </div>
                <Package className="h-10 w-10 text-purple-600/20" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Downloads</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {totalDownloads.toLocaleString()}
                  </p>
                </div>
                <Download className="h-10 w-10 text-blue-600/20" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-red-50 to-background dark:from-red-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Favorites</p>
                  <p className="text-3xl font-bold text-red-600">
                    {totalFavorites.toLocaleString()}
                  </p>
                </div>
                <Heart className="h-10 w-10 text-red-600/20" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-background dark:from-green-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-3xl font-bold text-green-600">
                    {totalViews.toLocaleString()}
                  </p>
                </div>
                <Eye className="h-10 w-10 text-green-600/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for My Components and Saved */}
        <Tabs defaultValue="uploaded" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="uploaded" className="gap-2">
              <Upload className="h-4 w-4" />
              Uploaded ({myComponents.length})
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <Heart className="h-4 w-4" />
              Saved ({savedComponents.length})
            </TabsTrigger>
          </TabsList>

          {/* Uploaded Components Tab */}
          <TabsContent value="uploaded" className="space-y-6">
            {/* Search and Filter Bar */}
            <Card className="animate-in fade-in slide-in-from-top-4 duration-300">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search your components..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>All Status</DropdownMenuItem>
                        <DropdownMenuItem>Published</DropdownMenuItem>
                        <DropdownMenuItem>Draft</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <SortAsc className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Most Recent</DropdownMenuItem>
                        <DropdownMenuItem>Most Popular</DropdownMenuItem>
                        <DropdownMenuItem>Most Downloaded</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                    >
                      {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Components Grid/List */}
            {filteredMyComponents.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No components yet</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 'No components match your search.' : 'Start building your component library!'}
                </p>
                {!searchQuery && (
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => router.push('/dashboard?tab=submit')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Your First Component
                  </Button>
                )}
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
                {filteredMyComponents.map((component, index) => (
                <Card
                  key={component.id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {viewMode === "grid" ? (
                    <>
                      {/* Grid View */}
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        <img
                          src={component.thumbnail || component.previewImage || '/placeholder.jpg'}
                          alt={component.name || component.title || 'Component'}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge
                            variant={component.isPublished ? "default" : "secondary"}
                            className={component.isPublished ? "bg-green-500 hover:bg-green-600" : ""}
                          >
                            {component.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-purple-600 transition-colors">
                            {component.name || component.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{component.description}</p>
                        </div>
                        
                        <Badge variant="secondary" className="text-xs">
                          {component.category}
                        </Badge>

                        {component.isPublished && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              <span>{(component.stats?.downloads || component.downloads || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              <span>{component.stats?.likes || component.likes || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{(component.stats?.views || component.views || 0).toLocaleString()}</span>
                            </div>
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground">
                          Updated {component.updatedAt ? new Date(component.updatedAt).toLocaleDateString() : 'Recently'}
                        </p>

                        <div className="space-y-2 pt-2">
                          <Button 
                            size="sm" 
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            onClick={() => handleViewComponent(component)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Live Preview
                          </Button>
                          <div className="grid grid-cols-3 gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDownload(component)}
                              title="Download as ZIP"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleCopy(component)}
                              title="Copy code"
                            >
                              {copiedId === component.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700"
                              title="Delete component"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <>
                      {/* List View */}
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={component.thumbnail || component.previewImage || '/placeholder.jpg'}
                              alt={component.name || component.title || 'Component'}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-lg group-hover:text-purple-600 transition-colors">
                                  {component.name || component.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">{component.description}</p>
                              </div>
                              <Badge
                                variant={component.isPublished ? "default" : "secondary"}
                                className={component.isPublished ? "bg-green-500 hover:bg-green-600" : ""}
                              >
                                {component.isPublished ? "Published" : "Draft"}
                              </Badge>
                            </div>
                            
                            {component.isPublished && (
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Download className="h-4 w-4" />
                                  <span>{(component.stats?.downloads || component.downloads || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="h-4 w-4" />
                                  <span>{component.stats?.likes || component.likes || 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  <span>{(component.stats?.views || component.views || 0).toLocaleString()}</span>
                                </div>
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground">
                                Updated {component.updatedAt ? new Date(component.updatedAt).toLocaleDateString() : 'Recently'}
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                <Button 
                                  size="sm" 
                                  className="bg-purple-600 hover:bg-purple-700"
                                  onClick={() => handleViewComponent(component)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Live Preview
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleDownload(component)}
                                  title="Download as ZIP"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleCopy(component)}
                                  title="Copy code"
                                >
                                  {copiedId === component.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-600 hover:text-red-700"
                                  title="Delete component"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  )}
                </Card>
              ))}
              </div>
            )}
          </TabsContent>

          {/* Saved Components Tab */}
          <TabsContent value="saved" className="space-y-6">
            {filteredSavedComponents.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No saved components</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 'No saved components match your search.' : 'Start exploring and save your favorite components!'}
                </p>
                {!searchQuery && (
                  <Link href="/browse">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Search className="h-4 w-4 mr-2" />
                      Browse Components
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSavedComponents.map((component, index) => (
                <Card
                  key={component.id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={component.thumbnail || component.previewImage || '/placeholder.jpg'}
                      alt={component.name || component.title || 'Component'}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-purple-600 transition-colors">
                        {component.name || component.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{component.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>by</span>
                      <Link href={`/user/${component.authorId}`} className="text-purple-600 hover:underline">
                        {component.authorName || 'Unknown'}
                      </Link>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{component.stats?.likes || component.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>{(component.stats?.downloads || component.downloads || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="col-span-2 bg-purple-600 hover:bg-purple-700"
                        onClick={() => handleViewComponent(component)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Live Preview
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownload(component)}
                        title="Download as ZIP"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCopy(component)}
                        title="Copy code"
                      >
                        {copiedId === component.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700 col-span-2"
                        title="Remove from favorites"
                      >
                        <Heart className="h-4 w-4 fill-red-600 mr-1" />
                        Remove from Favorites
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Live Preview Dialog */}
      <Dialog open={!!previewComponent} onOpenChange={(open) => !open && setPreviewComponent(null)}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-white/10">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-white">
                {previewComponent?.name || previewComponent?.title}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  {previewComponent?.category}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          {previewComponent && (
            <div className="space-y-6 mt-4">
              {/* Control Bar */}
              <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/10">
                <p className="text-gray-400">{previewComponent.description}</p>
                
                <div className="flex items-center gap-2">
                  {/* Preview Mode Selector */}
                  <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPreviewMode("desktop")}
                      className={cn("h-8 w-8 p-0", previewMode === "desktop" && "bg-purple-500/20 text-purple-300")}
                      title="Desktop view"
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPreviewMode("tablet")}
                      className={cn("h-8 w-8 p-0", previewMode === "tablet" && "bg-purple-500/20 text-purple-300")}
                      title="Tablet view"
                    >
                      <Tablet className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPreviewMode("mobile")}
                      className={cn("h-8 w-8 p-0", previewMode === "mobile" && "bg-purple-500/20 text-purple-300")}
                      title="Mobile view"
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Theme Toggle */}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setIsDarkMode(!isDarkMode)} 
                    className="h-8 w-8 p-0"
                    title={isDarkMode ? "Light mode" : "Dark mode"}
                  >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </Button>

                  {/* Code Toggle */}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setShowCode(!showCode)} 
                    className={cn("h-8 gap-2", showCode && "bg-blue-500/20 text-blue-300")}
                    title={showCode ? "Hide code" : "Show code"}
                  >
                    <Code2 className="w-4 h-4" />
                    {showCode ? "Hide" : "Code"}
                  </Button>

                  {/* Actions */}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCopy(previewComponent)}
                    className="h-8 gap-2"
                  >
                    {copiedId === previewComponent.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDownload(previewComponent)}
                    className="h-8 gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Preview Area */}
              <div
                className={cn(
                  "rounded-lg p-8 transition-all duration-300 min-h-[400px] flex items-center justify-center",
                  isDarkMode ? "bg-gray-950 border border-white/10" : "bg-white border border-gray-200"
                )}
              >
                <div className={cn("transition-all duration-300", previewSizes[previewMode])}>
                  {previewComponent.previewImage ? (
                    <div className="space-y-4">
                      <img
                        src={previewComponent.previewImage}
                        alt={previewComponent.name || "Component preview"}
                        className="w-full h-auto rounded-lg shadow-2xl"
                      />
                      {previewComponent.code && previewComponent.code.includes('<') && (
                        <div className="text-xs text-center text-gray-400">
                          Preview image • Toggle "Code" to see source
                        </div>
                      )}
                    </div>
                  ) : previewComponent.code && previewComponent.code.includes('<') ? (
                    <div className="w-full">
                      <div className="text-xs text-center text-gray-400 mb-4">
                        Live HTML render (experimental)
                      </div>
                      <div 
                        className={cn(
                          "w-full p-4 border rounded-lg",
                          isDarkMode ? "border-white/10" : "border-gray-200"
                        )}
                        dangerouslySetInnerHTML={{ __html: previewComponent.code }}
                      />
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No preview available</p>
                      <p className="text-sm mt-2">Upload a preview image when editing this component</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Code Section */}
              {showCode && previewComponent.code && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Source Code</h3>
                  </div>
                  <div className="relative max-h-[400px] overflow-auto">
                    <pre className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <code className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap break-words">
                        {previewComponent.code}
                      </code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Stats Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10 text-sm">
                <div className="flex items-center gap-6 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{(previewComponent.stats?.views || previewComponent.views || 0).toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>{(previewComponent.stats?.downloads || previewComponent.downloads || 0).toLocaleString()} downloads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>{(previewComponent.stats?.likes || previewComponent.likes || 0)} favorites</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/component/${previewComponent.id}/owner-view`)}
                  className="h-8"
                >
                  Open Full View
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
