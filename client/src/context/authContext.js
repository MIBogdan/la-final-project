import {createContext, useEffect, useState} from "react";
import guest from "../assets/guest.png";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const guestUserInfo = {
        id: 0,
        name: "Guest",
        profilePic: guest,
        admin: 0,
    };


    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : guestUserInfo;
        } catch (err) {
            console.error("Error parsing user data from localStorage:", err);
            return guestUserInfo;
        }
      });
    
      useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
      }, [currentUser]);

      const login = async (inputs) => {
        try {
          const res = await axios.post(
            "http://localhost:8800/api/auth/login",
            inputs,
            { withCredentials: true }
          );
      
          const user = res.data;
      
          setCurrentUser(user);
      
          
          localStorage.setItem("user", JSON.stringify(user));
      
          
          if (user.admin === 1) {
            window.location.href = "/admin";
          } else {
            window.location.href = "/";
          }
      
        } catch (err) {
          console.error("Login failed:", err);
          throw err;
        }
      };
      



    return (
        <AuthContext.Provider value={{ currentUser, guestUserInfo, login }}>
            {children}
        </AuthContext.Provider>
    );
};


