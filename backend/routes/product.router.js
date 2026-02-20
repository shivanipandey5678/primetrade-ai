import express from "express";
import { addProduct, deleteProduct, updateProduct, getProducts } from "../controllers/product.controller.js";

const router = express.Router();

router.post("/add", addProduct);
router.delete("/delete", deleteProduct);
router.put("/update", updateProduct);
router.get("/", getProducts);

export default router;
