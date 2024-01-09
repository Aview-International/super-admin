import { NextResponse } from 'next/server';
import { authStatus } from './utils/authStatus';

export function middleware(request) {
  const token = request.cookies.get('token');
  const status = authStatus(token);
  const currentUrl = request.url;
  if (!status) {
    request.cookies.delete('token');
    const response = NextResponse.redirect(new URL('/login?rdr=true', currentUrl));
    response.cookies.set('redirectUrl', currentUrl);
    return response;
  }
}

export const config = {
  matcher: [
    '/transcription',
    '/translation',
    '/dubbing-edits',
    '/creator',
    '/distribution/:path*',
    '/manual/:path*',
  ],
};
