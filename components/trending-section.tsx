"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react"

type TrendingItem = {
  id: string
  name: string
  symbol: string
  change: number
  isGainer: boolean
}

export default function TrendingSection({ category }: { category: string }) {
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTrendingData = async () => {
      setIsLoading(true)
      try {
        // Simulate API call with a delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Generate mock trending data based on the category
        const mockData = generateMockTrendingData(category)
        setTrendingItems(mockData)
      } catch (error) {
        console.error("Error fetching trending data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrendingData()
  }, [category])

  const generateMockTrendingData = (category: string): TrendingItem[] => {
    const categoryData: Record<string, { symbols: string[]; names: string[] }> = {
      forex: {
        symbols: ["EUR/USD", "GBP/JPY", "AUD/CAD", "NZD/USD", "USD/CHF", "EUR/GBP"],
        names: [
          "Euro/US Dollar",
          "British Pound/Japanese Yen",
          "Australian Dollar/Canadian Dollar",
          "New Zealand Dollar/US Dollar",
          "US Dollar/Swiss Franc",
          "Euro/British Pound",
        ],
      },
      crypto: {
        symbols: ["BTC", "ETH", "SOL", "AVAX", "MATIC", "DOT"],
        names: ["Bitcoin", "Ethereum", "Solana", "Avalanche", "Polygon", "Polkadot"],
      },
      web3: {
        symbols: ["LINK", "GRT", "FIL", "THETA", "OCEAN", "LPT"],
        names: ["Chainlink", "The Graph", "Filecoin", "Theta Network", "Ocean Protocol", "Livepeer"],
      },
      stocks: {
        symbols: ["AAPL", "MSFT", "AMZN", "NVDA", "TSLA", "GOOGL"],
        names: ["Apple Inc.", "Microsoft Corp.", "Amazon.com Inc.", "NVIDIA Corp.", "Tesla Inc.", "Alphabet Inc."],
      },
      derivatives: {
        symbols: ["ES=F", "NQ=F", "YM=F", "RTY=F", "ZB=F", "ZN=F"],
        names: [
          "E-mini S&P 500",
          "E-mini NASDAQ-100",
          "Mini Dow Jones",
          "E-mini Russell 2000",
          "T-Bond Futures",
          "10-Year T-Note",
        ],
      },
      shares: {
        symbols: ["JPM", "BAC", "MS", "GS", "C", "WFC"],
        names: ["JPMorgan Chase", "Bank of America", "Morgan Stanley", "Goldman Sachs", "Citigroup", "Wells Fargo"],
      },
    }

    const { symbols, names } = categoryData[category] || { symbols: [], names: [] }

    return symbols
      .map((symbol, index) => {
        const isGainer = Math.random() > 0.5
        return {
          id: `trending-${category}-${index}`,
          name: names[index],
          symbol,
          change: isGainer ? Math.random() * 15 + 0.5 : -(Math.random() * 15 + 0.5),
          isGainer,
        }
      })
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
  }

  return (
    <Card className="gradient-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">Trending</CardTitle>
          <CardDescription className="text-white/70">Most active {category} assets today</CardDescription>
        </div>
        <div className="flex space-x-1">
          <TrendingUp className="h-5 w-5 text-green-400" />
          <TrendingDown className="h-5 w-5 text-red-400" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {trendingItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div>
                  <div className="font-medium text-white">{item.symbol}</div>
                  <div className="text-sm text-white/70">{item.name}</div>
                </div>
                <div className={`flex items-center ${item.isGainer ? "text-green-400" : "text-red-400"}`}>
                  {item.isGainer ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span className="font-medium">{Math.abs(item.change).toFixed(2)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
