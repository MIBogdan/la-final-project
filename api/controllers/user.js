import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {

    const userId = req.params.userId;
    const q = "SELECT * FROM users WHERE id=?"

    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json(err);
        const {password, ...info} = data[0];
        return res.json(info);
        
    })

}

export const updateUser = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not authenticated.");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid.");
  
      const q =
        "UPDATE users SET name = ?, city = ?, website = ?, profilePic = ?, coverPic = ? WHERE id = ?";
  
      db.query(
        q,
        [
          req.body.name,
          req.body.city,
          req.body.website,
          req.body.profilePic,
          req.body.coverPic,
          userInfo.id, 
        ],
        (err, data) => {
          if (err) return res.status(500).json(err);
          if (data.affectedRows > 0) return res.json("Updated.");
          return res.status(403).json("You can update only your own profile.");
        }
      );
    });
  };
  
export const searchUsers = (req, res) => {
  
  const searchQuery = req.query.q;
  

  const q = "SELECT id, username, profilePic FROM users WHERE username LIKE ?";

  db.query(q, [`%${searchQuery}%`], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getSuggestions = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(403).json({ message: 'No token, authorization denied' });
  }

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token is not valid' });
    }
    
    const userId = decoded.id;
    

    const query = `
      SELECT u.id, u.username, u.profilePic 
      FROM users u
      WHERE u.id != ?
      AND u.id NOT IN (SELECT followedUserId FROM relationships WHERE followerUserId = ?)
      LIMIT 3
    `;

    db.query(query, [userId, userId], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length > 0) {
        res.json(data);
      } else {
        res.status(200).json({ message: 'No suggestions at this time' });
      }
    });
  });
};

