"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Heart,
  Eye,
  Share2,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Plus,
  Lock,
  Globe,
  Calendar,
  Layers,
  ArrowLeft,
  Star,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

// Mock collection data
const collection = {
  id: "1",
  name: "E-commerce Essentials",
  description:
    "A comprehensive collection of modern, accessible, and customizable components specifically designed for building professional e-commerce websites. Includes product cards, shopping carts, checkout flows, and more.",
  components: 24,
  likes: 156,
  views: 2340,
  isPublic: true,
  isOwner: true,
  author: {
    name: "John Doe",
    username: "johndoe",
    avatar: "/diverse-user-avatars.png",
  },
  thumbnail: "/ecommerce-components.png",
  tags: ["E-commerce", "Shopping", "Cart", "Checkout", "Products"],
  createdAt: "January 15, 2024",
  updatedAt: "2 days ago",
}

// Mock components in collection
const components = [
  {
    id: "1",
    name: "Product Card",
    description: "Beautiful product card with image, title, price, and add to cart button",
    category: "E-commerce",
    downloads: 1234,
    rating: 4.8,
    reviews: 45,
    thumbnail: "/product-card.png",
    author: "johndoe",
  },
  {
    id: "2",
    name: "Shopping Cart",
    description: "Fully functional shopping cart with quantity controls and total calculation",
    category: "E-commerce",
    downloads: 987,
    rating: 4.9,
    reviews: 38,
    thumbnail: "/shopping-cart.png",
    author: "johndoe",
  },
  {
    id: "3",
    name: "Checkout Form",
    description: "Multi-step checkout form with validation and payment integration",
    category: "Forms",
    downloads: 856,
    rating: 4.7,
    reviews: 32,
    thumbnail: "/checkout-form.png",
    author: "janesmith",
  },
  {
    id: "4",
    name: "Product Gallery",
    description: "Image gallery with zoom, thumbnails, and fullscreen mode",
    category: "Media",
    downloads: 745,
    rating: 4.6,
    reviews: 28,
    thumbnail: "/product-gallery.png",
    author: "alexchen",
  },
  {
    id: "5",
    name: "Price Filter",
    description: "Range slider for filtering products by price",
    category: "Filters",
    downloads: 634,
    rating: 4.5,
    reviews: 24,
    thumbnail: "/price-filter.jpg",
    author: "johndoe",
  },
  {
    id: "6",
    name: "Product Reviews",
    description: "Review section with ratings, comments, and helpful votes",
    category: "Social",
    downloads: 523,
    rating: 4.8,
    reviews: 21,
    thumbnail: "/product-reviews.png",
    author: "sarahwilson",
  },
]

export default function CollectionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAddComponentDialogOpen, setIsAddComponentDialogOpen] = useState(false)

  const handleDelete = () => {
    // Handle delete logic
    setIsDeleteDialogOpen(false)
    router.push("/collections")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6 gap-2" asChild>
          <Link href="/collections">
            <ArrowLeft className="h-4 w-4" />
            Back to Collections
          </Link>
        </Button>

        {/* Hero Section */}
        <Card className="mb-8 overflow-hidden">
          <div className="relative aspect-[3/1] bg-muted">
            <img
              src={collection.thumbnail || "/placeholder.svg"}
              alt={collection.name}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
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
                    {collection.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h1 className="text-4xl font-bold mb-3">{collection.name}</h1>
                  <p className="text-lg text-muted-foreground max-w-3xl">{collection.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="lg"
                    className="gap-2"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                    {collection.likes + (isLiked ? 1 : 0)}
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                    <Share2 className="h-5 w-5" />
                    Share
                  </Button>
                  {collection.isOwner && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="lg">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Collection
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsAddComponentDialogOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Components
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Export Collection
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Collection
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats and Author */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Collection Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Layers className="h-5 w-5" />
                  <span>Components</span>
                </div>
                <span className="text-2xl font-bold">{collection.components}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="h-5 w-5" />
                  <span>Likes</span>
                </div>
                <span className="text-2xl font-bold">{collection.likes}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-5 w-5" />
                  <span>Views</span>
                </div>
                <span className="text-2xl font-bold">{collection.views}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                  <span>Created</span>
                </div>
                <span className="font-medium">{collection.createdAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                  <span>Updated</span>
                </div>
                <span className="font-medium">{collection.updatedAt}</span>
              </div>
            </CardContent>
          </Card>

          {/* Author */}
          <Card>
            <CardHeader>
              <CardTitle>Created By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Link href={`/user/${collection.author.username}`}>
                  <Avatar className="h-16 w-16 hover:scale-105 transition-transform cursor-pointer">
                    <AvatarImage src={collection.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{collection.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <Link href={`/user/${collection.author.username}`}>
                    <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
                      {collection.author.name}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground">@{collection.author.username}</p>
                </div>
              </div>
              <Button className="w-full" asChild>
                <Link href={`/user/${collection.author.username}`}>View Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Components Grid */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Components in this Collection</CardTitle>
                <CardDescription>{components.length} components</CardDescription>
              </div>
              {collection.isOwner && (
                <Button onClick={() => setIsAddComponentDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Components
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {components.map((component) => (
                <Card key={component.id} className="group hover:shadow-lg transition-shadow">
                  <Link href={`/component/${component.id}`}>
                    <div className="relative aspect-video overflow-hidden bg-muted rounded-t-lg">
                      <img
                        src={component.thumbnail || "/placeholder.svg"}
                        alt={component.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/component/${component.id}`}>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors cursor-pointer">
                          {component.name}
                        </CardTitle>
                      </Link>
                      {collection.isOwner && (
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">{component.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>{component.downloads}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{component.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{component.reviews}</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Collection</DialogTitle>
              <DialogDescription>Update your collection details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Collection Name</Label>
                <Input id="edit-name" defaultValue={collection.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" defaultValue={collection.description} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input id="edit-tags" defaultValue={collection.tags.join(", ")} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Collection</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this collection? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete Collection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Component Dialog */}
        <Dialog open={isAddComponentDialogOpen} onOpenChange={setIsAddComponentDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Components to Collection</DialogTitle>
              <DialogDescription>Search and select components to add to your collection</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input placeholder="Search components..." />
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {/* Component selection list would go here */}
                <p className="text-sm text-muted-foreground text-center py-8">
                  Component search and selection interface
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddComponentDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddComponentDialogOpen(false)}>Add Selected</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
