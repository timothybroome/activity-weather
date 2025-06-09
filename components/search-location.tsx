"use client"

import { AutocompleteSearch } from "@/components/autocomplete-search"

interface SearchLocationProps {
  onSearch: (city: { name: string, latitude: number, longitude: number, country: string, region?: string }) => Promise<void>
  loading: boolean
  error: string
}

export function SearchLocation({ onSearch, loading, error }: SearchLocationProps) {
  return (
    <section id="search" className="py-12">
      <div className="container">
        <AutocompleteSearch onSearch={onSearch} loading={loading} error={error} />
      </div>
    </section>
  )
}
