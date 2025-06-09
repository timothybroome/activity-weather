import type { WeatherData, ActivityRanking } from "@/types/weather"

export function calculateActivityRankings(weatherData: WeatherData): ActivityRanking[] {
  const { daily } = weatherData
  const activities = ["skiing", "surfing", "outdoor sightseeing", "indoor sightseeing"]

  return activities.map((activity) => {
    const dailyScores = daily.time.map((_, index) => {
      const temp = daily.temperature_2m_max[index]
      const precipitation = daily.precipitation_sum[index]
      const windSpeed = daily.wind_speed_10m_max[index]
      const weatherCode = daily.weather_code[index]

      return calculateActivityScore(activity, temp, precipitation, windSpeed, weatherCode)
    })

    const averageScore = dailyScores.reduce((sum, score) => sum + score, 0) / dailyScores.length

    return {
      activity,
      averageScore,
      dailyScores,
      reasoning: getActivityReasoning(activity, averageScore),
    }
  })
}

export function calculateActivityScore(
  activity: string,
  temperature: number,
  precipitation: number,
  windSpeed: number,
  weatherCode: number,
): number {
  let score = 0

  const isClear = weatherCode <= 3
  const isRainy = weatherCode >= 51 && weatherCode <= 67
  const isSnowy = weatherCode >= 71 && weatherCode <= 77

  switch (activity) {
    case "skiing":
      if (temperature < 0) score += 40
      else if (temperature < 5) score += 30
      else if (temperature < 10) score += 10

      if (isSnowy) score += 30
      else if (precipitation > 0) score += 10

      if (windSpeed < 20) score += 20
      else if (windSpeed < 40) score += 10

      if (isClear && temperature < 5) score += 10
      break

    case "surfing":
      if (temperature >= 15 && temperature <= 25) score += 30
      else if (temperature >= 10 && temperature <= 30) score += 20
      else if (temperature >= 5) score += 10

      if (precipitation < 1) score += 25
      else if (precipitation < 5) score += 15
      else if (precipitation < 10) score += 5

      if (windSpeed >= 10 && windSpeed <= 25) score += 25
      else if (windSpeed >= 5 && windSpeed <= 35) score += 15
      else if (windSpeed < 50) score += 5

      if (isClear) score += 20
      break

    case "outdoor sightseeing":
      if (temperature >= 18 && temperature <= 25) score += 30
      else if (temperature >= 15 && temperature <= 28) score += 25
      else if (temperature >= 10 && temperature <= 30) score += 15
      else if (temperature >= 5) score += 5

      if (precipitation === 0) score += 30
      else if (precipitation < 2) score += 20
      else if (precipitation < 5) score += 10
      else if (precipitation < 10) score += 5

      if (windSpeed < 15) score += 20
      else if (windSpeed < 25) score += 15
      else if (windSpeed < 35) score += 5

      if (isClear) score += 20
      else if (!isRainy && !isSnowy) score += 10
      break

    case "indoor sightseeing":
      if (precipitation > 10) score += 30
      else if (precipitation > 5) score += 20
      else if (precipitation > 2) score += 15
      else score += 10

      if (temperature < 5 || temperature > 30) score += 20
      else if (temperature < 10 || temperature > 25) score += 10
      else score += 5

      if (windSpeed > 40) score += 20
      else if (windSpeed > 25) score += 10
      else score += 5

      if (isRainy || isSnowy) score += 20
      else if (!isClear) score += 10
      else score += 5

      score += 20
      break
  }

  return Math.min(100, Math.max(0, score))
}

export function getActivityReasoning(activity: string, score: number): string {
  const level = score >= 80 ? "excellent" : score >= 60 ? "good" : score >= 40 ? "fair" : "poor"

  const reasons = {
    skiing: {
      excellent: "Perfect skiing conditions with cold temperatures and good snow prospects",
      good: "Good skiing weather with suitable temperatures and conditions",
      fair: "Acceptable skiing conditions, though not ideal",
      poor: "Poor skiing conditions due to warm temperatures or unfavorable weather",
    },
    surfing: {
      excellent: "Ideal surfing conditions with perfect temperature and wind",
      good: "Good surfing weather with favorable conditions",
      fair: "Decent surfing conditions with some limitations",
      poor: "Poor surfing conditions due to weather or temperature",
    },
    "outdoor sightseeing": {
      excellent: "Perfect weather for outdoor exploration and photography",
      good: "Great conditions for outdoor activities and sightseeing",
      fair: "Acceptable weather for outdoor sightseeing with some precautions",
      poor: "Poor outdoor conditions, consider indoor alternatives",
    },
    "indoor sightseeing": {
      excellent: "Perfect time for museums and indoor attractions",
      good: "Good opportunity to explore indoor cultural sites",
      fair: "Decent time for indoor activities",
      poor: "Weather is actually quite nice for outdoor activities instead",
    },
  }

  return reasons[activity as keyof typeof reasons][level]
}
