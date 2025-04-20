"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Clock } from "lucide-react"
import Link from "next/link"

type Course = {
  id: string
  title: string
  description: string
  instructor: string
  level: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  students: number
  rating: number
  imageUrl: string
  price: number
  category: string
}

export default function PopularCourses({ category, limit = 3 }: { category: string; limit?: number }) {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true)
      try {
        // Simulate API call with a delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Generate mock courses based on the category
        const mockCourses = generateMockCourses(category)
        setCourses(mockCourses.slice(0, limit))
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [category, limit])

  const generateMockCourses = (category: string): Course[] => {
    const levels: ("Beginner" | "Intermediate" | "Advanced")[] = ["Beginner", "Intermediate", "Advanced"]
    const instructors = [
      "Dr. Sarah Johnson",
      "Michael Chen",
      "Emma Rodriguez",
      "Prof. David Kim",
      "Olivia Williams",
      "James Taylor",
      "Sophia Martinez",
      "Daniel Lee",
    ]

    const categorySpecificCourses: Record<string, { titles: string[]; descriptions: string[] }> = {
      forex: {
        titles: [
          "Forex Trading Fundamentals",
          "Technical Analysis for Currency Markets",
          "Risk Management in Forex Trading",
          "Advanced Forex Trading Strategies",
          "Mastering Forex Price Action",
          "Forex Algorithmic Trading",
          "Fundamental Analysis for Forex",
          "Psychology of Forex Trading",
          "Forex Swing Trading Mastery",
          "Forex Market Correlations",
          "Trading Major Currency Pairs",
          "Exotic Currency Pairs Explained",
          "Forex Trading Journal Techniques",
          "Central Banks and Forex Markets",
          "Forex Trading for Retirement",
        ],
        descriptions: [
          "Learn the basics of forex trading, including currency pairs, pips, and market structure.",
          "Master technical analysis tools and indicators specifically for currency markets.",
          "Develop effective risk management strategies to protect your forex trading capital.",
          "Explore advanced trading techniques used by professional forex traders.",
          "Learn to read price action and trade based on candlestick patterns in forex markets.",
          "Build and implement algorithmic trading systems for the forex market.",
          "Understand how economic indicators and news events impact currency values.",
          "Develop the mental discipline needed for successful forex trading.",
          "Master medium-term forex trading strategies with optimal entry and exit points.",
          "Understand how different currency pairs and markets correlate with each other.",
          "Deep dive into trading strategies for the most liquid currency pairs.",
          "Explore opportunities in less common currency pairs and their unique characteristics.",
          "Learn how to maintain an effective trading journal to improve your forex results.",
          "Understand how central bank policies affect currency valuations and trends.",
          "Build a long-term forex trading strategy for retirement income.",
        ],
      },
      crypto: {
        titles: [
          "Cryptocurrency Fundamentals",
          "Blockchain Technology Explained",
          "Crypto Trading Strategies",
          "DeFi Investment Fundamentals",
          "NFT Creation and Trading",
          "Crypto Security Best Practices",
          "Technical Analysis for Crypto",
          "Fundamental Analysis for Crypto",
          "Crypto Tax Planning",
          "Mining and Staking Fundamentals",
          "Crypto Market Cycles",
          "Altcoin Investment Strategies",
          "Crypto Portfolio Management",
          "Layer 2 Solutions Explained",
          "Crypto Regulation Compliance",
        ],
        descriptions: [
          "Understand the basics of cryptocurrencies, blockchain, and digital assets.",
          "Learn how blockchain technology works and its applications beyond cryptocurrencies.",
          "Master various trading strategies specifically designed for volatile crypto markets.",
          "Explore decentralized finance protocols and yield-generating strategies.",
          "Learn how to create, buy, sell, and trade non-fungible tokens in various marketplaces.",
          "Protect your crypto assets with industry-standard security practices and tools.",
          "Apply technical analysis indicators and patterns to cryptocurrency trading.",
          "Evaluate crypto projects based on tokenomics, team, technology, and adoption.",
          "Understand tax implications of crypto trading and strategies to optimize tax outcomes.",
          "Learn about cryptocurrency mining and staking to generate passive income.",
          "Understand historical crypto market cycles and prepare for future market movements.",
          "Develop strategies for identifying and investing in promising alternative cryptocurrencies.",
          "Build and manage a diversified cryptocurrency portfolio for long-term growth.",
          "Understand scaling solutions that improve blockchain transaction speed and cost.",
          "Navigate the evolving regulatory landscape for cryptocurrencies across jurisdictions.",
        ],
      },
      web3: {
        titles: [
          "Web3 Fundamentals",
          "Smart Contract Development",
          "Decentralized Applications (dApps)",
          "DAOs: Structure and Governance",
          "Web3 UX Design Principles",
          "Tokenomics and Mechanism Design",
          "Web3 Security Fundamentals",
          "Interoperability Protocols",
          "Zero-Knowledge Proofs",
          "Web3 Infrastructure",
          "Metaverse Development",
          "Web3 Business Models",
          "Identity in Web3",
          "Web3 Social Platforms",
          "Web3 Legal Frameworks",
        ],
        descriptions: [
          "Understand the fundamentals of Web3 and how it differs from previous internet paradigms.",
          "Learn to develop, test, and deploy smart contracts on various blockchains.",
          "Build decentralized applications with front-end interfaces that connect to blockchain backends.",
          "Explore the structure, governance, and operation of Decentralized Autonomous Organizations.",
          "Design user experiences that bridge the gap between Web2 and Web3 interfaces.",
          "Learn principles of token economics and incentive mechanism design for Web3 projects.",
          "Understand common security vulnerabilities in Web3 applications and how to prevent them.",
          "Explore protocols that enable different blockchains and Web3 systems to communicate.",
          "Learn about zero-knowledge proofs and their applications in privacy and scaling.",
          "Understand the infrastructure layers that power the Web3 ecosystem.",
          "Develop for metaverse platforms using Web3 technologies and principles.",
          "Explore sustainable business models in the Web3 ecosystem.",
          "Understand decentralized identity systems and their implementation in Web3.",
          "Learn about decentralized social media platforms and content ownership.",
          "Navigate the complex legal landscape surrounding Web3 technologies and applications.",
        ],
      },
      stocks: {
        titles: [
          "Stock Market Fundamentals",
          "Value Investing Principles",
          "Growth Stock Strategies",
          "Dividend Investing",
          "Technical Analysis for Stocks",
          "Fundamental Analysis Deep Dive",
          "Stock Options Trading",
          "Sector Rotation Strategies",
          "IPO Investing Strategies",
          "Stock Market Psychology",
          "Algorithmic Stock Trading",
          "ESG Investing Principles",
          "Small Cap Stock Strategies",
          "International Stock Markets",
          "Stock Portfolio Management",
        ],
        descriptions: [
          "Learn the basics of stock markets, including how they work and key terminology.",
          "Master the principles of value investing as taught by Benjamin Graham and Warren Buffett.",
          "Identify and invest in high-growth companies with sustainable competitive advantages.",
          "Build a passive income stream through dividend-paying stocks and reinvestment strategies.",
          "Apply chart patterns and technical indicators to improve stock trading decisions.",
          "Analyze company financial statements to determine intrinsic value and investment potential.",
          "Understand stock options and develop strategies for income generation and risk management.",
          "Learn to rotate investments between different market sectors based on economic cycles.",
          "Develop strategies for evaluating and investing in companies going public.",
          "Understand market psychology and behavioral biases that affect stock prices.",
          "Build and implement algorithmic trading systems for the stock market.",
          "Incorporate environmental, social, and governance factors into investment decisions.",
          "Discover strategies for finding undervalued small-cap companies with growth potential.",
          "Explore global stock markets and international diversification strategies.",
          "Construct and manage a diversified stock portfolio aligned with your financial goals.",
        ],
      },
      derivatives: {
        titles: [
          "Derivatives Fundamentals",
          "Options Trading Strategies",
          "Futures Trading Essentials",
          "Swaps and Structured Products",
          "Options Greeks Mastery",
          "Volatility Trading Strategies",
          "Hedging with Derivatives",
          "Commodity Derivatives",
          "Interest Rate Derivatives",
          "Credit Derivatives",
          "Exotic Options and Products",
          "Derivatives Risk Management",
          "Derivatives Pricing Models",
          "Regulatory Framework for Derivatives",
          "Derivatives Portfolio Management",
        ],
        descriptions: [
          "Understand the basics of derivatives, including options, futures, swaps, and forwards.",
          "Master various options trading strategies for income, growth, and protection.",
          "Learn how to trade futures contracts across different asset classes.",
          "Explore complex derivatives like swaps and structured products used by institutions.",
          "Understand options Greeks (Delta, Gamma, Theta, Vega, Rho) and their practical applications.",
          "Develop trading strategies focused on market volatility rather than direction.",
          "Learn how to use derivatives to hedge existing positions and manage portfolio risk.",
          "Explore derivatives based on commodities like oil, gold, agricultural products, and more.",
          "Understand derivatives based on interest rates, including futures, options, and swaps.",
          "Learn about credit default swaps and other derivatives based on credit risk.",
          "Explore non-standard options and complex derivative products used in specialized markets.",
          "Develop comprehensive risk management frameworks for derivatives trading.",
          "Understand mathematical models used to price various derivative instruments.",
          "Navigate the complex regulatory environment governing derivatives markets.",
          "Build and manage a derivatives portfolio across multiple asset classes.",
        ],
      },
      shares: {
        titles: [
          "Share Investing Fundamentals",
          "Corporate Actions and Shares",
          "Share Valuation Methods",
          "Preferred Shares Investing",
          "Share Buybacks Analysis",
          "Rights Issues and Offerings",
          "Shareholder Activism",
          "Dual-Class Share Structures",
          "Private Company Shares",
          "Employee Stock Ownership",
          "Share Dealing Strategies",
          "Fractional Share Investing",
          "Direct Share Purchase Plans",
          "Dividend Reinvestment Plans",
          "International Share Investing",
        ],
        descriptions: [
          "Learn the fundamentals of share ownership and how to start investing in company shares.",
          "Understand how corporate actions like splits, consolidations, and spinoffs affect shareholders.",
          "Master different methods to determine the fair value of company shares.",
          "Explore preferred shares and their unique characteristics compared to common shares.",
          "Analyze the impact of share repurchase programs on company value and share price.",
          "Understand rights issues and secondary offerings and their impact on existing shareholders.",
          "Learn about shareholder activism and how investors can influence corporate decisions.",
          "Explore companies with multiple share classes and the implications for investors.",
          "Learn how to invest in shares of private companies before they go public.",
          "Understand employee stock options, RSUs, and other equity compensation plans.",
          "Develop effective strategies for buying and selling shares in various market conditions.",
          "Learn how to build a diversified portfolio using fractional shares with limited capital.",
          "Explore direct stock purchase plans that allow buying shares directly from companies.",
          "Understand dividend reinvestment plans (DRIPs) and their compounding benefits.",
          "Navigate international share markets and manage currency risks when investing globally.",
        ],
      },
    }

    const { titles, descriptions } = categorySpecificCourses[category] || { titles: [], descriptions: [] }

    return titles.map((title, index) => ({
      id: `${category}-course-${index + 1}`,
      title,
      description: descriptions[index],
      instructor: instructors[Math.floor(Math.random() * instructors.length)],
      level: levels[Math.floor(Math.random() * levels.length)],
      duration: `${Math.floor(Math.random() * 20) + 5} hours`,
      students: Math.floor(Math.random() * 10000) + 500,
      rating: Math.random() * 2 + 3, // Rating between 3 and 5
      imageUrl: `/placeholder.svg?height=200&width=350&text=${encodeURIComponent(title)}`,
      price: Math.floor(Math.random() * 150) + 49,
      category,
    }))
  }

  const formatStudentCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, index) => (
            <div key={index} className="h-[360px] rounded-lg animate-pulse bg-white/5"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link href={`/courses/${category}/${course.id}`} key={course.id} className="block h-full">
              <Card className="course-card h-full flex flex-col">
                <div className="relative">
                  <img
                    src={course.imageUrl || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-3 right-3 bg-blue-600">${course.price}</Badge>
                </div>
                <CardContent className="flex-grow p-4">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs border-purple-400 text-purple-400">
                      {course.level}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">{course.description}</p>
                  <p className="text-white/80 text-sm">Instructor: {course.instructor}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 border-t border-white/10 mt-auto">
                  <div className="flex justify-between items-center w-full text-sm text-white/70">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{formatStudentCount(course.students)}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400" />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
