"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Search,
  X,
  SlidersHorizontal,
  Grid3x3,
  List,
  Sparkles,
  Star,
  Download,
  Eye,
  Copy,
  Heart,
  Check,
  Loader2,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

// Mock data for components
const mockComponents = [
  {
    id: 1,
    name: "Animated Card",
    description: "A beautiful card with hover animations and smooth transitions",
    category: "Cards",
    frameworks: ["React", "Vue"],
    accessibilityScore: 95,
    downloads: 1234,
    rating: 4.8,
    thumbnail: "/animated-card-component.jpg",
    license: "MIT",
    dateAdded: "2024-01-15",
    complexity: "Beginner",
  },
  {
    id: 2,
    name: "Navigation Menu",
    description: "Responsive navigation with dropdown support and mobile menu",
    category: "Navigation",
    frameworks: ["React", "Svelte"],
    accessibilityScore: 98,
    downloads: 3456,
    rating: 4.9,
    thumbnail: "/navigation-menu-component.jpg",
    license: "MIT",
    dateAdded: "2024-02-20",
    complexity: "Intermediate",
  },
  {
    id: 3,
    name: "Form Builder",
    description: "Dynamic form with validation and error handling",
    category: "Forms",
    frameworks: ["React", "Vue", "Svelte"],
    accessibilityScore: 92,
    downloads: 2345,
    rating: 4.7,
    thumbnail: "/form-builder-component.jpg",
    license: "Apache 2.0",
    dateAdded: "2024-01-10",
    complexity: "Advanced",
  },
  {
    id: 4,
    name: "Data Table",
    description: "Sortable and filterable data table with pagination",
    category: "Tables",
    frameworks: ["React"],
    accessibilityScore: 90,
    downloads: 4567,
    rating: 4.6,
    thumbnail: "/data-table-component.png",
    license: "MIT",
    dateAdded: "2024-03-05",
    complexity: "Intermediate",
  },
  {
    id: 5,
    name: "Modal Dialog",
    description: "Accessible modal with animations and focus management",
    category: "Overlays",
    frameworks: ["React", "Vue"],
    accessibilityScore: 96,
    downloads: 5678,
    rating: 4.9,
    thumbnail: "/modal-dialog-component.png",
    license: "MIT",
    dateAdded: "2024-02-28",
    complexity: "Beginner",
  },
  {
    id: 6,
    name: "Pricing Cards",
    description: "Beautiful pricing section layout with feature comparison",
    category: "Cards",
    frameworks: ["React", "Svelte"],
    accessibilityScore: 94,
    downloads: 3210,
    rating: 4.8,
    thumbnail: "/pricing-cards-component.jpg",
    license: "MIT",
    dateAdded: "2024-01-25",
    complexity: "Beginner",
  },
  {
    id: 7,
    name: "Sidebar Navigation",
    description: "Collapsible sidebar with icons and nested menus",
    category: "Navigation",
    frameworks: ["React"],
    accessibilityScore: 97,
    downloads: 2890,
    rating: 4.7,
    thumbnail: "/sidebar-navigation-component.jpg",
    license: "Apache 2.0",
    dateAdded: "2024-03-10",
    complexity: "Intermediate",
  },
  {
    id: 8,
    name: "Toast Notifications",
    description: "Customizable toast messages with animations",
    category: "Feedback",
    frameworks: ["React", "Vue", "Svelte"],
    accessibilityScore: 93,
    downloads: 6789,
    rating: 4.9,
    thumbnail: "/toast-notifications-component.jpg",
    license: "MIT",
    dateAdded: "2024-02-15",
    complexity: "Beginner",
  },
]

const categories = ["Cards", "Navigation", "Forms", "Tables", "Overlays", "Feedback", "Buttons", "Inputs"]
const frameworks = ["React", "Vue", "Svelte", "Angular"]
const licenses = ["MIT", "Apache 2.0", "GPL", "BSD"]
const complexityLevels = ["Beginner", "Intermediate", "Advanced"]

// AI-powered search suggestions
const searchSuggestions = [
  "animated button with ripple effect",
  "responsive navigation menu",
  "form with validation",
  "data table with sorting",
  "modal dialog accessible",
  "pricing cards modern",
  "toast notifications",
  "sidebar collapsible",
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("popular")
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([])
  const [accessibilityScore, setAccessibilityScore] = useState([0])
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([])
  const [minRating, setMinRating] = useState([0])
  const [selectedComplexity, setSelectedComplexity] = useState<string[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
      if (searchQuery.trim()) {
        // Save to recent searches
        const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)
        setRecentSearches(updated)
        localStorage.setItem("recentSearches", JSON.stringify(updated))
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Simulate loading
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [debouncedQuery, selectedCategories, selectedFrameworks, accessibilityScore, selectedLicenses, minRating])

  // Filter and sort components
  const filteredComponents = useMemo(() => {
    const results = mockComponents.filter((component) => {
      const matchesSearch =
        !debouncedQuery ||
        component.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        component.category.toLowerCase().includes(debouncedQuery.toLowerCase())

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(component.category)
      const matchesFramework =
        selectedFrameworks.length === 0 || component.frameworks.some((fw) => selectedFrameworks.includes(fw))
      const matchesAccessibility = component.accessibilityScore >= accessibilityScore[0]
      const matchesLicense = selectedLicenses.length === 0 || selectedLicenses.includes(component.license)
      const matchesRating = component.rating >= minRating[0]
      const matchesComplexity = selectedComplexity.length === 0 || selectedComplexity.includes(component.complexity)

      return (
        matchesSearch &&
        matchesCategory &&
        matchesFramework &&
        matchesAccessibility &&
        matchesLicense &&
        matchesRating &&
        matchesComplexity
      )
    })

    // Sort results
    switch (sortBy) {
      case "popular":
        results.sort((a, b) => b.downloads - a.downloads)
        break
      case "recent":
        results.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        break
      case "highest-rated":
        results.sort((a, b) => b.rating - a.rating)
        break
      case "name":
        results.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return results
  }, [
    debouncedQuery,
    selectedCategories,
    selectedFrameworks,
    accessibilityScore,
    selectedLicenses,
    minRating,
    selectedComplexity,
    sortBy,
  ])

  // Get filtered suggestions
  const filteredSuggestions = searchSuggestions.filter(
    (suggestion) => suggestion.toLowerCase().includes(searchQuery.toLowerCase()) && suggestion !== searchQuery,
  )

  // Check for typos and suggest corrections
  const didYouMean = useMemo(() => {
    if (!searchQuery || filteredComponents.length > 0) return null

    const commonTerms = ["button", "card", "form", "table", "modal", "navigation", "menu", "toast", "sidebar"]
    const query = searchQuery.toLowerCase()

    for (const term of commonTerms) {
      if (levenshteinDistance(query, term) <= 2) {
        return term
      }
    }
    return null
  }, [searchQuery, filteredComponents])

  const handleCopy = (id: number) => {
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedFrameworks([])
    setAccessibilityScore([0])
    setSelectedLicenses([])
    setMinRating([0])
    setSelectedComplexity([])
  }

  const activeFiltersCount =
    selectedCategories.length +
    selectedFrameworks.length +
    selectedLicenses.length +
    selectedComplexity.length +
    (accessibilityScore[0] > 0 ? 1 : 0) +
    (minRating[0] > 0 ? 1 : 0)

  // Highlight matching terms in text
  const highlightText = (text: string, query: string) => {
    if (!query) return text

    const parts = text.split(new RegExp(`(${query})`, "gi"))
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-foreground">
              {part}
            </mark>
          ) : (
            part
          ),
        )}
      </>
    )
  }

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full bg-transparent">
          Clear All Filters ({activeFiltersCount})
        </Button>
      )}

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCategories([...selectedCategories, category])
                  } else {
                    setSelectedCategories(selectedCategories.filter((c) => c !== category))
                  }
                }}
              />
              <label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Framework Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Framework</h4>
        <div className="space-y-2">
          {frameworks.map((framework) => (
            <div key={framework} className="flex items-center space-x-2">
              <Checkbox
                id={`framework-${framework}`}
                checked={selectedFrameworks.includes(framework)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedFrameworks([...selectedFrameworks, framework])
                  } else {
                    setSelectedFrameworks(selectedFrameworks.filter((f) => f !== framework))
                  }
                }}
              />
              <label htmlFor={`framework-${framework}`} className="text-sm cursor-pointer">
                {framework}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Accessibility Score */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Min. Accessibility Score</h4>
        <div className="space-y-2">
          <Slider value={accessibilityScore} onValueChange={setAccessibilityScore} max={100} step={5} />
          <p className="text-sm text-muted-foreground">{accessibilityScore[0]}/100</p>
        </div>
      </div>

      {/* License Type */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">License</h4>
        <div className="space-y-2">
          {licenses.map((license) => (
            <div key={license} className="flex items-center space-x-2">
              <Checkbox
                id={`license-${license}`}
                checked={selectedLicenses.includes(license)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedLicenses([...selectedLicenses, license])
                  } else {
                    setSelectedLicenses(selectedLicenses.filter((l) => l !== license))
                  }
                }}
              />
              <label htmlFor={`license-${license}`} className="text-sm cursor-pointer">
                {license}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Minimum Rating</h4>
        <div className="space-y-2">
          <Slider value={minRating} onValueChange={setMinRating} max={5} step={0.5} />
          <p className="text-sm text-muted-foreground">{minRating[0]} stars</p>
        </div>
      </div>

      {/* Complexity Level */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Complexity</h4>
        <div className="space-y-2">
          {complexityLevels.map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox
                id={`complexity-${level}`}
                checked={selectedComplexity.includes(level)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedComplexity([...selectedComplexity, level])
                  } else {
                    setSelectedComplexity(selectedComplexity.filter((c) => c !== level))
                  }
                }}
              />
              <label htmlFor={`complexity-${level}`} className="text-sm cursor-pointer">
                {level}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search components with AI..."
                className="h-12 pl-12 pr-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

              {/* Search Suggestions Dropdown */}
              {showSuggestions && (searchQuery || recentSearches.length > 0) && (
                <Card className="absolute top-full mt-2 w-full z-50 p-2">
                  {searchQuery && filteredSuggestions.length > 0 && (
                    <div className="mb-2">
                      <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-muted-foreground">
                        <Sparkles className="h-3 w-3" />
                        AI Suggestions
                      </div>
                      {filteredSuggestions.slice(0, 3).map((suggestion, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                          onClick={() => setSearchQuery(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  {!searchQuery && recentSearches.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">Recent Searches</div>
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors flex items-center justify-between group"
                          onClick={() => setSearchQuery(search)}
                        >
                          <span>{search}</span>
                          <X
                            className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              const updated = recentSearches.filter((s) => s !== search)
                              setRecentSearches(updated)
                              localStorage.setItem("recentSearches", JSON.stringify(updated))
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {/* Mobile Filters */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden bg-transparent">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="recent">Recently Added</SelectItem>
                    <SelectItem value="highest-rated">Highest Rated</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
                </div>
                <FiltersContent />
              </Card>
            </div>
          </aside>

          {/* Results Area */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">
                {searchQuery ? `Search Results for "${searchQuery}"` : "All Components"}
              </h1>
              <p className="text-muted-foreground">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching...
                  </span>
                ) : (
                  `${filteredComponents.length} component${filteredComponents.length !== 1 ? "s" : ""} found`
                )}
              </p>

              {/* Did You Mean */}
              {didYouMean && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    Did you mean:{" "}
                    <button
                      className="text-purple-600 hover:underline font-medium"
                      onClick={() => setSearchQuery(didYouMean)}
                    >
                      {didYouMean}
                    </button>
                    ?
                  </p>
                </div>
              )}
            </div>

            {/* Loading Skeletons */}
            {isLoading ? (
              <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-9 flex-1" />
                        <Skeleton className="h-9 w-9" />
                        <Skeleton className="h-9 w-9" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredComponents.length === 0 ? (
              /* Empty State */
              <Card className="p-12 text-center">
                <div className="mx-auto w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No components found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters to find what you're looking for
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Popular searches:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {["button", "card", "form", "table", "modal"].map((term) => (
                        <Button
                          key={term}
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchQuery(term)}
                          className="capitalize"
                        >
                          {term}
                        </Button>
                      ))}
                    </div>
                  </div>
                  {activeFiltersCount > 0 && (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              /* Results Grid/List */
              <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
                {filteredComponents.map((component) => (
                  <Card
                    key={component.id}
                    className={`group overflow-hidden backdrop-blur-sm bg-card/80 hover:bg-card transition-all duration-300 hover:shadow-lg ${
                      viewMode === "grid" ? "hover:-translate-y-1" : ""
                    } ${viewMode === "list" ? "flex flex-row" : ""}`}
                  >
                    {/* Thumbnail */}
                    <div
                      className={`relative overflow-hidden bg-muted ${
                        viewMode === "grid" ? "aspect-video" : "w-48 flex-shrink-0"
                      }`}
                    >
                      <img
                        src={component.thumbnail || "/placeholder.svg"}
                        alt={component.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          className={`${
                            component.accessibilityScore >= 95
                              ? "bg-emerald-500 hover:bg-emerald-600"
                              : component.accessibilityScore >= 90
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-yellow-500 hover:bg-yellow-600"
                          } text-white`}
                        >
                          A11y: {component.accessibilityScore}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3 flex-1">
                      <div>
                        <h3 className="font-semibold text-lg">{highlightText(component.name, debouncedQuery)}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {highlightText(component.description, debouncedQuery)}
                        </p>
                      </div>

                      {/* Tags and Frameworks */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {component.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {component.complexity}
                        </Badge>
                        {component.frameworks.slice(0, 2).map((framework) => (
                          <Badge key={framework} variant="outline" className="text-xs">
                            {framework}
                          </Badge>
                        ))}
                        {component.frameworks.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{component.frameworks.length - 2}
                          </Badge>
                        )}
                      </div>

                      {/* Stats */}
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

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Link href={`/component/${component.id}`} className="flex-1">
                          <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline" onClick={() => handleCopy(component.id)}>
                          {copiedId === component.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toggleFavorite(component.id)}>
                          <Heart
                            className={`h-4 w-4 ${favorites.includes(component.id) ? "fill-red-500 text-red-500" : ""}`}
                          />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && filteredComponents.length > 0 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="default" size="sm" className="bg-purple-600 hover:bg-purple-700">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Levenshtein distance for typo detection
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
      }
    }
  }

  return matrix[str2.length][str1.length]
}
