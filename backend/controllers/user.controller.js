import { User } from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//user register
const registerUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({ message: "user already exists" });
    }

    const hashedPass = await bcrypt.hash(password, process.env.SALT);
   
    const newUser = await User.create({
      username,
      email,
      password: hashedPass,
    });

     const token = jwt.sign(
      {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      process.env.JWT_Secret,
      { expiresIn: "1d" },
    );

    return res
      .status(201)
      .json({
        message: "new user created!",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
        token,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "something went wrong ", error: error.message });
  }
};

//login register
const loginUser = async (req, res) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (username.trim() === "" || password.trim() === "") {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isUserExist = await User.findOne({ username });
    if (!isUserExist) {
      return res.status(404).json({ message: "user not found" });
    }
    const passcheck = await bcrypt.compare(password, isUserExist.password);
    if (!passcheck) {
      return res.status(400).json({ message: "incorrect password" });
    }
    const token = jwt.sign(
      {
        id: isUserExist._id,
        username: isUserExist.username,
        email: isUserExist.email,
      },
      process.env.JWT_Secret,
      { expiresIn: "1d" },
    );

    return res
      .status(200)
      .json({
        message: "slogged in successfully ",
        user: {
          id: isUserExist._id,
          username: isUserExist.username,
          email: isUserExist.email,
        },
        token,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "something went wrong ", error: error.message });
  }
};

export { registerUser, loginUser };
