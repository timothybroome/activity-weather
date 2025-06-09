"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ActivityCard } from "@/components/activity-card"
import { ActivityDetailPanel } from "@/components/activity-detail-panel"
import type { ActivityRanking, WeatherData } from "@/types/weather"

interface ActivityRankingsProps {
  rankings: ActivityRanking[]
  weatherData: WeatherData
  onCitySelect?: (city: { name: string, latitude: number, longitude: number, country: string, region?: string }) => void
}

export default function ActivityRankings({ rankings, weatherData, onCitySelect }: ActivityRankingsProps) {
  const [selectedActivity, setSelectedActivity] = useState<{
    activity: string
    ranking: ActivityRanking
  } | null>(null)

  const sortedRankings = [...rankings].sort((a, b) => b.averageScore - a.averageScore)

  const handleActivityClick = (activity: string, ranking: ActivityRanking) => {
    setSelectedActivity({ activity, ranking })
  }

  const handleClosePanel = () => {
    setSelectedActivity(null)
  }

  return (
    <>
      <div className="space-y-6">
        <motion.h3
          className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-purple-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Activity Rankings
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedRankings.map((ranking, index) => (
            <ActivityCard
              key={ranking.activity}
              ranking={ranking}
              index={index}
              delay={index * 0.15}
              weatherData={weatherData}
              onClick={() => handleActivityClick(ranking.activity, ranking)}
            />
          ))}
        </div>
      </div>

      <ActivityDetailPanel
        isOpen={!!selectedActivity}
        onClose={handleClosePanel}
        activity={selectedActivity?.activity || ""}
        ranking={selectedActivity?.ranking || ({} as ActivityRanking)}
        weatherData={weatherData}
        onCitySelect={onCitySelect}
      />
    </>
  )
}
