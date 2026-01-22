import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
};

export const register = async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, user, 'User registered successfully'));
};

export const login = async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(
    req.body
  );

  res
    .status(200)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user, accessToken },
        'User logged in successfully'
      )
    );
};

export const refresh = async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  const { accessToken } = await authService.refreshAccessToken(incomingRefreshToken);

  res
    .status(200)
    .json(new ApiResponse(200, { accessToken }, 'Access token refreshed'));
};

export const logout = async (req: Request, res: Response) => {
  res
    .status(200)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
};
