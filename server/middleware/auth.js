import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Token invalid" });
    req.user = decoded;
    next();
  });
};
