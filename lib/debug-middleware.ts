import { type NextRequest, NextResponse } from "next/server"

export function debugRequest(request: NextRequest) {
  // Log request details to help debug 404 issues
  console.log({
    url: request.url,
    method: request.method,
    nextUrl: {
      pathname: request.nextUrl.pathname,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    },
    headers: Object.fromEntries(request.headers.entries()),
  })

  return NextResponse.next()
}
