import {db} from "../connect.js";

// Get all users
export const getAllUsers = (req, res) => {
    const q = "SELECT id, username, email, name, city, website FROM users";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

// Update user
export const updateUser = (req, res) => {
    const { id } = req.params;
    const { username, email, name, city, website } = req.body;

    const q = "UPDATE users SET username = ?, email = ?, name = ?, city = ?, website = ? WHERE id = ?";
    db.query(q, [username, email, name, city, website, id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User updated successfully.");
    });
};

// Delete user
export const deleteUser = (req, res) => {
    const { id } = req.params;
    const q = "DELETE FROM users WHERE id = ?";
    db.query(q, [id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User deleted successfully.");
    });
};
