"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Search, Menu, Moon, Sun, User, Settings, LogOut, Package, Sparkles, Zap, Crown, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { LogoutDialog } from "@/components/logout-dialog"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/contexts/auth-context"
import ClientOnly from "@/components/client-only"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export function Header() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin')
  const [searchQuery, setSearchQuery] = useState("")
  const { theme, setTheme } = useTheme()
  const { user, loading, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const handleAuthClick = (tab: 'signin' | 'signup') => {
    setAuthModalTab(tab)
    setAuthModalOpen(true)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>, searchValue: string) => {
    e.preventDefault()
    if (searchValue.trim()) {
      router.push(`/browse?q=${encodeURIComponent(searchValue.trim())}`)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      setLogoutDialogOpen(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getUserInitials = (user: any) => {
    if (user?.displayName) {
      return user.displayName.split(' ').map((name: string) => name[0]).join('').toUpperCase()
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return 'U'
  }

  const getUserAvatar = (user: any) => {
    // Priority: photoURL from OAuth providers, then default
    return user?.photoURL || null
  }

  const navLinks = [
    { href: "/browse", label: "Browse", icon: Package },
    { href: "/dashboard", label: "Dashboard", icon: Zap },
    { href: "/collections", label: "Collections", icon: Sparkles },
    { href: "/leaderboard", label: "Leaderboard", icon: Crown },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-purple-500/10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-lg">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo with gradient animation */}
            <Link 
              href="/" 
              className="group flex items-center gap-2 font-bold text-xl transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <Package className="h-7 w-7 text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300" />
                <div className="absolute inset-0 bg-yellow-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
              </div>
              <span className="hidden sm:inline bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
                ComponentVault
              </span>
            </Link>

          {/* Enhanced Desktop Search Bar */}
          <div
            className={`hidden md:flex flex-1 max-w-md transition-all duration-500 ${
              isSearchExpanded ? "max-w-2xl" : ""
            }`}
          >
            <form onSubmit={(e) => handleSearch(e, searchQuery)} className="relative w-full group">
              <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-all duration-300 ${
                isSearchExpanded ? "text-purple-600" : "text-muted-foreground"
              }`} />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search components..."
                className={`w-full pl-10 pr-4 transition-all duration-300 bg-muted/50 dark:bg-muted/30 border-transparent focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 dark:text-white text-gray-900 placeholder:text-gray-500 dark:placeholder:text-gray-400 ${
                  isSearchExpanded ? "shadow-lg shadow-purple-500/10" : ""
                }`}
                onFocus={() => setIsSearchExpanded(true)}
                onBlur={() => setIsSearchExpanded(false)}
              />
              {isSearchExpanded && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              )}
            </form>
          </div>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    active
                      ? "text-purple-600 bg-purple-50 dark:bg-purple-950/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-all duration-300 ${
                    active ? "text-purple-600" : "group-hover:scale-110"
                  }`} />
                  <span>{link.label}</span>
                  {active && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-purple-600 to-transparent animate-pulse" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Enhanced Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              aria-label="Toggle theme"
              className="relative overflow-hidden group hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              {theme === "light" ? (
                <Moon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              ) : (
                <Sun className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
              )}
            </Button>

            {/* Authentication State */}
            <ClientOnly fallback={<div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>}>
              {loading ? (
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
              ) : user ? (
                /* Authenticated User Menu */
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden sm:flex relative h-10 w-10 rounded-full hover:ring-4 hover:ring-purple-500/20 transition-all duration-300 group" aria-label="User menu">
                      <Avatar className="h-10 w-10 ring-2 ring-purple-500/20 group-hover:ring-purple-500/50 transition-all duration-300">
                        <AvatarImage src={getUserAvatar(user)} alt={user.displayName || user.email || 'User'} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 via-blue-600 to-purple-600 text-white text-sm font-semibold">
                          {getUserInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-background"></span>
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 animate-in fade-in slide-in-from-top-2 duration-200 border-purple-500/20 shadow-xl">
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 ring-2 ring-purple-500/30">
                        <AvatarImage src={getUserAvatar(user)} alt={user.displayName || user.email || 'User'} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                          {getUserInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-semibold leading-none">{user.displayName || 'Anonymous User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        {user.emailVerified && (
                          <Badge className="mt-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 text-[10px] px-1.5 py-0">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-purple-500/10" />
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors py-3 gap-3">
                      <User className="h-4 w-4 text-purple-600" />
                      <div className="flex-1">
                        <span className="font-medium">Profile</span>
                        <p className="text-xs text-muted-foreground">View and edit your profile</p>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/my-components">
                    <DropdownMenuItem className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors py-3 gap-3">
                      <Package className="h-4 w-4 text-blue-600" />
                      <div className="flex-1">
                        <span className="font-medium">My Components</span>
                        <p className="text-xs text-muted-foreground">Manage your uploads</p>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/settings">
                    <DropdownMenuItem className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors py-3 gap-3">
                      <Settings className="h-4 w-4 text-gray-600" />
                      <div className="flex-1">
                        <span className="font-medium">Settings</span>
                        <p className="text-xs text-muted-foreground">Preferences and privacy</p>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator className="bg-purple-500/10" />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/20 transition-colors py-3 gap-3"
                    onClick={() => setLogoutDialogOpen(true)}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              ) : (
                /* Unauthenticated State */
                <div className="hidden sm:flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleAuthClick('signin')}
                    className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => handleAuthClick('signup')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </ClientOnly>

            {/* Enhanced Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all duration-300" 
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-purple-500/20">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <nav className="flex flex-col gap-2 mt-8">
                  {/* Mobile Search */}
                  <form onSubmit={(e) => {
                    handleSearch(e, searchQuery)
                    setMobileMenuOpen(false)
                  }} className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-600" />
                    <Input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search components..." 
                      className="w-full pl-10 pr-4 bg-purple-50 dark:bg-purple-950/20 border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" 
                    />
                  </form>

                  {/* Mobile Nav Links with Icons */}
                  <div className="space-y-2">
                    {navLinks.map((link) => {
                      const Icon = link.icon
                      const active = isActive(link.href)
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                            active
                              ? "bg-purple-50 dark:bg-purple-950/30 text-purple-600"
                              : "hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:text-purple-600"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon className="h-5 w-5" />
                          {link.label}
                        </Link>
                      )
                    })}
                  </div>

                  <div className="border-t border-purple-500/10 pt-4 mt-4 space-y-2">
                    <ClientOnly fallback={
                      <div className="px-4 py-3">
                        <div className="w-full h-10 rounded-lg bg-gray-200 animate-pulse"></div>
                      </div>
                    }>
                      {loading ? (
                        <div className="px-4 py-3">
                          <div className="w-full h-10 rounded-lg bg-gray-200 animate-pulse"></div>
                        </div>
                      ) : user ? (
                      <>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:text-purple-600 transition-all duration-300"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="h-5 w-5" />
                          Profile
                        </Link>
                        <Link
                          href="/my-components"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:text-purple-600 transition-all duration-300"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Package className="h-5 w-5" />
                          My Components
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:text-purple-600 transition-all duration-300"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="h-5 w-5" />
                          Settings
                        </Link>
                        <button
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-all duration-300 w-full text-left"
                          onClick={() => {
                            setMobileMenuOpen(false)
                            setLogoutDialogOpen(true)
                          }}
                        >
                          <LogOut className="h-5 w-5" />
                          Log Out
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:text-purple-600 transition-all duration-300 w-full text-left"
                          onClick={() => {
                            setMobileMenuOpen(false)
                            handleAuthClick('signin')
                          }}
                        >
                          <LogIn className="h-5 w-5" />
                          Sign In
                        </button>
                        <button
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 w-full text-left"
                          onClick={() => {
                            setMobileMenuOpen(false)
                            handleAuthClick('signup')
                          }}
                        >
                          <Sparkles className="h-5 w-5" />
                          Get Started
                        </button>
                      </>
                      )}
                    </ClientOnly>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
    
    {/* Auth Modal */}
    <AuthModal 
      open={authModalOpen} 
      onOpenChange={setAuthModalOpen}
      defaultTab={authModalTab}
    />
    
    {/* Logout Dialog */}
    <LogoutDialog 
      open={logoutDialogOpen} 
      onOpenChange={setLogoutDialogOpen}
      onConfirm={handleLogout}
    />
    </>
  )
}
