"use client"

import type React from "react"

import { useState } from "react"
import {
  LayoutGrid,
  Navigation,
  FormInput,
  Table,
  Layers,
  CreditCard,
  Bell,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Category {
  id: string
  label: string
  icon: React.ElementType
  count: number
  subcategories?: { id: string; label: string; count: number }[]
}

const categories: Category[] = [
  {
    id: "cards",
    label: "Cards",
    icon: LayoutGrid,
    count: 24,
    subcategories: [
      { id: "pricing", label: "Pricing", count: 8 },
      { id: "profile", label: "Profile", count: 6 },
      { id: "product", label: "Product", count: 10 },
    ],
  },
  {
    id: "navigation",
    label: "Navigation",
    icon: Navigation,
    count: 18,
    subcategories: [
      { id: "navbar", label: "Navbar", count: 7 },
      { id: "sidebar", label: "Sidebar", count: 5 },
      { id: "breadcrumb", label: "Breadcrumb", count: 6 },
    ],
  },
  {
    id: "forms",
    label: "Forms",
    icon: FormInput,
    count: 32,
    subcategories: [
      { id: "input", label: "Input", count: 12 },
      { id: "select", label: "Select", count: 8 },
      { id: "validation", label: "Validation", count: 12 },
    ],
  },
  {
    id: "tables",
    label: "Tables",
    icon: Table,
    count: 15,
  },
  {
    id: "overlays",
    label: "Overlays",
    icon: Layers,
    count: 21,
    subcategories: [
      { id: "modal", label: "Modal", count: 9 },
      { id: "drawer", label: "Drawer", count: 6 },
      { id: "popover", label: "Popover", count: 6 },
    ],
  },
  {
    id: "payments",
    label: "Payments",
    icon: CreditCard,
    count: 12,
  },
  {
    id: "feedback",
    label: "Feedback",
    icon: Bell,
    count: 16,
  },
]

export function SidebarNav() {
  const [activeCategory, setActiveCategory] = useState<string | null>("cards")
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["cards"])

  const toggleCategory = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter((id) => id !== categoryId))
    } else {
      setExpandedCategories([...expandedCategories, categoryId])
    }
  }

  return (
    <aside className="w-64 border-r bg-muted/30 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="p-4">
        <h2 className="font-semibold text-sm text-muted-foreground mb-4 px-2">Categories</h2>
        <nav className="space-y-1">
          {categories.map((category) => {
            const Icon = category.icon
            const isExpanded = expandedCategories.includes(category.id)
            const isActive = activeCategory === category.id

            return (
              <div key={category.id}>
                <button
                  onClick={() => {
                    setActiveCategory(category.id)
                    if (category.subcategories) {
                      toggleCategory(category.id)
                    }
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{category.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{category.count}</span>
                    {category.subcategories &&
                      (isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                  </div>
                </button>

                {/* Subcategories */}
                {category.subcategories && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1 border-l pl-4">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/browse/${category.id}/${sub.id}`}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <span>{sub.label}</span>
                        <span className="text-xs">{sub.count}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
