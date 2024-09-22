import { db } from "../connect.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";


const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{0,14}$/;
    return usernameRegex.test(username);
  };
  
  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z][a-zA-Z\s]{0,19}$/;
    return nameRegex.test(name);
  };
  
  export const register = (req, res) => {
    console.log("Received data:", req.body);
  
    const { username, email, password, name } = req.body;
  

    if (!validateUsername(username)) {
      return res.status(400).json("Username must be less than 15 characters, contain no spaces, can't start with numbers.");
    }
  

    if (!validateEmail(email)) {
      return res.status(400).json("Please enter a valid email address.");
    }
  

    if (password.length < 6) {
      return res.status(400).json("Password must be at least 6 characters long.");
    }
  

    if (!validateName(name)) {
      return res.status(400).json("Name must be less than 20 characters. Can't begin with numbers.");
    }
  

    const q = "SELECT * FROM users WHERE username = ?";
    db.query(q, [username], (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json(err);
      }
      if (data.length) {
        console.log("User already exists");
        return res.status(409).json("User already exists!");
      }
  

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
  
      const q = "INSERT INTO users(`username`, `email`, `password`, `name`) VALUES (?)";
      const values = [username, email, hashedPassword, name];
  
      db.query(q, [values], (err, data) => {
        if (err) {
          console.error("Database error on insert:", err);
          return res.status(500).json(err);
        }
        return res.status(200).json("User has been created.");
      });
    });
  };


export const login = (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?";
    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("User not found.");
        
        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);

        if (!checkPassword) return res.status(400).json("Wrong password or username.");

        const token = jwt.sign({id: data[0].id}, "secretkey");

        const {password, ...others} = data[0];

        res.cookie("accessToken", token, {
            httpOnly: true,
        }).status(200).json(others);
    })
}

export const logout = (req, res) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none"
    }).status(200).json("User has been logged out.")
}