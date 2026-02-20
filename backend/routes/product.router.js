import express from "express";
import { addProduct, deleteProduct, updateProduct, getProducts ,getSingleProduct} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/add", addProduct);
router.delete("/delete", deleteProduct);
router.put("/update", updateProduct);
router.get("/", getProducts);
router.get("/:id", getSingleProduct);

export default router;
