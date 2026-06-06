import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // get token from headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // no token
    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // get user
    req.user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, invalid token",
    });
  }
};

export default authMiddleware;