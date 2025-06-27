import { createMiddleware } from 'hono/factory';

export const cacheControlMiddleware = createMiddleware(async (c, next) => {
  await next();
  
  const url = new URL(c.req.url);
  
  // Static assets cache for 1 year
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ico)$/)) {
    c.res.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  // API responses - no cache
  else if (url.pathname.startsWith('/api/')) {
    c.res.headers.set('Cache-Control', 'private, no-store, max-age=0');
  }
  // HTML pages - short cache with revalidation
  else {
    c.res.headers.set('Cache-Control', 'public, max-age=300, must-revalidate');
  }
});
