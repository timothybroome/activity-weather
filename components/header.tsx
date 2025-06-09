"use client"

import { Cloud, Compass, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">WeatherRank</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </a>
          <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </a>
          <a href="#activities" className="text-sm font-medium hover:text-primary transition-colors">
            Activities
          </a>
          <ThemeToggle />
        </nav>

        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in md:hidden bg-background",
          mobileMenuOpen ? "slide-in-from-top-80" : "hidden",
        )}
      >
        <div className="flex flex-col space-y-4">
          <a
            href="#"
            className="flex items-center gap-2 py-2 text-lg font-semibold hover:text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Compass className="h-5 w-5" />
            Home
          </a>
          <a
            href="#about"
            className="flex items-center gap-2 py-2 text-lg font-semibold hover:text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Compass className="h-5 w-5" />
            About
          </a>
          <a
            href="#activities"
            className="flex items-center gap-2 py-2 text-lg font-semibold hover:text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Compass className="h-5 w-5" />
            Activities
          </a>
        </div>
      </div>
    </header>
  )
}
