"use client"

import { useState } from "react"
import { Search, Eye, Star, Download, Heart, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarNav } from "@/components/sidebar-nav"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([])
  const [accessibilityScore, setAccessibilityScore] = useState([0])
  const [sortBy, setSortBy] = useState("popular")
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])

  const handleCopy = (id: number) => {
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  const filteredComponents = mockComponents.filter((component) => {
    const matchesSearch =
      component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFramework =
      selectedFrameworks.length === 0 || component.frameworks.some((fw) => selectedFrameworks.includes(fw))
    const matchesAccessibility = component.accessibilityScore >= accessibilityScore[0]

    return matchesSearch && matchesFramework && matchesAccessibility
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
                    {filteredComponents.length}
                  </Badge>
                  <p className="text-muted-foreground">components found</p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredComponents.map((component, index) => (
                  <Card
                    key={component.id}
                    className="group overflow-hidden backdrop-blur-sm bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-purple-500/10 hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-950/20 dark:to-blue-950/20">
                      <img
                        src={component.thumbnail || "/placeholder.svg"}
                        alt={component.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                      />
                      {/* Gradient Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute top-2 right-2">
                        <Badge
                          className={`${
                            component.accessibilityScore >= 95
                              ? "bg-gradient-to-r from-emerald-500 to-green-600"
                              : component.accessibilityScore >= 90
                                ? "bg-gradient-to-r from-blue-500 to-cyan-600"
                                : "bg-gradient-to-r from-yellow-500 to-orange-600"
                          } text-white border-0 font-semibold shadow-lg`}
                        >
                          A11y: {component.accessibilityScore}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-purple-600 transition-colors duration-300">
                          {component.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{component.description}</p>
                      </div>

                      {/* Tags and Frameworks */}
                      <div className="flex flex-wrap gap-2">
                        <Badge className="text-xs bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-0 hover:bg-purple-200 dark:hover:bg-purple-950/70 transition-colors">
                          {component.category}
                        </Badge>
                        {component.frameworks.map((framework) => (
                          <Badge key={framework} variant="outline" className="text-xs border-purple-500/30 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors">
                            {framework}
                          </Badge>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5 group/stat">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 group-hover/stat:scale-125 transition-transform" />
                          <span className="font-semibold">{component.rating}</span>
                        </div>
                        <div className="flex items-center gap-1.5 group/stat">
                          <Download className="h-4 w-4 group-hover/stat:scale-125 transition-transform" />
                          <span className="font-semibold">{component.downloads.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleCopy(component.id)}
                          className="hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-500/50 transition-all duration-300"
                        >
                          {copiedId === component.id ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => toggleFavorite(component.id)}
                          className="hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-500/50 transition-all duration-300"
                        >
                          <Heart
                            className={`h-4 w-4 transition-all duration-300 ${
                              favorites.includes(component.id) 
                                ? "fill-red-500 text-red-500 scale-110" 
                                : "hover:scale-110"
                            }`}
                          />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Empty State */}
              {filteredComponents.length === 0 && (
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
    </div>
  )
}
