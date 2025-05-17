import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access')?.value;
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = [
    '/dashboard/admin',
    '/dashboard/student',
    '/dashboard/psychologist'
  ];

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!accessToken) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
