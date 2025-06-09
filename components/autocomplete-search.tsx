"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cities, searchCities } from "@/data/cities"

interface AutocompleteSearchProps {
  onSearch: (city: { name: string, latitude: number, longitude: number, country: string, region?: string }) => Promise<void>
  loading: boolean
  error: string
}

export function AutocompleteSearch({ onSearch, loading, error }: AutocompleteSearchProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<ReturnType<typeof searchCities>>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("recent-searches")
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse recent searches:", e)
      }
    }
  }, [])

  useEffect(() => {
    if (query.trim().length > 0) {
      const results = searchCities(query, cities, 8)
      setSuggestions(results)
      setShowSuggestions(true)
      setSelectedIndex(-1)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSuggestions) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
          break
        case "Enter":
          e.preventDefault()
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            handleSelectCity(suggestions[selectedIndex])
          } else if (query.trim()) {
            handleSearch()
          }
          break
        case "Escape":
          setShowSuggestions(false)
          setSelectedIndex(-1)
          inputRef.current?.blur()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [showSuggestions, selectedIndex, suggestions, query])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const extractCityName = (displayName: string): string => {
    const parts = displayName.split(",")
    return parts[0].trim()
  }

  const findCityByDisplayName = (displayName: string) => {
    const cityName = extractCityName(displayName)
    const results = searchCities(cityName, cities, 1)
    return results.length > 0 ? results[0] : null
  }

  const handleSelectCity = (city: ReturnType<typeof searchCities>[0]) => {
    const cityName = city.displayName
    setQuery(cityName)
    setShowSuggestions(false)
    setSelectedIndex(-1)

    const newRecentSearches = [cityName, ...recentSearches.filter((s) => s !== cityName)].slice(0, 5)
    setRecentSearches(newRecentSearches)
    localStorage.setItem("recent-searches", JSON.stringify(newRecentSearches))
    onSearch({
      name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      country: city.country,
      region: city.region
    })
  }

  const handleSearch = () => {
    if (query.trim()) {
      const newRecentSearches = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5)
      setRecentSearches(newRecentSearches)
      localStorage.setItem("recent-searches", JSON.stringify(newRecentSearches))

      setShowSuggestions(false)

      const foundCity = findCityByDisplayName(query)
      if (foundCity) {
        onSearch({
          name: foundCity.name,
          latitude: foundCity.latitude,
          longitude: foundCity.longitude,
          country: foundCity.country,
          region: foundCity.region
        })
      } else {
        onSearch({
          name: extractCityName(query),
          latitude: 0,
          longitude: 0,
          country: ''
        })
      }
    }
  }

  const handleClearQuery = () => {
    setQuery("")
    setShowSuggestions(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  const handleRecentSearch = (search: string) => {
    setQuery(search)
    setShowSuggestions(false)

    const foundCity = findCityByDisplayName(search)
    if (foundCity) {
      onSearch({
        name: foundCity.name,
        latitude: foundCity.latitude,
        longitude: foundCity.longitude,
        country: foundCity.country,
        region: foundCity.region
      })
    } else {
      onSearch({
        name: extractCityName(search),
        latitude: 0,
        longitude: 0,
        country: ''
      })
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recent-searches")
  }

  const getPopulationBadge = (population?: number) => {
    if (!population) return null

    if (population > 10000000) return { text: "Mega City", variant: "default" as const }
    if (population > 1000000) return { text: "Major City", variant: "secondary" as const }
    if (population > 100000) return { text: "City", variant: "outline" as const }
    return { text: "Town", variant: "outline" as const }
  }

  return (
    <div className="relative w-full md:max-w-2xl lg:max-w-3xl mx-auto">
      <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Search for a city..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  if (query.trim()) setShowSuggestions(true)
                }}
                className="pl-9 pr-8 h-10 text-base"
                disabled={loading}
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearQuery}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={loading || !query.trim()} 
              className="gap-2 h-10 px-4 sm:px-6 w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="sm:inline">Searching...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span className="sm:inline">Search</span>
                </>
              )}
            </Button>
          </div>

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Recent Searches</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleRecentSearch(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-2"
          >
            <Card className="border-2 shadow-lg">
              <CardContent className="p-0">
                <div className="max-h-80 overflow-y-auto">
                  {suggestions.map((city, index) => {
                    const populationBadge = getPopulationBadge(city.population)
                    return (
                      <motion.div
                        key={`${city.name}-${city.country}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.1, delay: index * 0.05 }}
                        className={`p-3 cursor-pointer transition-colors border-b last:border-b-0 ${
                          index === selectedIndex ? "bg-primary/10 border-primary/20" : "hover:bg-muted/50"
                        }`}
                        onClick={() => handleSelectCity(city)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div>
                              <p className="font-medium">{city.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {city.region && `${city.region}, `}
                                {city.country}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {populationBadge && (
                              <Badge variant={populationBadge.variant} className="text-xs">
                                {populationBadge.text}
                              </Badge>
                            )}
                            {city.population && (
                              <span className="text-xs text-muted-foreground">{city.population.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
