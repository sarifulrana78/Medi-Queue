import { jwtVerify } from "jose";
import dotenv from "dotenv";

dotenv.config();

export const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Missing Bearer token in headers" });
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix
    const secret = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET);

    try {
      const verified = await jwtVerify(token, secret);
      req.user = verified.payload;
      next();
    } catch (jwtError) {
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
  } catch (error) {
    console.error("JWT Verification error in middleware:", error);
    return res.status(500).json({ message: "Internal server error during authentication", error: error.message });
  }
};
