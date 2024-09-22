import express from "express";
import { getAllUsers, updateUser, deleteUser } from "../controllers/admin.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
