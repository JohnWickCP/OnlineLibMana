// Suggested middleware fix: allow Next.js internals and common static paths,
// protect /admin/* while avoiding redirect loops for internal asset requests.
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Redirect root (/) to /books
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/books', request.url));
  }

  // Auth token and role from cookies
  const token = request.cookies.get('auth_token')?.value;
  const role = request.cookies.get('user_role')?.value;

  // Allow Next internals, API routes, static and public assets to pass through
  // This prevents middleware from intercepting internal RSC/_next requests
  if (
    pathname === '/admin/login' ||     // allow login page
    pathname.startsWith('/_next') ||   // NEXT internals (important)
    pathname.startsWith('/static') ||  // static folder if any
    pathname.startsWith('/assets') ||  // optional assets folder
    pathname.startsWith('/api') ||     // next/api routes
    pathname === '/favicon.ico'        // favicon
  ) {
    // If an already-logged-in user tries to visit /admin/login, redirect them away
    if (pathname === '/admin/login' && token) {
      if (role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/books', request.url));
    }
    return NextResponse.next();
  }

  // Protect admin routes (other than allowed ones above)
  if (pathname.startsWith('/admin')) {
    if (!token || role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect user dashboard (if you actually have /dashboard or /profile)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/profile')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Redirect logged-in users away from auth pages under /auth
  if (pathname.startsWith('/auth') && token) {
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/books', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/auth/:path*',
  ],
};