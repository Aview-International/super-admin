import { NextResponse } from 'next/server';
import { authStatus } from './utils/authStatus';

export function middleware(request) {
  const sessionCookie = request.cookies.get('session');
  const currentUrl = request.url;
  const response = NextResponse.redirect(new URL('/?rdr=true', currentUrl));

  try {
    if (!authStatus(sessionCookie)) {
      response.cookies.set('redirectUrl', currentUrl);
      return response;
    }
  } catch (error) {
    response.cookies.set('redirectUrl', currentUrl);
    return response;
  }
}

export const config = {
  matcher: [
    '/dashboard',
    '/distribution/:path*',
    '/moderation',
    '/overlay-flags',
    '/pending',
  ],
};
