import bcrypt from 'bcrypt';
import { ValidationUtil } from '../utils/validation.util';
import { JWTUtil } from '../utils/jwt.util';
import prisma from '../config/prisma';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  static async register(data: RegisterData) {
    const { name, email, password } = data;

    // Validation
    if (!ValidationUtil.isValidName(name)) {
      throw new Error('Name must be at least 2 characters long');
    }

    if (!ValidationUtil.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (!ValidationUtil.isValidPassword(password)) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const accessToken = JWTUtil.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = JWTUtil.generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  static async login(data: LoginData) {
    const { email, password } = data;

    // Validation
    if (!ValidationUtil.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (!password) {
      throw new Error('Password is required');
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const accessToken = JWTUtil.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = JWTUtil.generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  static async refreshToken(refreshToken: string) {
    try {
      const payload = JWTUtil.verifyRefreshToken(refreshToken);

      // Verify user still exists
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Generate new tokens
      const newAccessToken = JWTUtil.generateAccessToken({
        userId: user.id,
        email: user.email,
      });

      const newRefreshToken = JWTUtil.generateRefreshToken({
        userId: user.id,
        email: user.email,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
