"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Snowflake, Waves, Sun, Building } from "lucide-react"

const features = [
  {
    title: "Skiing",
    icon: <Snowflake className="h-10 w-10 text-blue-500" />,
    description: "Based on temperature, precipitation, and snow conditions",
    delay: 0.1,
  },
  {
    title: "Surfing",
    icon: <Waves className="h-10 w-10 text-cyan-500" />,
    description: "Considering wind speed, temperature, and weather conditions",
    delay: 0.2,
  },
  {
    title: "Outdoor Sightseeing",
    icon: <Sun className="h-10 w-10 text-amber-500" />,
    description: "Perfect weather for exploring outdoors and taking photos",
    delay: 0.3,
  },
  {
    title: "Indoor Sightseeing",
    icon: <Building className="h-10 w-10 text-purple-500" />,
    description: "Museums and indoor attractions when weather isn't ideal",
    delay: 0.4,
  },
]

export function FeaturesSection() {
  return (
    <section id="activities" className="py-16">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-purple-400">
            Activities We Rank
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our intelligent algorithm analyzes weather conditions to recommend the best activities for your destination.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: feature.delay }}
            >
              <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/10">
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl text-center">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
