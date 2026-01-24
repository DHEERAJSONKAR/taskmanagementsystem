import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
}

export class JWTUtil {
  private static getAccessSecret(): string {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not defined in environment variables');
    }
    return secret;
  }

  private static getRefreshSecret(): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
    }
    return secret;
  }

  private static accessExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
  private static refreshExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';

  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.getAccessSecret(), {
      expiresIn: this.accessExpiry,
    } as jwt.SignOptions);
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.getRefreshSecret(), {
      expiresIn: this.refreshExpiry,
    } as jwt.SignOptions);
  }

  static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, this.getAccessSecret()) as TokenPayload;
  }

  static verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, this.getRefreshSecret()) as TokenPayload;
  }
}
