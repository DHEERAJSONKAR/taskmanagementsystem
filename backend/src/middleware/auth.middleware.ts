import { Response, NextFunction } from 'express';
import { JWTUtil } from '../utils/jwt.util';
import { AuthRequest } from '../types/express';

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access token missing or invalid',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = JWTUtil.verifyAccessToken(token);
      req.user = payload;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired access token',
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
    return;
  }
};
