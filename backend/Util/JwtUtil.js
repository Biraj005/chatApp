import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || "yourSecretKey";

export const getToken = (userId) => {
  return jwt.sign({ userId }, SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};
