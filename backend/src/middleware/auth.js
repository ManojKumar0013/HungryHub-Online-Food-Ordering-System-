import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hungryhub_dev_secret_change_me';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Optional auth: attaches req.user if a valid token is present, but never
// blocks the request. Good enough for this project's scope — most routes
// are read-mostly and role checks happen at the UI/role-switcher level.
export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(header.slice(7), JWT_SECRET);
    } catch {
      // ignore invalid/expired token, treat as anonymous
    }
  }
  next();
}
