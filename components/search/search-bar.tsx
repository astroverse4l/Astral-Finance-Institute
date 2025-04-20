"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"

type SearchResult = {
  id: string
  title: string
  description: string
  type: "course" | "forum"
  url: string
  category?: string
}

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchData()
    } else {
      setResults([])
    }
  }, [debouncedQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const searchData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setIsFocused(false)
    }
  }

  const handleResultClick = (url: string) => {
    router.push(url)
    setQuery("")
    setResults([])
    setIsFocused(false)
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
  }

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
          <Input
            type="search"
            placeholder="Search courses, forum posts..."
            className="w-full bg-white/10 border-white/20 pl-9 pr-10 text-white placeholder:text-white/50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9 text-white/50 hover:text-white"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </form>

      {isFocused && (query.length >= 2 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-md bg-black/90 backdrop-blur-md border border-white/10 shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center text-white/50">
              <div className="animate-spin h-5 w-5 border-2 border-white/50 border-t-white rounded-full mx-auto"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {results.map((result) => (
                <div
                  key={`${result.type}-${result.id}`}
                  className="p-3 hover:bg-white/10 cursor-pointer"
                  onClick={() => handleResultClick(result.url)}
                >
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded flex items-center justify-center bg-white/10 mr-2 flex-shrink-0">
                      {result.type === "course" ? (
                        <span className="text-xs text-white">C</span>
                      ) : (
                        <span className="text-xs text-white">F</span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{result.title}</div>
                      <div className="text-xs text-white/50 mt-0.5">
                        {result.type === "course" ? "Course" : "Forum post"}
                        {result.category && ` • ${result.category}`}
                      </div>
                      <div className="text-xs text-white/70 mt-1 line-clamp-1">{result.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-white/50">
              <p>No results found</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
