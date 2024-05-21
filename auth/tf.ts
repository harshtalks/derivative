import { TimeSpan } from "oslo";
import { createJWT as createOsloJWT, validateJWT } from "oslo/jwt";
import { env } from "@/env";

export const getKey = () => {
  const secret = Buffer.from(env.WEB_AUTH_PRIVATE_KEY, "base64");
  return secret;
};

export const createJWT = async (payload: {
  userId: string;
  authenticatorId: string;
  userAuthId: string;
}) => {
  return createOsloJWT("HS256", getKey(), payload, {
    expiresIn: new TimeSpan(24, "h"),
  });
};

export const verifyJWT = async (token: string) => {
  return validateJWT("HS256", getKey(), token);
};

export const COOKIE_NAME = "web_auth_n_cookie";
