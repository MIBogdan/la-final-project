import express from "express";
import { getPosts, addPost, deletePost, getLatestPosts } from "../controllers/post.js";

const router = express.Router();


router.get("/", getPosts);
router.post("/", addPost);
router.delete("/:id", deletePost);
router.get("/latest-posts", getLatestPosts);



export default router;