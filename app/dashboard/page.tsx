"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  LayoutGrid,
  Heart,
  Upload,
  BarChart3,
  Eye,
  Download,
  Star,
  Edit,
  Trash2,
  FolderPlus,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Users,
  Code,
  ImageIcon,
  ChevronRight,
  Check,
  AlertCircle,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Mock data
const myComponents = [
  {
    id: 1,
    name: "Animated Card",
    status: "approved",
    views: 1234,
    downloads: 456,
    rating: 4.8,
    thumbnail: "/animated-card-component.jpg",
    category: "Cards",
    frameworks: ["React", "Vue"],
  },
  {
    id: 2,
    name: "Data Table Pro",
    status: "pending",
    views: 89,
    downloads: 12,
    rating: 0,
    thumbnail: "/data-table-component.png",
    category: "Tables",
    frameworks: ["React"],
  },
  {
    id: 3,
    name: "Modal Dialog",
    status: "rejected",
    views: 45,
    downloads: 3,
    rating: 0,
    thumbnail: "/modal-dialog-component.png",
    category: "Overlays",
    frameworks: ["React", "Svelte"],
  },
]

const favoriteComponents = [
  {
    id: 4,
    name: "Navigation Menu",
    author: "John Doe",
    rating: 4.9,
    downloads: 2341,
    thumbnail: "/navigation-menu-component.jpg",
    collection: "Navigation",
  },
  {
    id: 5,
    name: "Form Builder",
    author: "Jane Smith",
    rating: 4.7,
    downloads: 1876,
    thumbnail: "/form-builder-component.jpg",
    collection: "Forms",
  },
]

const performanceData = [
  { month: "Jan", views: 400, downloads: 240 },
  { month: "Feb", views: 300, downloads: 139 },
  { month: "Mar", views: 600, downloads: 380 },
  { month: "Apr", views: 800, downloads: 430 },
  { month: "May", views: 1200, downloads: 520 },
  { month: "Jun", views: 1400, downloads: 600 },
]

const categoryData = [
  { name: "Cards", value: 35, color: "#8B5CF6" },
  { name: "Forms", value: 25, color: "#3B82F6" },
  { name: "Navigation", value: 20, color: "#10B981" },
  { name: "Tables", value: 15, color: "#F59E0B" },
  { name: "Other", value: 5, color: "#EF4444" },
]

const topComponents = [
  { name: "Animated Card", downloads: 456 },
  { name: "Navigation Menu", downloads: 389 },
  { name: "Form Builder", downloads: 312 },
  { name: "Data Table", downloads: 267 },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("my-components")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-blue-500 to-emerald-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your components and track performance</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="my-components" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">My Components</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Favorites</span>
            </TabsTrigger>
            <TabsTrigger value="submissions" className="gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Submit</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* My Components Tab */}
          <TabsContent value="my-components" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myComponents.map((component) => (
                <Card
                  key={component.id}
                  className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50"
                >
                  <CardHeader className="pb-3">
                    <div className="aspect-video relative rounded-lg overflow-hidden mb-3 bg-muted">
                      <img
                        src={component.thumbnail || "/placeholder.svg"}
                        alt={component.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge
                        className={`absolute top-2 right-2 ${
                          component.status === "approved"
                            ? "bg-emerald-500"
                            : component.status === "pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      >
                        {component.status === "approved" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {component.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                        {component.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                        {component.status.charAt(0).toUpperCase() + component.status.slice(1)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{component.name}</CardTitle>
                    <CardDescription>{component.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>{component.views}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Download className="h-4 w-4" />
                        <span>{component.downloads}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{component.rating || "N/A"}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {component.frameworks.map((fw) => (
                        <Badge key={fw} variant="secondary" className="text-xs">
                          {fw}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-red-500 hover:text-red-600 bg-transparent"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Saved Components</h2>
              <Button variant="outline" className="gap-2 bg-transparent">
                <FolderPlus className="h-4 w-4" />
                New Collection
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {favoriteComponents.map((component) => (
                <Card
                  key={component.id}
                  className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50"
                >
                  <CardHeader className="pb-3">
                    <div className="aspect-video relative rounded-lg overflow-hidden mb-3 bg-muted">
                      <img
                        src={component.thumbnail || "/placeholder.svg"}
                        alt={component.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Button size="icon" variant="secondary" className="absolute top-2 right-2 h-8 w-8">
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg">{component.name}</CardTitle>
                    <CardDescription>by {component.author}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{component.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Download className="h-4 w-4" />
                        <span>{component.downloads}</span>
                      </div>
                    </div>
                    <Badge variant="outline">{component.collection}</Badge>
                    <Button className="w-full bg-transparent" variant="outline">
                      View Component
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions">
            <SubmissionForm />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Views</CardDescription>
                  <CardTitle className="text-3xl">4,800</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-emerald-500">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+12.5% from last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Downloads</CardDescription>
                  <CardTitle className="text-3xl">2,311</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-emerald-500">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+8.2% from last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Avg Rating</CardDescription>
                  <CardTitle className="text-3xl">4.8</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                    <span>Based on 156 reviews</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Active Users</CardDescription>
                  <CardTitle className="text-3xl">892</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-emerald-500">
                    <Users className="h-4 w-4 mr-1" />
                    <span>+15.3% from last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>Views and downloads over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="views" stroke="#8B5CF6" strokeWidth={2} />
                      <Line type="monotone" dataKey="downloads" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>Components by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Components</CardTitle>
                <CardDescription>Most downloaded components this month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topComponents}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="downloads" fill="#10B981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function SubmissionForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    frameworks: [] as string[],
    tags: "",
    license: "",
    code: "",
    screenshot: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const frameworks = ["React", "Vue", "Angular", "Svelte", "Solid"]
  const categories = ["Cards", "Forms", "Navigation", "Tables", "Buttons", "Overlays", "Charts", "Layouts"]
  const licenses = ["MIT", "Apache 2.0", "GPL-3.0", "BSD-3-Clause", "ISC"]

  const accessibilityChecks = [
    { id: "keyboard", label: "Keyboard navigation support", checked: false },
    { id: "aria", label: "ARIA labels and roles", checked: false },
    { id: "contrast", label: "Color contrast meets WCAG AA", checked: false },
    { id: "screen-reader", label: "Screen reader compatible", checked: false },
    { id: "focus", label: "Visible focus indicators", checked: false },
  ]

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setShowSuccess(true)
  }

  if (showSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Component Submitted Successfully!</h2>
            <p className="text-muted-foreground">
              Your component is now under review. You'll be notified once it's approved.
            </p>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Shareable Link:</p>
            <div className="flex gap-2">
              <Input value="https://componentvault.com/component/abc123" readOnly className="font-mono text-sm" />
              <Button>Copy</Button>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => {
                setShowSuccess(false)
                setStep(1)
                setFormData({
                  name: "",
                  description: "",
                  category: "",
                  frameworks: [],
                  tags: "",
                  license: "",
                  code: "",
                  screenshot: null,
                })
              }}
            >
              Submit Another
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Submit New Component</CardTitle>
            <span className="text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Component Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Animated Card Component"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your component's features and use cases..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Frameworks *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {frameworks.map((fw) => (
                    <div key={fw} className="flex items-center space-x-2">
                      <Checkbox
                        id={fw}
                        checked={formData.frameworks.includes(fw)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({ ...formData, frameworks: [...formData.frameworks, fw] })
                          } else {
                            setFormData({ ...formData, frameworks: formData.frameworks.filter((f) => f !== fw) })
                          }
                        }}
                      />
                      <Label htmlFor={fw} className="font-normal cursor-pointer">
                        {fw}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Code & Preview */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Component Code *</Label>
                <div className="border rounded-lg overflow-hidden bg-muted/50">
                  <div className="bg-muted px-4 py-2 border-b flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <span className="text-sm font-medium">Code Editor</span>
                  </div>
                  <Textarea
                    id="code"
                    placeholder="Paste your component code here..."
                    rows={15}
                    className="font-mono text-sm border-0 rounded-none"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Supports JSX, TSX, HTML, and CSS</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="screenshot">Component Screenshot *</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                  <Input
                    id="screenshot"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFormData({ ...formData, screenshot: e.target.files?.[0] || null })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Metadata */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="animation, card, hover, gradient (comma separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License *</Label>
                <Select
                  value={formData.license}
                  onValueChange={(value) => setFormData({ ...formData, license: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a license" />
                  </SelectTrigger>
                  <SelectContent>
                    {licenses.map((license) => (
                      <SelectItem key={license} value={license}>
                        {license}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Code Validation</p>
                    <p className="text-xs text-muted-foreground">
                      Your code will be automatically validated for syntax errors and best practices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Accessibility */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Accessibility Checklist</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ensure your component meets accessibility standards
                </p>
              </div>
              <div className="space-y-3">
                {accessibilityChecks.map((check) => (
                  <div
                    key={check.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox id={check.id} className="mt-0.5" />
                    <Label htmlFor={check.id} className="font-normal cursor-pointer flex-1">
                      {check.label}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Automated Accessibility Scan</p>
                    <p className="text-xs text-muted-foreground">
                      We'll run an automated scan to check for common accessibility issues.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handlePrev} disabled={step === 1}>
              Previous
            </Button>
            {step < totalSteps ? (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Submit Component
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
