import express from "express";
import { addTask, deleteTask, updateTask, getTasks } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/add", addTask);
router.delete("/delete", deleteTask);
router.put("/update", updateTask);
router.get("/", getTasks);

export default router;
