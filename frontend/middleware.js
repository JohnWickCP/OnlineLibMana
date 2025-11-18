// Suggested middleware fix (allow /admin/login and internal assets, then protect other /admin/*)
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Redirect root (/) to /books
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/books', request.url));
  }

  // Auth token check
  const token = request.cookies.get('auth_token')?.value;
  const role = request.cookies.get('user_role')?.value;

  // Allow admin public pages and internal Next.js assets to pass through without auth check
  // (avoid protecting the login page itself, which causes a redirect loop)
  if (
    pathname === '/admin/login' ||              // allow login page
    pathname.startsWith('/admin/_next') ||      // allow next internals
    pathname.startsWith('/admin/static')        // allow any static under admin if present
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

  // Protect user dashboard
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