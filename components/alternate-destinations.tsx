"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cities, searchCities } from "@/data/cities"

interface AlternateDestinationsProps {
  activity: string
  currentCity: string
  onCitySelect?: (city: { name: string, latitude: number, longitude: number, country: string, region?: string }) => void
}

interface Destination {
  name: string
  country: string
  region?: string
  reason: string
  displayName: string
}

export function AlternateDestinations({
  activity,
  currentCity,
  onCitySelect,
}: AlternateDestinationsProps) {
  const [alternatives, setAlternatives] = useState<Destination[]>([])

  useEffect(() => {
    if (activity && currentCity) {
      const alternativeDestinations = getAlternativeDestinations(activity, currentCity)
      setAlternatives(alternativeDestinations)
    }
  }, [activity, currentCity])

  const handleAlternativeClick = (destination: Destination) => {
    if (onCitySelect) {
      // Use cities.ts data to get coordinates for the city
      const results = searchCities(destination.name, cities, 1)
      if (results.length > 0) {
        const cityData = results[0]
        onCitySelect({
          name: cityData.name,
          latitude: cityData.latitude,
          longitude: cityData.longitude,
          country: cityData.country,
          region: cityData.region
        })
      } else {
        // Fallback with minimal data if city not found
        onCitySelect({
          name: destination.name,
          latitude: 0,
          longitude: 0,
          country: destination.country,
          region: destination.region
        })
      }
    }
  }

  if (alternatives.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Alternative Destinations for {activity}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alternatives.map((destination, index) => (
          <motion.div
            key={destination.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className="p-4 hover:shadow-md transition-all cursor-pointer border hover:border-primary/50"
              onClick={() => handleAlternativeClick(destination)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold">{destination.displayName}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{destination.reason}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
            </Card>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}

function getAlternativeDestinations(activity: string, currentCity: string) {
  // Define activity-specific destination recommendations
  const activityDestinations = {
    skiing: [
      {
        name: "Aspen",
        country: "United States",
        region: "Colorado",
        reason: "World-class powder and luxury amenities",
      },
      { name: "Chamonix", country: "France", reason: "Legendary alpine skiing and stunning Mont Blanc views" },
      { name: "Zermatt", country: "Switzerland", reason: "Iconic Matterhorn backdrop and glacier skiing" },
      { name: "Whistler", country: "Canada", region: "British Columbia", reason: "Massive ski area and reliable snow" },
      { name: "St. Moritz", country: "Switzerland", reason: "Glamorous resort with perfect groomed runs" },
      { name: "Niseko", country: "Japan", reason: "Incredible powder snow and unique culture" },
      { name: "Val d'Isère", country: "France", reason: "Extensive ski area and vibrant après-ski" },
      {
        name: "Jackson",
        country: "United States",
        region: "Wyoming",
        reason: "Steep terrain and authentic western atmosphere",
      },
    ],
    surfing: [
      {
        name: "Gold Coast",
        country: "Australia",
        region: "Queensland",
        reason: "Consistent waves and perfect beaches",
      },
      { name: "Biarritz", country: "France", region: undefined, reason: "European surf capital with elegant charm" },
      { name: "Ericeira", country: "Portugal", region: undefined, reason: "World Surfing Reserve with diverse breaks" },
      {
        name: "Honolulu",
        country: "United States",
        region: "Hawaii",
        reason: "Birthplace of surfing with legendary waves",
      },
      {
        name: "San Diego",
        country: "United States",
        region: "California",
        reason: "Year-round surfing and perfect climate",
      },
      {
        name: "Byron Bay",
        country: "Australia",
        region: "New South Wales",
        reason: "Bohemian vibe and excellent waves",
      },
      { name: "Taghazout", country: "Morocco", region: undefined, reason: "Consistent swells and affordable surf culture" },
      { name: "Santa Teresa", country: "Costa Rica", region: undefined, reason: "Warm water and uncrowded breaks" },
    ],
    "outdoor sightseeing": [
      { name: "Santorini", country: "Greece", region: undefined, reason: "Stunning sunsets and iconic white architecture" },
      { name: "Banff", country: "Canada", region: "Alberta", reason: "Pristine mountain lakes and wildlife" },
      { name: "Cape Town", country: "South Africa", region: undefined, reason: "Dramatic landscapes and Table Mountain" },
      { name: "Queenstown", country: "New Zealand", region: undefined, reason: "Adventure capital with breathtaking scenery" },
      { name: "Interlaken", country: "Switzerland", region: undefined, reason: "Alpine paradise between two lakes" },
      { name: "Reykjavik", country: "Iceland", region: undefined, reason: "Northern lights and unique geological features" },
      { name: "Patagonia", country: "Chile", region: undefined, reason: "Untouched wilderness and dramatic peaks" },
      { name: "Norwegian Fjords", country: "Norway", region: undefined, reason: "Majestic waterfalls and steep cliffs" },
    ],
    "indoor sightseeing": [
      { name: "Paris", country: "France", region: undefined, reason: "World's greatest museums and cultural sites" },
      { name: "Rome", country: "Italy", region: undefined, reason: "Ancient history and incredible architecture" },
      { name: "London", country: "United Kingdom", region: undefined, reason: "Rich history and world-class galleries" },
      { name: "Vienna", country: "Austria", region: undefined, reason: "Imperial palaces and classical music heritage" },
      { name: "St. Petersburg", country: "Russia", region: undefined, reason: "Hermitage Museum and opulent palaces" },
      { name: "Florence", country: "Italy", region: undefined, reason: "Renaissance art and architectural masterpieces" },
      { name: "Madrid", country: "Spain", region: undefined, reason: "Prado Museum and vibrant cultural scene" },
      { name: "Berlin", country: "Germany", region: undefined, reason: "Modern history and cutting-edge museums" },
    ],
  }

  const destinations = activityDestinations[activity as keyof typeof activityDestinations] || []

  // Filter out the current city and return top 4 alternatives
  return destinations
    .filter((dest) => dest.name.toLowerCase() !== currentCity.toLowerCase())
    .slice(0, 4)
    .map((dest) => ({
      ...dest,
      displayName: `${dest.name}${dest.region ? `, ${dest.region}` : ""}, ${dest.country}`,
    }))
}
