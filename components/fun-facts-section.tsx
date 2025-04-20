"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

type FunFact = {
  id: string
  fact: string
}

export default function FunFactsSection({ category }: { category: string }) {
  const [funFacts, setFunFacts] = useState<FunFact[]>([])
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFunFacts = async () => {
      setIsLoading(true)
      try {
        // Simulate API call with a delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Generate mock fun facts based on the category
        const mockFacts = generateMockFunFacts(category)
        setFunFacts(mockFacts)
        setCurrentFactIndex(0)
      } catch (error) {
        console.error("Error fetching fun facts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFunFacts()

    // Rotate facts every 10 seconds
    const intervalId = setInterval(() => {
      if (funFacts.length > 0) {
        setCurrentFactIndex((prevIndex) => (prevIndex + 1) % funFacts.length)
      }
    }, 10000)

    return () => clearInterval(intervalId)
  }, [category])

  const generateMockFunFacts = (category: string): FunFact[] => {
    const categoryFacts: Record<string, FunFact[]> = {
      forex: [
        {
          id: "fx-fact-1",
          fact: "The forex market trades over $6.6 trillion per day, making it the largest financial market in the world.",
        },
        {
          id: "fx-fact-2",
          fact: "The most traded currency pair in the world is EUR/USD, accounting for about 28% of daily forex trades.",
        },
        {
          id: "fx-fact-3",
          fact: "The forex market operates 24 hours a day, 5 days a week, across major financial centers globally.",
        },
        {
          id: "fx-fact-4",
          fact: "Before electronic trading, forex was traded primarily by banks and large institutions through telephones.",
        },
        {
          id: "fx-fact-5",
          fact: "The British Pound (GBP) is the oldest currency still in use today, dating back to the 8th century.",
        },
      ],
      crypto: [
        {
          id: "crypto-fact-1",
          fact: "Bitcoin's creator, known by the pseudonym Satoshi Nakamoto, remains anonymous to this day.",
        },
        {
          id: "crypto-fact-2",
          fact: "The first commercial Bitcoin transaction was for two pizzas, purchased for 10,000 BTC in 2010.",
        },
        {
          id: "crypto-fact-3",
          fact: "There will only ever be 21 million Bitcoins in existence, with the last one expected to be mined around 2140.",
        },
        {
          id: "crypto-fact-4",
          fact: "Ethereum was proposed in 2013 by programmer Vitalik Buterin when he was just 19 years old.",
        },
        {
          id: "crypto-fact-5",
          fact: "If you lose your private keys to your cryptocurrency wallet, your funds may be permanently inaccessible.",
        },
      ],
      web3: [
        {
          id: "web3-fact-1",
          fact: "Web3 aims to create a decentralized internet where users own their data and digital assets.",
        },
        { id: "web3-fact-2", fact: "The term 'Web3' was coined by Ethereum co-founder Gavin Wood in 2014." },
        {
          id: "web3-fact-3",
          fact: "DAOs (Decentralized Autonomous Organizations) are organizations governed by smart contracts instead of traditional hierarchies.",
        },
        {
          id: "web3-fact-4",
          fact: "NFTs (Non-Fungible Tokens) became mainstream in 2021 with digital artist Beeple selling an NFT for $69 million.",
        },
        {
          id: "web3-fact-5",
          fact: "Web3 technologies often use blockchain to ensure transparency and immutability of data.",
        },
      ],
      stocks: [
        {
          id: "stocks-fact-1",
          fact: "The New York Stock Exchange (NYSE) was founded in 1792 and is the world's largest stock exchange by market capitalization.",
        },
        {
          id: "stocks-fact-2",
          fact: "The term 'bull market' comes from the way bulls attack by thrusting their horns upward, symbolizing rising prices.",
        },
        {
          id: "stocks-fact-3",
          fact: "Apple became the first company to reach a $1 trillion market cap in August 2018.",
        },
        {
          id: "stocks-fact-4",
          fact: "The Dow Jones Industrial Average originally consisted of just 12 companies when it was created in 1896.",
        },
        {
          id: "stocks-fact-5",
          fact: "The largest single-day percentage drop in the Dow Jones was on Black Monday in 1987, when it fell 22.6%.",
        },
      ],
      derivatives: [
        {
          id: "deriv-fact-1",
          fact: "Derivatives trading dates back to ancient times, with evidence of forward contracts in Mesopotamia around 1750 BC.",
        },
        {
          id: "deriv-fact-2",
          fact: "The global derivatives market is estimated to be worth over $1 quadrillion in notional value.",
        },
        {
          id: "deriv-fact-3",
          fact: "Options contracts give the holder the right, but not the obligation, to buy or sell an asset at a specified price.",
        },
        {
          id: "deriv-fact-4",
          fact: "The Black-Scholes model, developed in 1973, revolutionized options pricing and earned its creators a Nobel Prize.",
        },
        {
          id: "deriv-fact-5",
          fact: "Weather derivatives allow companies to hedge against financial risks associated with adverse weather conditions.",
        },
      ],
      shares: [
        {
          id: "shares-fact-1",
          fact: "The concept of joint-stock companies dates back to the 1600s with the formation of the Dutch East India Company.",
        },
        {
          id: "shares-fact-2",
          fact: "Preferred shareholders typically receive dividends before common shareholders but have limited voting rights.",
        },
        {
          id: "shares-fact-3",
          fact: "Stock splits don't change a company's value but make shares more accessible by lowering the price per share.",
        },
        {
          id: "shares-fact-4",
          fact: "Dividend aristocrats are companies that have increased their dividend payouts for at least 25 consecutive years.",
        },
        {
          id: "shares-fact-5",
          fact: "Blue-chip stocks are shares of large, well-established companies with a history of reliable performance.",
        },
      ],
    }

    return categoryFacts[category] || []
  }

  return (
    <Card className="gradient-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">Fun Facts</CardTitle>
          <CardDescription className="text-white/70">Did you know?</CardDescription>
        </div>
        <Lightbulb className="h-5 w-5 text-yellow-400" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : funFacts.length > 0 ? (
          <div className="bg-white/5 p-4 rounded-lg min-h-[120px] flex items-center">
            <p className="text-white/90 italic">"{funFacts[currentFactIndex].fact}"</p>
          </div>
        ) : (
          <div className="bg-white/5 p-4 rounded-lg min-h-[120px] flex items-center justify-center">
            <p className="text-white/70">No fun facts available for this category.</p>
          </div>
        )}
        {!isLoading && funFacts.length > 0 && (
          <div className="flex justify-center mt-4">
            {funFacts.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${index === currentFactIndex ? "bg-blue-500" : "bg-white/30"}`}
                onClick={() => setCurrentFactIndex(index)}
                aria-label={`View fact ${index + 1}`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
