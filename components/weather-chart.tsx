"use client"

import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { WeatherData } from "@/types/weather"

interface WeatherChartProps {
  weatherData: WeatherData
}

export default function WeatherChart({ weatherData }: WeatherChartProps) {
  const chartData = weatherData.daily.time.map((date, index) => ({
    date: new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    temperature: Math.round(weatherData.daily.temperature_2m_max[index]),
    minTemperature: Math.round(weatherData.daily.temperature_2m_min[index]),
    precipitation: weatherData.daily.precipitation_sum[index],
    windSpeed: Math.round(weatherData.daily.wind_speed_10m_max[index]),
    weatherCode: weatherData.daily.weather_code[index],
  }))

  const getWeatherIcon = (code: number) => {
    if (code <= 3) return "☀️" // Clear or partly cloudy
    if (code >= 51 && code <= 67) return "🌧️" // Rain
    if (code >= 71 && code <= 77) return "❄️" // Snow
    if (code >= 80 && code <= 99) return "⛈️" // Thunderstorm
    return "☁️" // Cloudy
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-purple-400">
            7-Day Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="daily">Daily View</TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="space-y-4">
              <ChartContainer
                config={{
                  temperature: {
                    label: "Temperature (°C)",
                    color: "hsl(var(--chart-1))",
                  },
                  precipitation: {
                    label: "Precipitation (mm)",
                    color: "hsl(var(--chart-2))",
                  },
                  windSpeed: {
                    label: "Wind Speed (km/h)",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      className="text-muted-foreground"
                    />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} className="text-muted-foreground" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="var(--color-temperature)"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      name="Temperature (°C)"
                    />
                    <Line
                      type="monotone"
                      dataKey="precipitation"
                      stroke="var(--color-precipitation)"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      name="Precipitation (mm)"
                    />
                    <Line
                      type="monotone"
                      dataKey="windSpeed"
                      stroke="var(--color-windSpeed)"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      name="Wind Speed (km/h)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="daily">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                {chartData.map((day, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="bg-primary/10 dark:bg-primary/5 p-3 text-center border-b">
                      <p className="font-medium">{day.date}</p>
                    </div>
                    <CardContent className="p-4 text-center">
                      <div className="text-4xl mb-2">{getWeatherIcon(day.weatherCode)}</div>
                      <div className="flex justify-center items-center gap-2 mb-2">
                        <span className="text-lg font-bold">{day.temperature}°</span>
                        <span className="text-sm text-muted-foreground">{day.minTemperature}°</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>
                          <p>Rain</p>
                          <p className="font-medium">{day.precipitation} mm</p>
                        </div>
                        <div>
                          <p>Wind</p>
                          <p className="font-medium">{day.windSpeed} km/h</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
