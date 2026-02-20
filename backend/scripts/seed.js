import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../models/Users.js";
import { Product } from "../models/Product.js";

dotenv.config();

const products = [
  {
    title: "Wireless Bluetooth Earbuds",
    price: 49.99,
    description: "Compact true wireless earbuds with active noise cancellation and up to 28 hours of total battery life.",
    image: "https://picsum.photos/seed/earbuds01/200",
  },
  {
    title: "4K Smart LED TV 55-inch",
    price: 429.0,
    description: "55-inch 4K Ultra HD Smart TV with HDR support and built-in streaming apps for an immersive viewing experience.",
    image: "https://picsum.photos/seed/tv55/200",
  },
  {
    title: "Men's Slim Fit Denim Jeans",
    price: 39.99,
    description: "Classic slim-fit stretch denim jeans with comfortable mid-rise waist and durable stitching.",
    image: "https://picsum.photos/seed/jeansblue/200",
  },
  {
    title: "Stainless Steel Insulated Tumbler",
    price: 22.5,
    description: "20 oz double-wall vacuum insulated tumbler that keeps drinks hot for 6 hours or cold for 24 hours.",
    image: "https://picsum.photos/seed/tumbler20oz/200",
  },
  {
    title: "Wireless Charging Pad",
    price: 19.99,
    description: "Fast wireless charger compatible with iPhone, Samsung Galaxy and other Qi-enabled devices.",
    image: "https://picsum.photos/seed/chargepad/200",
  },
  {
    title: "Ceramic Non-Stick Cookware Set",
    price: 89.99,
    description: "10-piece ceramic coated cookware set including frying pans, saucepans and stockpot – PFOA free.",
    image: "https://picsum.photos/seed/cookset/200",
  },
  {
    title: "Unisex Polarized Sunglasses",
    price: 34.95,
    description: "Stylish polarized UV400 sunglasses with lightweight frames perfect for driving and outdoor activities.",
    image: "https://picsum.photos/seed/sunglassesblk/200",
  },
  {
    title: "Orthopedic Memory Foam Pillow",
    price: 45.0,
    description: "Contour memory foam pillow designed for neck support and better spinal alignment during sleep.",
    image: "https://picsum.photos/seed/memorypillow/200",
  },
  {
    title: "Portable Bluetooth Speaker",
    price: 59.99,
    description: "Waterproof portable speaker with 360° sound, 12-hour playtime and built-in microphone for calls.",
    image: "https://picsum.photos/seed/speakerportable/200",
  },
  {
    title: "Leather Crossbody Bag",
    price: 67.5,
    description: "Genuine leather compact crossbody bag with multiple compartments and adjustable strap.",
    image: "https://picsum.photos/seed/crossbodybag/200",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("mongoDB connected 💪!");

    const saltRounds = Number(process.env.SALT) || 10;
    const hashed1 = await bcrypt.hash("userone123", saltRounds);
    const hashed2 = await bcrypt.hash("usertwo123", saltRounds);

    await User.deleteMany({});
    await User.create([
      { name: "User One", email: "user1@example.com", password: hashed1 },
      { name: "User Two", email: "user2@example.com", password: hashed2 },
    ]);
    console.log("2 users created");

    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("10 products created");

    await mongoose.disconnect();
    console.log("Seed done. Disconnected.");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
