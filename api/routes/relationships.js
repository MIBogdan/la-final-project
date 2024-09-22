import express from "express";
import { getRelationships, addRelationship, deleteRelationship, getFollowedUsers } from "../controllers/relationship.js";

const router = express.Router();


router.get("/", getRelationships)
router.post("/", addRelationship)
router.delete("/", deleteRelationship)
router.get("/followed-users", getFollowedUsers)



export default router;