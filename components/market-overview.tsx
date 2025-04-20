"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
  JapaneseYenIcon as Yen,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"

type MarketData = {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
}

export default function MarketOverview({ category }: { category: string }) {
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [currency, setCurrency] = useState<"USD" | "JPY" | "KSH">("USD")
  const [isLoading, setIsLoading] = useState(true)

  const currencySymbols = {
    USD: "$",
    JPY: "¥",
    KSH: "KSh",
  }

  const conversionRates = {
    USD: 1,
    JPY: 150.27,
    KSH: 129.85,
  }

  useEffect(() => {
    const fetchMarketData = async () => {
      setIsLoading(true)
      try {
        // Fetch market data from API route that uses Redis caching
        const response = await fetch(`/api/market-data?category=${category}`)
        if (!response.ok) {
          throw new Error("Failed to fetch market data")
        }
        const data = await response.json()
        setMarketData(data)
      } catch (error) {
        console.error("Error fetching market data:", error)
        // Fallback to mock data if API fails
        const mockData = generateMockData(category)
        setMarketData(mockData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarketData()
    // Set up interval to refresh data every 30 seconds
    const intervalId = setInterval(fetchMarketData, 30000)

    return () => clearInterval(intervalId)
  }, [category])

  const generateMockData = (category: string): MarketData[] => {
    const categoryData: Record<string, { symbols: string[]; names: string[] }> = {
      forex: {
        symbols: ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "USD/CHF"],
        names: [
          "Euro/US Dollar",
          "British Pound/US Dollar",
          "US Dollar/Japanese Yen",
          "Australian Dollar/US Dollar",
          "US Dollar/Canadian Dollar",
          "US Dollar/Swiss Franc",
        ],
      },
      crypto: {
        symbols: ["BTC/USD", "ETH/USD", "SOL/USD", "ADA/USD", "DOT/USD", "AVAX/USD"],
        names: ["Bitcoin", "Ethereum", "Solana", "Cardano", "Polkadot", "Avalanche"],
      },
      web3: {
        symbols: ["LINK/USD", "GRT/USD", "FIL/USD", "ATOM/USD", "NEAR/USD", "AR/USD"],
        names: ["Chainlink", "The Graph", "Filecoin", "Cosmos", "NEAR Protocol", "Arweave"],
      },
      stocks: {
        symbols: ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA"],
        names: ["Apple Inc.", "Microsoft Corp.", "Alphabet Inc.", "Amazon.com Inc.", "Tesla Inc.", "NVIDIA Corp."],
      },
      derivatives: {
        symbols: ["ES=F", "NQ=F", "YM=F", "CL=F", "GC=F", "SI=F"],
        names: ["E-mini S&P 500", "E-mini NASDAQ-100", "Mini Dow Jones", "Crude Oil", "Gold", "Silver"],
      },
      shares: {
        symbols: ["JPM", "BAC", "WFC", "C", "GS", "MS"],
        names: ["JPMorgan Chase", "Bank of America", "Wells Fargo", "Citigroup", "Goldman Sachs", "Morgan Stanley"],
      },
    }

    const { symbols, names } = categoryData[category] || { symbols: [], names: [] }

    return symbols.map((symbol, index) => ({
      symbol,
      name: names[index],
      price: Math.random() * (category === "crypto" ? 50000 : 1000) + (category === "crypto" ? 1000 : 10),
      change: Math.random() * 20 - 10,
      changePercent: Math.random() * 5 - 2.5,
      volume: Math.floor(Math.random() * 10000000) + 100000,
    }))
  }

  const convertPrice = (price: number): number => {
    return price * conversionRates[currency]
  }

  const formatPrice = (price: number): string => {
    const converted = convertPrice(price)
    if (currency === "JPY") {
      return converted.toFixed(0)
    }
    return converted.toFixed(2)
  }

  const formatVolume = (volume: number): string => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(2)}M`
    }
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(2)}K`
    }
    return volume.toString()
  }

  const refreshData = async () => {
    setIsLoading(true)
    try {
      // Force refresh by adding a timestamp to bypass cache
      const response = await fetch(`/api/market-data?category=${category}&refresh=true&t=${Date.now()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch market data")
      }
      const data = await response.json()
      setMarketData(data)
    } catch (error) {
      console.error("Error refreshing market data:", error)
      // Fallback to mock data if API fails
      const mockData = generateMockData(category)
      setMarketData(mockData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="gradient-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">Market Overview</CardTitle>
          <CardDescription className="text-white/70">
            Live {category.charAt(0).toUpperCase() + category.slice(1)} market data
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Tabs value={currency} onValueChange={(value) => setCurrency(value as "USD" | "JPY" | "KSH")}>
            <TabsList className="bg-black/30">
              <TabsTrigger value="USD" className="data-[state=active]:bg-blue-600">
                <DollarSign className="h-4 w-4 mr-1" /> USD
              </TabsTrigger>
              <TabsTrigger value="JPY" className="data-[state=active]:bg-blue-600">
                <Yen className="h-4 w-4 mr-1" /> JPY
              </TabsTrigger>
              <TabsTrigger value="KSH" className="data-[state=active]:bg-blue-600">
                KSH
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            size="icon"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketData.map((item) => (
              <div key={item.symbol} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-white">{item.symbol}</h3>
                    <p className="text-sm text-white/70">{item.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">
                      {currencySymbols[currency]}
                      {formatPrice(item.price)}
                    </p>
                    <div
                      className={`flex items-center justify-end text-sm ${item.change >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {item.change >= 0 ? (
                        <ArrowUpIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3 mr-1" />
                      )}
                      <span>
                        {item.change >= 0 ? "+" : ""}
                        {item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between text-sm text-white/70">
                  <span>Volume: {formatVolume(item.volume)}</span>
                  <span>
                    {item.changePercent >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-400 inline" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400 inline" />
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
