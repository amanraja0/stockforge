import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import UserActivityLog from "../models/UserActivityLog.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // check existing user
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    await UserActivityLog.create({
      action: "CREATE",
      method: "SELF",
      targetUserName: user.name,
      targetUserEmail: user.email,
      targetUserRole: user.role,
      actorUserName: user.name,
      actorUserRole: user.role,
      note: "Registered through public signup",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // find user
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // generate token
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

 export const getProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!["ADMIN", "STAFF"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role selected",
      });
    }

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await UserActivityLog.create({
      action: "CREATE",
      method: "ADMIN",
      targetUserName: user.name,
      targetUserEmail: user.email,
      targetUserRole: user.role,
      actorUserName: req.user.name,
      actorUserRole: req.user.role,
      note: `Created by ${req.user.name}`,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password"],
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserActivityLogs = async (req, res) => {
  try {
    const logs = await UserActivityLog.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const userToDelete = await User.findByPk(id);

    if (!userToDelete) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (userToDelete.id === req.user.id) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    if (userToDelete.role !== "STAFF") {
      return res.status(400).json({
        message: "Only STAFF accounts can be deleted from here",
      });
    }

    await userToDelete.destroy();

    await UserActivityLog.create({
      action: "DELETE",
      method: "ADMIN",
      targetUserName: userToDelete.name,
      targetUserEmail: userToDelete.email,
      targetUserRole: userToDelete.role,
      actorUserName: req.user.name,
      actorUserRole: req.user.role,
      note: `Deleted by ${req.user.name}`,
    });

    res.status(200).json({
      message: `User ${userToDelete.name} deleted by ${req.user.name}`,
      deletedBy: req.user.name,
      deletedUser: userToDelete.name,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};