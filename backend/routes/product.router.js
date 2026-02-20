import express from "express";
import { addProduct, deleteProduct, updateProduct, getProducts, getSingleProduct, addFavoriteProduct, removeFavoriteProduct } from "../controllers/product.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Public routes (no auth)
router.get("/", getProducts);
router.get("/:id", getSingleProduct);

// Protected routes (auth required)
router.post("/add", authMiddleware, addProduct);
router.delete("/delete", authMiddleware, deleteProduct);
router.put("/update", authMiddleware, updateProduct);
router.post("/:id/favorite", authMiddleware, addFavoriteProduct);
router.delete("/:id/favorite", authMiddleware, removeFavoriteProduct);

export default router;
