import { type NextRequest, NextResponse } from "next/server"
import { getCachedData } from "@/lib/redis"

// Function to generate mock market data
function generateMockData(category: string) {
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

// In a real app, this would fetch from an actual API
async function fetchMarketData(category: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // For demo purposes, we're using mock data
  // In a real app, you would fetch from a real API
  return generateMockData(category)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "crypto"
    const refresh = searchParams.get("refresh") === "true"

    // Cache key includes the category
    const cacheKey = `market-data:${category}`

    // Cache TTL in seconds (5 minutes)
    const cacheTTL = 300

    let data

    if (refresh) {
      // Skip cache if refresh is requested
      data = await fetchMarketData(category)
      // Update cache with new data
      await getCachedData(cacheKey, async () => data, cacheTTL)
    } else {
      // Use cached data or fetch new data if not in cache
      data = await getCachedData(cacheKey, () => fetchMarketData(category), cacheTTL)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in market data API:", error)
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 })
  }
}
