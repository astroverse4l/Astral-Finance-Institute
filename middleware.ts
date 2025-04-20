import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Simple pass-through middleware
  console.log("Middleware running for:", request.nextUrl.pathname)
  return NextResponse.next()
}

// Only run middleware on specific paths to minimize issues
export const config = {
  matcher: ["/api/:path*"],
}
