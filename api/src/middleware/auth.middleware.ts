import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../services";
import { MiddleWareFn } from "./types";

interface TokenRes extends JwtPayload {
  _id: number;
  type: "accessToken" | "refreshToken";
}

export const auth: MiddleWareFn = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new Error("no auth header");
    const decoded = verifyToken<TokenRes | null>(token, "accessToken");
    if (!decoded) throw new Error("session expired");
    req.user_id = decoded?._id;
    next();
  } catch (e) {
    res
      .status(401)
      .send({ detail: "Please add authorization header or refresh token" });
  }
};
