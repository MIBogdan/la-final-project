import express from "express";
import { getUser, searchUsers, updateUser, getSuggestions } from "../controllers/user.js";

const router = express.Router();


router.get("/find/:userId", getUser)
router.get("/search", searchUsers)
router.put("/", updateUser)
router.get("/suggestions", getSuggestions);





export default router;