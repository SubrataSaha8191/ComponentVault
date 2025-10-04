"use client"

import { useState } from "react"
import { 
  Search, Package, Heart, Download, Eye, Star, Edit, Trash2, 
  Upload, Filter, SortAsc, Grid3x3, List, Copy, Check, Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Mock data for user's components
const myComponents = [
  {
    id: 1,
    name: "Animated Card",
    description: "A beautiful card with hover animations",
    category: "cards",
    status: "published",
    downloads: 12400,
    favorites: 342,
    views: 5600,
    thumbnail: "/animated-card-component.jpg",
    lastUpdated: "2 days ago",
  },
  {
    id: 2,
    name: "Data Table",
    description: "Sortable and filterable data table",
    category: "tables",
    status: "published",
    downloads: 8900,
    favorites: 289,
    views: 4300,
    thumbnail: "/data-table-component.png",
    lastUpdated: "1 week ago",
  },
  {
    id: 3,
    name: "Modal Dialog",
    description: "Accessible modal with animations",
    category: "overlays",
    status: "published",
    downloads: 15200,
    favorites: 456,
    views: 7800,
    thumbnail: "/modal-dialog-component.png",
    lastUpdated: "3 days ago",
  },
  {
    id: 4,
    name: "Form Wizard",
    description: "Multi-step form with validation",
    category: "forms",
    status: "draft",
    downloads: 0,
    favorites: 0,
    views: 0,
    thumbnail: "/form-builder-component.jpg",
    lastUpdated: "Today",
  },
]

const savedComponents = [
  {
    id: 5,
    name: "Navigation Menu",
    description: "Responsive navigation with dropdown support",
    category: "navigation",
    author: "johndoe",
    downloads: 3456,
    rating: 4.9,
    thumbnail: "/navigation-menu-component.jpg",
  },
  {
    id: 6,
    name: "Pricing Cards",
    description: "Beautiful pricing section layout",
    category: "cards",
    author: "sarahdesigner",
    downloads: 3210,
    rating: 4.8,
    thumbnail: "/pricing-cards-component.jpg",
  },
]

export default function MyComponentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const handleCopy = (id: number) => {
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredComponents = myComponents.filter((component) =>
    component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    component.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            <Link href="/submit">
              <Button className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                Upload Component
              </Button>
            </Link>
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
                    {myComponents.reduce((acc, comp) => acc + comp.downloads, 0).toLocaleString()}
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
                    {myComponents.reduce((acc, comp) => acc + comp.favorites, 0).toLocaleString()}
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
                    {myComponents.reduce((acc, comp) => acc + comp.views, 0).toLocaleString()}
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
            <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
              {filteredComponents.map((component, index) => (
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
                          src={component.thumbnail}
                          alt={component.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge
                            variant={component.status === "published" ? "default" : "secondary"}
                            className={component.status === "published" ? "bg-green-500 hover:bg-green-600" : ""}
                          >
                            {component.status}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-purple-600 transition-colors">
                            {component.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{component.description}</p>
                        </div>
                        
                        <Badge variant="secondary" className="text-xs">
                          {component.category}
                        </Badge>

                        {component.status === "published" && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                        )}

                        <p className="text-xs text-muted-foreground">Updated {component.lastUpdated}</p>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleCopy(component.id)}>
                            {copiedId === component.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
                              src={component.thumbnail}
                              alt={component.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-lg group-hover:text-purple-600 transition-colors">
                                  {component.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">{component.description}</p>
                              </div>
                              <Badge
                                variant={component.status === "published" ? "default" : "secondary"}
                                className={component.status === "published" ? "bg-green-500 hover:bg-green-600" : ""}
                              >
                                {component.status}
                              </Badge>
                            </div>
                            
                            {component.status === "published" && (
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                            )}
                            
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">Updated {component.lastUpdated}</p>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleCopy(component.id)}>
                                  {copiedId === component.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
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
          </TabsContent>

          {/* Saved Components Tab */}
          <TabsContent value="saved" className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {savedComponents.map((component, index) => (
                <Card
                  key={component.id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={component.thumbnail}
                      alt={component.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-purple-600 transition-colors">
                        {component.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{component.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>by</span>
                      <Link href={`/user/${component.author}`} className="text-purple-600 hover:underline">
                        @{component.author}
                      </Link>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{component.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>{component.downloads.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Heart className="h-4 w-4 fill-red-600" />
                      </Button>
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
