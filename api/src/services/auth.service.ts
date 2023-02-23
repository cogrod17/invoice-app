import jwt, { SignOptions } from "jsonwebtoken";

const ACCESS_SALT = process.env.ACCESS_SALT;
const REFRESH_SALT = process.env.REFRESH_SALT;

interface TokenPayload {
  _id: number;
  type: "accessToken" | "refreshToken";
  options: SignOptions;
}

const keys = {
  accessToken: ACCESS_SALT,
  refreshToken: REFRESH_SALT,
};

export const generateToken = (payload: TokenPayload) => {
  const type = keys[payload.type];
  if (!type) return;
  return jwt.sign(payload, type, {
    ...(payload?.options && payload.options),
    algorithm: "HS256",
  });
};

export const verifyToken = <T>(
  token: string,
  type: "accessToken" | "refreshToken"
) => {
  try {
    const salt = keys[type];
    if (!salt) throw new Error("no salt found");
    return jwt.verify(token, salt) as T;
  } catch (e) {
    return null;
  }
};

export const signTokens = (userId: number) => {
  const access_token = generateToken({
    _id: userId,
    type: "accessToken",
    options: { expiresIn: "2h" },
  });

  const refresh_token = generateToken({
    _id: userId,
    type: "refreshToken",
    options: { expiresIn: "3h" },
  });

  return { refresh_token, access_token };
};
