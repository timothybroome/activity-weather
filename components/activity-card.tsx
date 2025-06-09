"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronRight } from "lucide-react"
import type { ActivityRanking, WeatherData } from "@/types/weather"

interface ActivityCardProps {
  ranking: ActivityRanking
  index: number
  delay: number
  weatherData: WeatherData
  onClick?: () => void
}

const activityIcons = {
  skiing: "🎿",
  surfing: "🏄",
  "outdoor sightseeing": "🌅",
  "indoor sightseeing": "🏛️",
}

const getRankingBadge = (score: number) => {
  if (score >= 80) return { text: "Excellent", variant: "default" as const }
  if (score >= 60) return { text: "Good", variant: "secondary" as const }
  if (score >= 40) return { text: "Fair", variant: "outline" as const }
  return { text: "Poor", variant: "destructive" as const }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
  const dayNumber = date.getDate()

  // Add ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return "th"
    switch (day % 10) {
      case 1:
        return "st"
      case 2:
        return "nd"
      case 3:
        return "rd"
      default:
        return "th"
    }
  }

  return `${dayName}, ${dayNumber}${getOrdinalSuffix(dayNumber)}`
}

export function ActivityCard({ ranking, index, delay, weatherData, onClick }: ActivityCardProps) {
  const badge = getRankingBadge(ranking.averageScore)

  // Get the best 3 days with their actual dates
  const bestDays = ranking.dailyScores
    .map((score, i) => ({ score, day: i, date: weatherData.daily.time[i] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
    >
      <Card
        className="overflow-hidden h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/10 cursor-pointer group"
        onClick={onClick}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 to-purple-600/80"></div>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl">{activityIcons[ranking.activity as keyof typeof activityIcons]}</span>
              <span className="capitalize">{ranking.activity}</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className="text-xs font-bold">#{index + 1}</Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Score</span>
              <motion.span
                className="text-lg font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: delay + 0.3 }}
              >
                {Math.round(ranking.averageScore)}%
              </motion.span>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: delay + 0.3 }}
            >
              <Progress value={ranking.averageScore} className="h-2" />
            </motion.div>
            <Badge variant={badge.variant} className="w-full justify-center">
              {badge.text}
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Best Days:</p>
            <div className="flex flex-wrap gap-1">
              {bestDays.map(({ date }, i) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: delay + 0.5 + i * 0.1 }}
                >
                  <Badge variant="outline" className="text-xs">
                    {formatDate(date)}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.p
            className="text-xs text-muted-foreground mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.8 }}
          >
            {ranking.reasoning}
          </motion.p>

          <div className="pt-2 border-t">
            <p className="text-xs text-primary font-medium group-hover:text-primary/80 transition-colors">
              Click for detailed analysis →
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
