"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlternateDestinations } from "@/components/alternate-destinations"
import type { ActivityRanking, WeatherData } from "@/types/weather"

interface ActivityDetailPanelProps {
  isOpen: boolean
  onClose: () => void
  activity: string
  ranking: ActivityRanking
  weatherData: WeatherData
  onCitySelect?: (city: { name: string, latitude: number, longitude: number, country: string, region?: string }) => void
}



const activityIcons = {
  skiing: "🎿",
  surfing: "🏄",
  "outdoor sightseeing": "🌅",
  "indoor sightseeing": "🏛️",
}

const activityColors = {
  skiing: "from-blue-500 to-cyan-500",
  surfing: "from-cyan-500 to-teal-500",
  "outdoor sightseeing": "from-orange-500 to-yellow-500",
  "indoor sightseeing": "from-purple-500 to-pink-500",
}

export function ActivityDetailPanel({
  isOpen,
  onClose,
  activity,
  ranking,
  weatherData,
  onCitySelect,
}: ActivityDetailPanelProps) {

  const getRankingBadge = (score: number) => {
    if (score >= 80) return { text: "Excellent", variant: "default" as const, color: "bg-green-500" }
    if (score >= 60) return { text: "Good", variant: "secondary" as const, color: "bg-blue-500" }
    if (score >= 40) return { text: "Fair", variant: "outline" as const, color: "bg-yellow-500" }
    return { text: "Poor", variant: "destructive" as const, color: "bg-red-500" }
  }

  const badge = getRankingBadge(ranking.averageScore)
  const activityIcon = activityIcons[activity as keyof typeof activityIcons]
  const activityColor = activityColors[activity as keyof typeof activityColors]



  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-background border-l shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${activityColor} text-white text-2xl`}>
                    {activityIcon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold capitalize">{activity}</h2>
                    <p className="text-muted-foreground">{weatherData.location}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Activity Score</p>
                      <p className="text-3xl font-bold">{Math.round(ranking.averageScore)}/100</p>
                    </div>
                    <Badge variant={badge.variant} className="text-sm px-3 py-1">
                      {badge.text}
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 mb-3">
                    <motion.div
                      className={`h-3 rounded-full ${badge.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${ranking.averageScore}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{ranking.reasoning}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Best Days This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {ranking.dailyScores.map((score, index) => {
                      const date = new Date(weatherData.daily.time[index])
                      const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
                      const isGoodDay = score >= 60

                      return (
                        <div
                          key={index}
                          className={`p-2 rounded-lg text-center transition-all ${
                            isGoodDay
                              ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-xs font-medium">{dayName}</p>
                          <p
                            className={`text-sm font-bold ${isGoodDay ? "text-green-700 dark:text-green-300" : "text-muted-foreground"}`}
                          >
                            {Math.round(score)}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <AlternateDestinations 
                activity={activity} 
                currentCity={weatherData.location} 
                onCitySelect={(city) => {
                  if (onCitySelect) {
                    onCitySelect(city);
                    onClose();
                  }
                }} 
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
