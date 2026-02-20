import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { init } from "./config/init.js";
import productRoutes from "./routes/product.router.js";
import userRoutes from "./routes/user.router.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json("healthy....");
});

// api versioning
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/products", productRoutes);

init().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`server is at ${process.env.PORT}`);
  });
});