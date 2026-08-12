import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if maintenance mode is enabled in the environment
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true'

  // If maintenance mode is active, rewrite all matching traffic to the maintenance page
  if (isMaintenanceMode) {
    // If the request is already for /maintenance, let it pass normally
    if (request.nextUrl.pathname === '/maintenance') {
      return NextResponse.next()
    }
    
    // Rewrite all other requests to the maintenance page
    // Using rewrite keeps the original URL in the browser (better for UX and returning visitors)
    return NextResponse.rewrite(new URL('/maintenance', request.url))
  }

  // If maintenance mode is OFF, but someone manually tries to access /maintenance, redirect to home
  if (request.nextUrl.pathname === '/maintenance') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Apply middleware to all routes except API, Next.js static assets, images, and favicons
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)',
  ],
}
