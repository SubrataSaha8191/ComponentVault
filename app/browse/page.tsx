"use client"

import { useState, useEffect } from "react"
import { Search, Eye, Star, Download, Heart, Copy, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SidebarNav } from "@/components/sidebar-nav"
import { useAuth } from "@/contexts/auth-context"
import { Component } from "@/lib/firebase/types"
import { downloadComponent } from "@/lib/download-utils"
import { 
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  increment
} from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { toast } from "sonner"

// Mock data for components
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
  },
  {
    id: 4,
    name: "Data Table",
    description: "Sortable and filterable data table",
    category: "tables",
    frameworks: ["React"],
    accessibilityScore: 90,
    downloads: 4567,
    rating: 4.6,
    thumbnail: "/data-table-component.png",
  },
  {
    id: 5,
    name: "Modal Dialog",
    description: "Accessible modal with animations",
    category: "overlays",
    frameworks: ["React", "Vue"],
    accessibilityScore: 96,
    downloads: 5678,
    rating: 4.9,
    thumbnail: "/modal-dialog-component.png",
  },
  {
    id: 6,
    name: "Pricing Cards",
    description: "Beautiful pricing section layout",
    category: "cards",
    frameworks: ["React", "Svelte"],
    accessibilityScore: 94,
    downloads: 3210,
    rating: 4.8,
    thumbnail: "/pricing-cards-component.jpg",
  },
  {
    id: 7,
    name: "Sidebar Navigation",
    description: "Collapsible sidebar with icons",
    category: "navigation",
    frameworks: ["React"],
    accessibilityScore: 97,
    downloads: 2890,
    rating: 4.7,
    thumbnail: "/sidebar-navigation-component.jpg",
  },
  {
    id: 8,
    name: "Toast Notifications",
    description: "Customizable toast messages",
    category: "feedback",
    frameworks: ["React", "Vue", "Svelte"],
    accessibilityScore: 93,
    downloads: 6789,
    rating: 4.9,
    thumbnail: "/toast-notifications-component.jpg",
  },
]

export default function BrowsePage() {
  const { user } = useAuth()
  const [components, setComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("popular")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [accessibilityScore, setAccessibilityScore] = useState([75])
  const [userFavorites, setUserFavorites] = useState<string[]>([])
  const [previewComponent, setPreviewComponent] = useState<Component | null>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  // Fetch published components from Firestore
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        setLoading(true)
        console.log("Starting to fetch components...")
        
        // Try to query published components first
        let q = query(
          collection(db, "components"),
          where("isPublished", "==", true),
          limit(50)
        )
        
        let querySnapshot = await getDocs(q)
        console.log("Query with isPublished filter returned:", querySnapshot.docs.length, "documents")
        
        // If no results, try fetching all public components
        if (querySnapshot.empty) {
          console.log("No published components found, trying isPublic filter...")
          q = query(
            collection(db, "components"),
            where("isPublic", "==", true),
            limit(50)
          )
          querySnapshot = await getDocs(q)
          console.log("Query with isPublic filter returned:", querySnapshot.docs.length, "documents")
        }
        
        // If still no results, fetch all components as fallback
        if (querySnapshot.empty) {
          console.log("No public components found, fetching all components...")
          const allComponentsSnapshot = await getDocs(collection(db, "components"))
          console.log("Total components in database:", allComponentsSnapshot.docs.length)
          
          // Log first document to check structure
          if (!allComponentsSnapshot.empty) {
            const firstDoc = allComponentsSnapshot.docs[0]
            console.log("First component data:", firstDoc.data())
          }
        }
        
        const fetchedComponents = querySnapshot.docs.map(doc => {
          const data = doc.data()
          console.log("Component:", doc.id, "isPublished:", data.isPublished, "isPublic:", data.isPublic)
          return {
            id: doc.id,
            ...data
          } as Component
        })
        
        console.log("Final fetched components:", fetchedComponents.length)
        setComponents(fetchedComponents)
        
        if (fetchedComponents.length === 0) {
          toast.info("No published components found. Try publishing a component from your dashboard.")
        }
      } catch (error) {
        console.error("Error fetching components:", error)
        toast.error("Failed to load components: " + (error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchComponents()
  }, [])

  // Fetch user's favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return
      
      try {
        const q = query(
          collection(db, "favorites"),
          where("userId", "==", user.uid)
        )
        
        const querySnapshot = await getDocs(q)
        const userFavs = querySnapshot.docs.map(doc => doc.data().componentId)
        setUserFavorites(userFavs)
        setFavorites(userFavs) // Keep both for compatibility
      } catch (error) {
        console.error("Error fetching favorites:", error)
      }
    }

    fetchFavorites()
  }, [user])

  // Add activity tracking function
  const trackActivity = async (type: string, componentId: string, description: string) => {
    if (!user) return
    
    try {
      await addDoc(collection(db, "activities"), {
        userId: user.uid,
        type,
        componentId,
        description,
        createdAt: serverTimestamp()
      })
    } catch (error) {
      console.error("Error tracking activity:", error)
    }
  }

  const handleCopy = async (component: Component) => {
    try {
      // Copy component code to clipboard
      await navigator.clipboard.writeText(component.code || "")
      setCopiedId(component.id)
      toast.success("Component code copied to clipboard!")
      
      // Update copy count
      await updateDoc(doc(db, "components", component.id), {
        copies: increment(1)
      })
      
      // Track activity
      await trackActivity("copy", component.id, `Copied ${component.title || component.name}`)
      
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
      
      // Update download count in Firestore
      await updateDoc(doc(db, "components", component.id), {
        downloads: increment(1),
        "stats.downloads": increment(1)
      })
      
      // Track activity
      await trackActivity("download", component.id, `Downloaded ${component.title || component.name}`)
      
      toast.success("Component downloaded successfully!")
      
      // Refresh components to show updated download count
      const updatedComponents = components.map(c => 
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
      )
      setComponents(updatedComponents as Component[])
      
    } catch (error) {
      console.error("Error downloading component:", error)
      toast.error("Failed to download component")
    }
  }

  const toggleFavorite = async (componentId: string) => {
    if (!user) {
      toast.error("Please sign in to add favorites")
      return
    }
    
    try {
      const isFavorited = favorites.includes(componentId)
      
      if (isFavorited) {
        // Remove from favorites
        const q = query(
          collection(db, "favorites"),
          where("userId", "==", user.uid),
          where("componentId", "==", componentId)
        )
        
        const querySnapshot = await getDocs(q)
        querySnapshot.docs.forEach(async (docSnapshot) => {
          await deleteDoc(docSnapshot.ref)
        })
        
        setFavorites(prev => prev.filter(id => id !== componentId))
        setUserFavorites(prev => prev.filter(id => id !== componentId))
        toast.success("Removed from favorites")
        
        // Track activity
        await trackActivity("unfavorite", componentId, "Removed component from favorites")
      } else {
        // Add to favorites
        await addDoc(collection(db, "favorites"), {
          userId: user.uid,
          componentId,
          createdAt: serverTimestamp()
        })
        
        setFavorites(prev => [...prev, componentId])
        setUserFavorites(prev => [...prev, componentId])
        toast.success("Added to favorites")
        
        // Track activity
        await trackActivity("favorite", componentId, "Added component to favorites")
        
        // Update component likes count
        await updateDoc(doc(db, "components", componentId), {
          likes: increment(1)
        })
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast.error("Failed to update favorites")
    }
  }

  const handlePreview = async (component: Component) => {
    try {
      // Update view count
      await updateDoc(doc(db, "components", component.id), {
        views: increment(1)
      })
      
      // Track activity
      await trackActivity("view", component.id, `Viewed ${component.title || component.name}`)
      
      // Open preview modal
      setPreviewComponent(component)
      setShowPreviewModal(true)
    } catch (error) {
      console.error("Error updating view count:", error)
      toast.error("Failed to preview component")
    }
  }

  const filteredComponents = components.filter((component) => {
    const matchesSearch =
      (component.title || component.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (component.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFramework =
      selectedFrameworks.length === 0 || 
      selectedFrameworks.includes(component.framework) ||
      (component.framework && selectedFrameworks.includes(component.framework))

    return matchesSearch && matchesFramework
  })

  // Sort components
  const sortedComponents = [...filteredComponents].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        const aDate = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
        const bDate = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
        return bDate.getTime() - aDate.getTime()
      case "highest-rated":
        const aRating = a.stats?.rating || a.likes || 0
        const bRating = b.stats?.rating || b.likes || 0
        return bRating - aRating
      case "popular":
      default:
        const aViews = a.stats?.views || a.views || 0
        const bViews = b.stats?.views || b.views || 0
        return bViews - aViews
    }
  })

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <SidebarNav />

      {/* Main Content */}
      <main className="flex-1">
        {/* Enhanced Search Bar with Gradient */}
        <div className="relative border-b border-purple-500/10 bg-gradient-to-r from-purple-50/50 via-blue-50/30 to-purple-50/50 dark:from-purple-950/20 dark:via-blue-950/10 dark:to-purple-950/20 px-6 py-6">
          <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5" />
          <div className="relative max-w-3xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-600 group-focus-within:text-purple-500 transition-colors" />
              <Input
                type="text"
                placeholder="Search 10,000+ components..."
                className="w-full pl-12 pr-4 h-14 text-base bg-white dark:bg-gray-900 dark:text-white text-gray-900 border-2 border-purple-500/20 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 shadow-lg shadow-purple-500/5 transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filters and Results */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Enhanced Filter Sidebar */}
            <aside className="lg:w-72 space-y-4">
              <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/10 border-purple-500/10 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-1 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full" />
                  <h3 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Filters</h3>
                </div>

                {/* Framework Selector */}
                <div className="space-y-3 mb-6 pb-6 border-b border-purple-500/10">
                  <h4 className="text-sm font-semibold text-foreground/80 mb-3">Framework</h4>
                  {["React", "Vue", "Svelte"].map((framework, index) => (
                    <div key={framework} className="flex items-center space-x-3 group">
                      <Checkbox
                        id={framework}
                        checked={selectedFrameworks.includes(framework)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedFrameworks([...selectedFrameworks, framework])
                          } else {
                            setSelectedFrameworks(selectedFrameworks.filter((f) => f !== framework))
                          }
                        }}
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      <label 
                        htmlFor={framework} 
                        className="text-sm cursor-pointer group-hover:text-purple-600 transition-colors font-medium"
                      >
                        {framework}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Accessibility Score Slider */}
                <div className="space-y-3 mb-6 pb-6 border-b border-purple-500/10">
                  <h4 className="text-sm font-semibold text-foreground/80 mb-3">Min. Accessibility Score</h4>
                  <div className="space-y-3">
                    <Slider
                      value={accessibilityScore}
                      onValueChange={setAccessibilityScore}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between">
                      <Badge className="bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-0 font-semibold">
                        {accessibilityScore[0]}/100
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {accessibilityScore[0] >= 95 ? "Excellent" : accessibilityScore[0] >= 85 ? "Good" : "Fair"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sort By */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground/80 mb-3">Sort By</h4>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border-purple-500/20 focus:ring-2 focus:ring-purple-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">🔥 Most Popular</SelectItem>
                      <SelectItem value="recent">✨ Recently Added</SelectItem>
                      <SelectItem value="highest-rated">⭐ Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            </aside>

            {/* Enhanced Results Grid */}
            <div className="flex-1">
              <div className="mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {searchQuery ? "Search Results" : "All Components"}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 font-semibold">
                    {sortedComponents.length}
                  </Badge>
                  <p className="text-muted-foreground">components found</p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-6 animate-pulse">
                      <div className="h-48 bg-gray-700 rounded mb-4"></div>
                      <div className="h-4 bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                    </div>
                  ))
                ) : sortedComponents.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400 text-lg">No components found matching your criteria.</p>
                  </div>
                ) : (
                  sortedComponents.map((component, index) => (
                    <Card
                      key={component.id}
                      className="group overflow-hidden backdrop-blur-sm bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-purple-500/10 hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-950/20 dark:to-blue-950/20">
                        <img
                          src={component.thumbnail || "/placeholder.svg"}
                          alt={component.title || component.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                        />
                        {/* Gradient Overlay on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="absolute top-2 right-2">
                          <Badge
                            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 font-semibold shadow-lg"
                          >
                            A11y: 95
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-purple-600 transition-colors duration-300">
                            {component.title || component.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{component.description}</p>
                        </div>

                        {/* Tags and Frameworks */}
                        <div className="flex flex-wrap gap-2">
                          <Badge className="text-xs bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-0 hover:bg-purple-200 dark:hover:bg-purple-950/70 transition-colors">
                            {component.category}
                          </Badge>
                          {component.framework && (
                            <Badge key={component.framework} variant="outline" className="text-xs border-purple-500/30 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors">
                              {component.framework}
                            </Badge>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5 group/stat">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 group-hover/stat:scale-125 transition-transform" />
                            <span className="font-semibold">{component.stats?.rating || component.likes || 0}</span>
                          </div>
                          <div className="flex items-center gap-1.5 group/stat">
                            <Download className="h-4 w-4 group-hover/stat:scale-125 transition-transform" />
                            <span className="font-semibold">{(component.stats?.downloads || component.downloads || 0).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2 pt-2">
                          <Button 
                            size="sm" 
                            onClick={() => handlePreview(component)}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <div className="grid grid-cols-3 gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDownload(component)}
                              className="hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-500/50 transition-all duration-300"
                              title="Download as ZIP"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleCopy(component)}
                              className="hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-500/50 transition-all duration-300"
                              title="Copy code"
                            >
                              {copiedId === component.id ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => toggleFavorite(component.id)}
                              className="hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-500/50 transition-all duration-300"
                              title="Add to favorites"
                            >
                              <Heart
                                className={`h-4 w-4 transition-all duration-300 ${
                                  userFavorites.includes(component.id) 
                                    ? "fill-red-500 text-red-500 scale-110" 
                                    : "hover:scale-110"
                                }`}
                              />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Empty State */}
              {!loading && sortedComponents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-950/20 dark:to-blue-950/20 flex items-center justify-center mb-6">
                    <Search className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No components found</h3>
                  <p className="text-muted-foreground max-w-md">
                    Try adjusting your filters or search query to find what you're looking for.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent showCloseButton={false} className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center justify-between">
              <span>{previewComponent?.title || previewComponent?.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {previewComponent && (
            <div className="space-y-6">
              {/* Component Image/Preview */}
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-800">
                {previewComponent.previewImage || previewComponent.thumbnail || previewComponent.thumbnailImage ? (
                  <img
                    src={previewComponent.previewImage || previewComponent.thumbnail || previewComponent.thumbnailImage}
                    alt={previewComponent.title || previewComponent.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Eye className="h-16 w-16 mx-auto mb-2 opacity-50" />
                      <p>No preview image available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Component Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300">{previewComponent.description || "No description available"}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-purple-500 text-white">
                    {previewComponent.category}
                  </Badge>
                  {previewComponent.framework && (
                    <Badge variant="outline" className="text-gray-300 border-gray-600">
                      {previewComponent.framework}
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="flex gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{previewComponent.stats?.views || previewComponent.views || 0} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{previewComponent.stats?.likes || previewComponent.likes || 0} likes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>{previewComponent.stats?.downloads || previewComponent.downloads || 0} downloads</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => handleDownload(previewComponent)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download ZIP
                  </Button>
                  <Button
                    onClick={() => handleCopy(previewComponent)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {copiedId === previewComponent.id ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Code
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => toggleFavorite(previewComponent.id)}
                    variant="outline"
                    className="border-gray-600 hover:border-red-500 hover:bg-red-950/20"
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${
                        userFavorites.includes(previewComponent.id)
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                    {userFavorites.includes(previewComponent.id) ? "Remove" : "Favorite"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
