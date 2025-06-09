'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'graphiql/graphiql.css';

// Dynamically import GraphiQL to avoid SSR issues
const GraphiQLComponent = dynamic(
  () => import('graphiql').then((mod) => mod.GraphiQL),
  { ssr: false }
);

export default function GraphiQLPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetcher = async (graphQLParams: any) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphQLParams),
    });
    return response.json();
  };

  const defaultQuery = `{
  geocode(name: "Tokyo, Japan") {
    results {
      id
      name
      latitude
      longitude
      country
      admin1
      forecast {
        current_weather {
          temperature
          wind_speed
          wind_direction
          weather_code
        }
        activityRankings{
          activity
          averageScore
          reasoning
        }
      }
    }
  }
}`;

  if (!mounted) return <div className="h-screen w-full flex items-center justify-center">Loading GraphiQL...</div>;

  return (
    <div className="h-screen w-full">
      <GraphiQLComponent fetcher={fetcher} defaultQuery={defaultQuery} />
    </div>
  );
}
