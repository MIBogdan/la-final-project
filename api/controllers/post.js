import {db} from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";


export const getPosts = (req, res) => {
    const userId = req.query.userId;
    const token = req.cookies.accessToken;

    
    if (userId === '0') {
        const q = `SELECT p.*, u.id AS userId, name, profilePic 
                   FROM posts AS p 
                   JOIN users AS u ON (u.id = p.userId) 
                   ORDER BY RAND() 
                   LIMIT 10`;

        db.query(q, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
        return;  
    }

    
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = userId !== "undefined"
            ? `SELECT p.id, p.desc, p.img, p.createdAt, u.id AS userId, u.name, u.profilePic 
               FROM posts AS p 
               JOIN users AS u ON u.id = p.userId 
               WHERE p.userId = ? 
               ORDER BY p.createdAt DESC`
            : `SELECT DISTINCT p.id, p.desc, p.img, p.createdAt, u.id AS userId, u.name, u.profilePic 
               FROM posts AS p 
               JOIN users AS u ON u.id = p.userId 
               LEFT JOIN relationships AS r ON p.userId = r.followedUserId 
               WHERE r.followerUserId = ? OR p.userId = ? 
               ORDER BY p.createdAt DESC`;

        const values = userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
};


export const addPost = (req, res) => {

    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json("Not logged in.")

    } else {
        jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?)";

        const values = [
            req.body.desc,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post has been created");
        });
        });
    }

    
}

export const deletePost = (req, res) => {

    const token = req.cookies.accessToken;
    
    if (!token) {
        return res.status(401).json("Not logged in.")

    } else {
        jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "DELETE FROM posts WHERE id=? AND userId=?";


        db.query(q, [req.params.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.affectedRows > 0) return res.status(200).json("Post has been deleted.");
            return res.status(403).json("You can delete only your post.")
            
        });
        });
    }

    
}

export const getLatestPosts = (req, res) => {
    const query = `
      SELECT p.desc, p.createdAt, u.username, u.profilePic
      FROM posts p
      JOIN users u ON p.userId = u.id
      ORDER BY p.createdAt DESC
      LIMIT 3;
    `;
  
    db.query(query, (err, data) => {
      if (err) return res.status(500).json({ message: "Error retrieving latest posts." });
      if (data.length === 0) {
        return res.status(200).json({ message: "No recent posts found." });
      } else {
        return res.status(200).json(data);
      }
    });
  };



    



