"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ExternalLink } from "lucide-react"
import Link from "next/link"

type NewsItem = {
  id: string
  title: string
  summary: string
  source: string
  url: string
  publishedAt: string
  imageUrl: string
}

export default function NewsSection({ category }: { category: string }) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true)
      try {
        // Simulate API call with a delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Generate mock news data based on the category
        const mockNews = generateMockNews(category)
        setNews(mockNews)
      } catch (error) {
        console.error("Error fetching news:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [category])

  const generateMockNews = (category: string): NewsItem[] => {
    const categoryNews: Record<string, NewsItem[]> = {
      forex: [
        {
          id: "fx1",
          title: "Dollar Strengthens Against Major Currencies as Fed Signals Rate Hike",
          summary:
            "The US dollar gained ground against major currencies after Federal Reserve officials hinted at potential interest rate increases in the coming months.",
          source: "Forex Daily",
          url: "#",
          publishedAt: "2 hours ago",
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "fx2",
          title: "Euro Weakens Following ECB's Dovish Stance on Monetary Policy",
          summary:
            "The euro fell against its major counterparts after the European Central Bank maintained a cautious approach to monetary tightening amid economic uncertainties.",
          source: "Currency News",
          url: "#",
          publishedAt: "5 hours ago",
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "fx3",
          title: "Japanese Yen Hits 3-Month Low Against Dollar on Diverging Monetary Policies",
          summary:
            "The yen continued its downward trend, reaching a three-month low against the dollar as the Bank of Japan maintains ultra-loose monetary policy while the Fed turns hawkish.",
          source: "Global Markets",
          url: "#",
          publishedAt: "8 hours ago",
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
      ],
      crypto: [
        {
          id: "crypto1",
          title: "Bitcoin Surges Past $70,000 as Institutional Adoption Accelerates",
          summary:
            "Bitcoin reached a new all-time high above $70,000 as major financial institutions continue to increase their cryptocurrency holdings.",
          source: "Crypto News",
          url: "#",
          publishedAt: "1 hour ago",
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "crypto2",
          title: "Ethereum Completes Major Network Upgrade, Gas Fees Drop Significantly",
          summary:
            "Ethereum successfully implemented its latest network upgrade, resulting in substantially lower transaction fees and improved scalability.",
          source: "DeFi Daily",
          url: "#",
          publishedAt: "4 hours ago",
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "crypto3",
          title: "Regulatory Clarity Emerges as Countries Adopt Crypto-Friendly Frameworks",
          summary:
            "Several major economies have announced clearer regulatory guidelines for cryptocurrencies, potentially paving the way for broader adoption.",
          source: "Blockchain Report",
          url: "#",
          publishedAt: "7 hours ago",
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
      ],
      web3: [
        {
          id: "web3-1",
          title: "Decentralized Social Media Platform Gains 1 Million Users in First Month",
          summary:
            "A new Web3 social media platform has attracted over a million users in its first month, challenging traditional centralized platforms.",
          source: "Web3 Insider",
          url: "#",
          publishedAt: "3 hours ago",
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "web3-2",
          title: "Major Gaming Studio Announces Web3 Integration for Popular Franchise",
          summary:
            "One of the world's largest gaming studios is implementing Web3 technology in its flagship franchise, allowing players to truly own in-game assets.",
          source: "Gaming Future",
          url: "#",
          publishedAt: "6 hours ago",
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "web3-3",
          title: "Decentralized Autonomous Organizations See 300% Growth in Participation",
          summary:
            "DAOs have experienced explosive growth in the past quarter, with participation rates tripling as more people embrace decentralized governance.",
          source: "DAO Times",
          url: "#",
          publishedAt: "9 hours ago",
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
      ],
      stocks: [
        {
          id: "stocks1",
          title: "Tech Stocks Rally as AI Advancements Drive Market Optimism",
          summary:
            "Technology stocks surged following announcements of breakthrough AI developments from several major companies in the sector.",
          source: "Market Watch",
          url: "#",
          publishedAt: "2 hours ago",
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "stocks2",
          title: "Healthcare Sector Outperforms Broader Market on Strong Earnings",
          summary:
            "Healthcare stocks outpaced the general market after multiple companies in the sector reported better-than-expected quarterly results.",
          source: "Stock Analysis",
          url: "#",
          publishedAt: "5 hours ago",
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "stocks3",
          title: "Energy Stocks Decline as Oil Prices Fall on Supply Concerns",
          summary:
            "The energy sector experienced a downturn as crude oil prices dropped following reports of increased production from major oil-producing nations.",
          source: "Financial Times",
          url: "#",
          publishedAt: "8 hours ago",
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
      ],
      derivatives: [
        {
          id: "deriv1",
          title: "Options Trading Volume Hits Record High Amid Market Volatility",
          summary:
            "Options trading reached unprecedented levels as investors sought to hedge positions and capitalize on market swings.",
          source: "Derivatives Insight",
          url: "#",
          publishedAt: "1 hour ago",
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "deriv2",
          title: "Futures Markets Signal Potential Commodities Rally in Coming Months",
          summary:
            "Futures contracts for various commodities are indicating a possible price surge as global demand is expected to outpace supply.",
          source: "Futures Daily",
          url: "#",
          publishedAt: "4 hours ago",
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "deriv3",
          title: "New Derivatives Exchange Launches with Focus on Emerging Markets",
          summary:
            "A new derivatives trading platform has been launched, specializing in financial instruments tied to emerging market economies.",
          source: "Global Finance",
          url: "#",
          publishedAt: "7 hours ago",
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
      ],
      shares: [
        {
          id: "shares1",
          title: "Dividend Stocks Gain Favor as Investors Seek Stable Income",
          summary:
            "Companies with strong dividend histories are attracting increased investment as market participants prioritize reliable income streams.",
          source: "Dividend Investor",
          url: "#",
          publishedAt: "2 hours ago",
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "shares2",
          title: "IPO Market Heats Up with Multiple High-Profile Listings Announced",
          summary:
            "The initial public offering landscape is becoming increasingly active with several major companies announcing plans to go public.",
          source: "IPO Watch",
          url: "#",
          publishedAt: "5 hours ago",
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "shares3",
          title: "Share Buybacks Reach Five-Year High as Companies Utilize Cash Reserves",
          summary:
            "Corporate share repurchase programs have hit a five-year peak as businesses deploy accumulated cash to boost shareholder value.",
          source: "Shareholder News",
          url: "#",
          publishedAt: "8 hours ago",
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
      ],
    }

    return categoryNews[category] || []
  }

  const formatTimeAgo = (timeString: string): string => {
    return timeString // In a real app, we would convert actual timestamps
  }

  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="text-white">Latest News</CardTitle>
        <CardDescription className="text-white/70">Stay updated with the latest {category} news</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {news.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row gap-4 pb-6 border-b border-white/10 last:border-0 last:pb-0"
              >
                <div className="md:w-1/3 h-40 md:h-auto rounded-lg overflow-hidden">
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-lg font-medium text-white mb-2">
                    <Link href={item.url} className="hover:text-blue-400 transition-colors">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-white/70 mb-3">{item.summary}</p>
                  <div className="flex justify-between items-center text-sm text-white/60">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatTimeAgo(item.publishedAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">{item.source}</span>
                      <Link href={item.url} className="text-blue-400 hover:text-blue-300">
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
