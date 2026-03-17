import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {findById} from '../models/user';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({error: 'Missing or invalid token'});
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {sub: string};
    const user = await findById(payload.sub);
    if (!user) {
      return res.status(401).json({error: 'User not found'});
    }
    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(401).json({error: 'Invalid or expired token'});
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!roles.includes(user.role)) {
      return res.status(403).json({error: 'Insufficient permissions'});
    }
    next();
  };
}
