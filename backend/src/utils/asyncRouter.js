import { Router } from 'express';

// Express 4 doesn't automatically catch rejected promises thrown inside
// async route handlers — an uncaught rejection just leaves the request
// hanging with no response. This wraps every router.get/post/patch/delete
// call so a thrown/rejected error is passed to next(err), which reaches
// the centralized error handler in server.js and comes back as clean JSON.
export function asyncRouter() {
  const router = Router();
  for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
    const original = router[method].bind(router);
    router[method] = (path, handler) => original(path, (req, res, next) => {
      Promise.resolve(handler(req, res, next)).catch(next);
    });
  }
  return router;
}
