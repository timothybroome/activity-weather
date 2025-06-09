"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Cloud, Snowflake, Sun, Umbrella } from "lucide-react"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative overflow-hidden py-6 md:py-12">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-background to-background dark:from-primary/5"></div>

        {/* Animated weather icons */}
        <motion.div
          className="absolute top-10 left-[10%] text-primary/20 dark:text-primary/10"
          animate={{
            y: [0, -15, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <Sun size={48} />
        </motion.div>

        <motion.div
          className="absolute top-20 right-[15%] text-primary/30 dark:text-primary/15"
          animate={{
            y: [0, 20, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
        >
          <Cloud size={64} />
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-[20%] text-primary/20 dark:text-primary/10"
          animate={{
            y: [0, 15, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 2,
          }}
        >
          <Umbrella size={40} />
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-[25%] text-primary/25 dark:text-primary/15"
          animate={{
            y: [0, -20, 0],
            opacity: [0.5, 0.9, 0.5],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1.5,
          }}
        >
          <Snowflake size={36} />
        </motion.div>
      </div>

      <div className="container relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-purple-400">
            Plan Your Perfect Activity
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-4">
            Discover the best activities for your destination based on weather forecasts
          </p>

        </motion.div>
      </div>
    </div>
  )
}
