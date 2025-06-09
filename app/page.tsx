"use client"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { SearchLocation } from "@/components/search-location"
import { FeaturesSection } from "@/components/features-section"
import WeatherChart from "@/components/weather-chart"
import ActivityRankings from "@/components/activity-rankings"
import type { WeatherData, ActivityRanking } from "@/types/weather"
// Removed REST API import

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [rankings, setRankings] = useState<ActivityRanking[]>([])
  const [error, setError] = useState("")

  const handleSearch = async (city: { name: string, latitude: number, longitude: number, country: string, region?: string }) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query GetWeatherAndActivityData($latitude: Float!, $longitude: Float!) {
              forecast(latitude: $latitude, longitude: $longitude) {
                daily {
                  time
                  temperature_2m_max
                  temperature_2m_min
                  precipitation_sum
                  wind_speed_10m_max
                  weather_code
                }
                current_weather {
                  temperature
                  wind_speed
                  wind_direction
                  weather_code
                }
                activityRankings {
                  activity
                  averageScore
                  dailyScores
                  reasoning
                }
              }
            }
          `,
          variables: {
            latitude: city.latitude,
            longitude: city.longitude
          }
        })
      })

      const { data, errors } = await response.json()

      if (errors) {
        throw new Error(errors[0].message || "Failed to fetch weather data")
      }

      if (!data.forecast) {
        throw new Error("Failed to get forecast data")
      }

      const locationString = `${city.name}${city.region ? `, ${city.region}` : ""}, ${city.country}`
      
      const processedWeatherData: WeatherData = {
        location: locationString,
        latitude: city.latitude,
        longitude: city.longitude,
        daily: data.forecast.daily,
      }
      
      const activityRankings = data.forecast?.activityRankings || []

      setWeatherData(processedWeatherData)
      setRankings(activityRankings)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setWeatherData(null)
      setRankings([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <HeroSection />

        <section className="py-6">
          <div className="container">
            <SearchLocation onSearch={handleSearch} loading={loading} error={error} />
          </div>
        </section>

        {loading && (
          <div className="container max-w-6xl mx-auto space-y-4 py-6">
            <Skeleton className="h-8 w-64 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
            <Skeleton className="h-[400px]" />
          </div>
        )}

        {weatherData && rankings.length > 0 && (
          <section className="py-8 bg-primary/5 dark:bg-primary/10">
            <div className="container max-w-6xl mx-auto space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{weatherData.location}</h2>
              </div>
              <ActivityRankings rankings={rankings} weatherData={weatherData} onCitySelect={handleSearch} />
              <WeatherChart weatherData={weatherData} />
            </div>
          </section>
        )}

        {!weatherData && !loading && <FeaturesSection />}
      </main>

      <Footer />
    </div>
  )
}
