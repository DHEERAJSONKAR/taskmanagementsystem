import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { ApiError } from '../utils/apiError';
import { generateTokens } from '../utils/jwt';

export const registerUser = async (data: any) => {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    throw new ApiError(400, 'All fields are required');
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const loginUser = async (data: any) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const { accessToken, refreshToken } = generateTokens(user);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, accessToken, refreshToken };
};

export const refreshAccessToken = async (token: string) => {
  if (!token) {
    throw new ApiError(401, 'Refresh token is required');
  }

  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;

  if (!refreshTokenSecret || !accessTokenSecret || !accessTokenExpiry) {
    throw new ApiError(500, 'JWT secret or expiry not configured');
  }

  try {
    const decoded = jwt.verify(
      token,
      refreshTokenSecret
    ) as jwt.JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    const newAccessToken = jwt.sign({ id: decoded.id }, accessTokenSecret, {
      expiresIn: accessTokenExpiry,
    } as jwt.SignOptions);

    return { accessToken: newAccessToken };
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
};
