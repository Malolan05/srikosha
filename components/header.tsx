"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import type { Category } from "@/lib/types"
import categories from "@/data/categories.json"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="font-bold text-xl text-primary">Śrīkoṣa</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search scriptures..."
              className="w-full pl-9 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-popover border">
                <nav className="py-2">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/${category.slug}`}
                      className={`block px-4 py-2 hover:bg-muted transition-colors ${
                        pathname.startsWith(`/${category.slug}`)
                          ? "bg-muted"
                          : ""
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="font-medium">{category.name}</div>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

