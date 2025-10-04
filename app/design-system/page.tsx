"use client"

import { DSButton } from "@/components/design-system/ds-button"
import { DSCard, DSCardContent, DSCardDescription, DSCardHeader, DSCardTitle } from "@/components/design-system/ds-card"
import { DSBadge } from "@/components/design-system/ds-badge"
import { DSInput } from "@/components/design-system/ds-input"
import { DSSpinner } from "@/components/design-system/ds-spinner"
import { DSToast } from "@/components/design-system/ds-toast"
import { DSTooltip, DSTooltipContent, DSTooltipProvider, DSTooltipTrigger } from "@/components/design-system/ds-tooltip"
import { Palette, Type, Layout, Zap } from "lucide-react"

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-br from-primary/10 via-secondary/10 to-background py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ComponentVault Design System
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive design system with reusable components, consistent styling, and accessibility built-in.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 py-16 space-y-16">
        {/* Typography Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Type className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Typography</h2>
          </div>
          <DSCard>
            <DSCardContent className="p-8 space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Headings - Inter (Semibold, 600)</p>
                <h1 className="text-4xl font-semibold mb-2">Heading 1</h1>
                <h2 className="text-3xl font-semibold mb-2">Heading 2</h2>
                <h3 className="text-2xl font-semibold mb-2">Heading 3</h3>
                <h4 className="text-xl font-semibold mb-2">Heading 4</h4>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Body - Inter (Regular, 400)</p>
                <p className="text-base mb-2">
                  This is body text using Inter font. It's designed for optimal readability and works great for
                  paragraphs and longer content.
                </p>
                <p className="text-sm text-muted-foreground">This is smaller body text for captions and labels.</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Code - Fira Code</p>
                <code className="block bg-muted p-4 rounded-lg text-sm">
                  const greeting = "Hello, ComponentVault!";
                  <br />
                  console.log(greeting);
                </code>
              </div>
            </DSCardContent>
          </DSCard>
        </section>

        {/* Color Palette Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Palette className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Color Palette</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <DSCard>
              <DSCardHeader>
                <DSCardTitle>Brand Colors</DSCardTitle>
                <DSCardDescription>Primary and secondary brand colors</DSCardDescription>
              </DSCardHeader>
              <DSCardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-primary shadow-md" />
                  <div>
                    <p className="font-semibold">Primary</p>
                    <p className="text-sm text-muted-foreground">#8B5CF6</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-secondary shadow-md" />
                  <div>
                    <p className="font-semibold">Secondary</p>
                    <p className="text-sm text-muted-foreground">#3B82F6</p>
                  </div>
                </div>
              </DSCardContent>
            </DSCard>

            <DSCard>
              <DSCardHeader>
                <DSCardTitle>Semantic Colors</DSCardTitle>
                <DSCardDescription>Colors for feedback and status</DSCardDescription>
              </DSCardHeader>
              <DSCardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-success shadow-md" />
                  <div>
                    <p className="font-semibold">Success</p>
                    <p className="text-sm text-muted-foreground">#10B981</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-warning shadow-md" />
                  <div>
                    <p className="font-semibold">Warning</p>
                    <p className="text-sm text-muted-foreground">#F59E0B</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-error shadow-md" />
                  <div>
                    <p className="font-semibold">Error</p>
                    <p className="text-sm text-muted-foreground">#EF4444</p>
                  </div>
                </div>
              </DSCardContent>
            </DSCard>
          </div>
        </section>

        {/* Buttons Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Zap className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Buttons</h2>
          </div>
          <DSCard>
            <DSCardContent className="p-8 space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <DSButton variant="primary">Primary Button</DSButton>
                  <DSButton variant="secondary">Secondary Button</DSButton>
                  <DSButton variant="ghost">Ghost Button</DSButton>
                  <DSButton disabled>Disabled Button</DSButton>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <DSButton size="sm">Small</DSButton>
                  <DSButton size="md">Medium</DSButton>
                  <DSButton size="lg">Large</DSButton>
                </div>
              </div>
            </DSCardContent>
          </DSCard>
        </section>

        {/* Cards Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Layout className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Cards</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <DSCard>
              <DSCardHeader>
                <DSCardTitle>Default Card</DSCardTitle>
                <DSCardDescription>A simple card with shadow</DSCardDescription>
              </DSCardHeader>
              <DSCardContent>
                <p className="text-sm text-muted-foreground">
                  This is a default card component with header, content, and optional footer sections.
                </p>
              </DSCardContent>
            </DSCard>

            <DSCard hover>
              <DSCardHeader>
                <DSCardTitle>Hover Card</DSCardTitle>
                <DSCardDescription>Card with lift effect on hover</DSCardDescription>
              </DSCardHeader>
              <DSCardContent>
                <p className="text-sm text-muted-foreground">
                  Hover over this card to see the lift animation and enhanced shadow effect.
                </p>
              </DSCardContent>
            </DSCard>
          </div>
        </section>

        {/* Badges Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Badges</h2>
          <DSCard>
            <DSCardContent className="p-8">
              <div className="flex flex-wrap gap-3">
                <DSBadge variant="default">Default</DSBadge>
                <DSBadge variant="primary">Primary</DSBadge>
                <DSBadge variant="secondary">Secondary</DSBadge>
                <DSBadge variant="success">Success</DSBadge>
                <DSBadge variant="warning">Warning</DSBadge>
                <DSBadge variant="error">Error</DSBadge>
              </div>
            </DSCardContent>
          </DSCard>
        </section>

        {/* Input Fields Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Input Fields</h2>
          <DSCard>
            <DSCardContent className="p-8 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Default Input</label>
                <DSInput placeholder="Enter text..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Input with Error</label>
                <DSInput placeholder="Invalid input" error />
                <p className="text-sm text-error mt-1">This field is required</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Disabled Input</label>
                <DSInput placeholder="Disabled" disabled />
              </div>
            </DSCardContent>
          </DSCard>
        </section>

        {/* Loading Spinners Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Loading Spinners</h2>
          <DSCard>
            <DSCardContent className="p-8">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <DSSpinner size="sm" />
                  <p className="text-sm text-muted-foreground mt-2">Small</p>
                </div>
                <div className="text-center">
                  <DSSpinner size="md" />
                  <p className="text-sm text-muted-foreground mt-2">Medium</p>
                </div>
                <div className="text-center">
                  <DSSpinner size="lg" />
                  <p className="text-sm text-muted-foreground mt-2">Large</p>
                </div>
              </div>
            </DSCardContent>
          </DSCard>
        </section>

        {/* Toasts Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Toasts</h2>
          <DSCard>
            <DSCardContent className="p-8 space-y-4">
              <DSToast variant="default">This is a default toast notification</DSToast>
              <DSToast variant="success">Successfully saved your changes!</DSToast>
              <DSToast variant="warning">Warning: This action cannot be undone</DSToast>
              <DSToast variant="error">Error: Something went wrong</DSToast>
            </DSCardContent>
          </DSCard>
        </section>

        {/* Tooltips Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Tooltips</h2>
          <DSCard>
            <DSCardContent className="p-8">
              <DSTooltipProvider>
                <div className="flex gap-4">
                  <DSTooltip>
                    <DSTooltipTrigger asChild>
                      <DSButton>Hover me</DSButton>
                    </DSTooltipTrigger>
                    <DSTooltipContent>
                      <p>This is a tooltip</p>
                    </DSTooltipContent>
                  </DSTooltip>

                  <DSTooltip>
                    <DSTooltipTrigger asChild>
                      <DSButton variant="secondary">Another tooltip</DSButton>
                    </DSTooltipTrigger>
                    <DSTooltipContent>
                      <p>Tooltips provide helpful context</p>
                    </DSTooltipContent>
                  </DSTooltip>
                </div>
              </DSTooltipProvider>
            </DSCardContent>
          </DSCard>
        </section>

        {/* Spacing Scale Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Spacing Scale</h2>
          <DSCard>
            <DSCardContent className="p-8">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">Using Tailwind's default spacing scale:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="w-20 text-sm text-muted-foreground">p-2 (8px)</div>
                    <div className="h-8 bg-primary/20 p-2" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-20 text-sm text-muted-foreground">p-4 (16px)</div>
                    <div className="h-8 bg-primary/20 p-4" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-20 text-sm text-muted-foreground">p-6 (24px)</div>
                    <div className="h-8 bg-primary/20 p-6" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-20 text-sm text-muted-foreground">p-8 (32px)</div>
                    <div className="h-8 bg-primary/20 p-8" />
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong>Container max-width:</strong> 1280px (max-w-7xl)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Section padding:</strong> py-16 or py-20
                  </p>
                </div>
              </div>
            </DSCardContent>
          </DSCard>
        </section>
      </div>
    </div>
  )
}
