import { User } from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//user register
const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (
      name.trim() === "" ||
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

    const hashedPass = await bcrypt.hash(password, Number(process.env.SALT));
   
    const newUser = await User.create({
      name,
      email,
      password: hashedPass,
    });

     const token = jwt.sign(
      {
        id: newUser._id,
        name: newUser.name,
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
          name: newUser.name,
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

//login
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (email.trim() === "" || password.trim() === "") {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isUserExist = await User.findOne({ email });
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
        name: isUserExist.name,
        email: isUserExist.email,
      },
      process.env.JWT_Secret,
      { expiresIn: "1d" },
    );

    return res
      .status(200)
      .json({
        message: "logged in successfully ",
        user: {
          id: isUserExist._id,
          name: isUserExist.name,
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
