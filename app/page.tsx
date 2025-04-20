import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-white mb-6">Astral Finance Institute</h1>
      <p className="text-xl text-white/80 max-w-2xl text-center mb-8">
        Learn about cryptocurrency, forex, and web3 technologies
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/courses"
          className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white font-medium transition"
        >
          Browse Courses
        </Link>
        <Link
          href="/sign-in"
          className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white font-medium transition"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}
