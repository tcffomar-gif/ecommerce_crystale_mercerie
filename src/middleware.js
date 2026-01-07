// // // export { default } from "next-auth/middleware";

// // import { withAuth } from "next-auth/middleware";

// // export default withAuth({
// //   pages: {
// //     signIn: "/login",
// //   },
// // });

// // export const config = {
// //   matcher: [
// //     // "/historique",
// //     // "/cart",
// //     // "/profile",
    
// //   ],
// // };


// import createMiddleware from 'next-intl/middleware';
// import {routing} from './i18n/routing';
 
// export default createMiddleware(routing);
 
// export const config = {
//   // Match only internationalized pathnames
//   matcher: ['/', '/(fr|ar)/:path*']
// };



import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';

// Middleware i18n
const intlMiddleware = createIntlMiddleware(routing);

// Middleware CORS
function applyCors(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}

export default function middleware(request) {
  // 1. Gestion des requêtes OPTIONS (CORS Preflight)
  if (request.method === 'OPTIONS') {
    const response = NextResponse.json({}, { status: 200 });
    return applyCors(response);
  }

  // 2. Appliquer le middleware i18n sur les routes non-API
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return intlMiddleware(request);
  }

  // 3. Pour les routes API, ajouter les headers CORS
  const response = NextResponse.next();
  return applyCors(response);
}

// Configuration du matcher (i18n + API)
export const config = {
  matcher: [
    '/', 
    '/(fr|ar)/:path*',  // Routes i18n
    '/api/:path*',       // Routes API
  ],
};