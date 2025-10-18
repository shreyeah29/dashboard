import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    isAdmin: boolean;
  };
}

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    req.user = {
      id: decoded.id,
      isAdmin: decoded.isAdmin
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};
