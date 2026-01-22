import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { ApiError } from './apiError';

export const generateTokens = (user: User) => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

  if (
    !accessTokenSecret ||
    !accessTokenExpiry ||
    !refreshTokenSecret ||
    !refreshTokenExpiry
  ) {
    throw new ApiError(500, 'JWT secret or expiry not configured');
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    accessTokenSecret,
    { expiresIn: accessTokenExpiry } as jwt.SignOptions
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    refreshTokenSecret,
    { expiresIn: refreshTokenExpiry } as jwt.SignOptions
  );

  return { accessToken, refreshToken };
};
