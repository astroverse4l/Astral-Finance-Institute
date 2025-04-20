"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Menu, X } from "lucide-react"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { SearchBar } from "@/components/search/search-bar"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Staking", href: "/staking" },
  { label: "Mining", href: "/mining" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isLoading, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/images/logo.png" alt="Astral Finance" className="h-8 w-8" />
              <span className="text-xl font-bold text-white">Astral Finance</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium ${
                  pathname === item.href
                    ? "text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <SearchBar />
            </div>

            {user && !isLoading && <NotificationBell />}

            {isLoading ? (
              <div className="h-10 w-20 bg-white/10 rounded-md animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2">
                  <Link href="/profile">
                    <div className="flex items-center space-x-2 hover:bg-white/10 px-3 py-2 rounded-md transition-colors">
                      <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                        {user.image ? (
                          <img
                            src={user.image || "/placeholder.svg"}
                            alt={user.name}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <span className="text-sm font-medium text-white">{user.name.charAt(0)}</span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-white">{user.name}</span>
                    </div>
                  </Link>

                  {user.role === "admin" && (
                    <Link href="/admin">
                      <Button variant="outline" size="sm" className="border-white/20 text-white">
                        Admin
                      </Button>
                    </Link>
                  )}

                  <Button variant="outline" size="sm" className="border-white/20 text-white" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>

                <button
                  className="md:hidden text-white"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/sign-in">
                  <Button variant="outline" className="border-white/20 text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" className="hidden md:block">
                  <Button>Sign Up</Button>
                </Link>

                <button
                  className="md:hidden text-white"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="mb-4">
              <SearchBar />
            </div>

            <nav className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 text-sm font-medium ${
                    pathname === item.href
                      ? "text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                      {user.image ? (
                        <img src={user.image || "/placeholder.svg"} alt={user.name} className="h-6 w-6 rounded-full" />
                      ) : (
                        <span className="text-xs font-medium text-white">{user.name.charAt(0)}</span>
                      )}
                    </div>
                    <span>Profile</span>
                  </Link>

                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <button
                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                    onClick={() => {
                      signOut()
                      setIsMenuOpen(false)
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-white/20 text-white">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
