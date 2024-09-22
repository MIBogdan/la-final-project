import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import Admin from "./pages/admin/Admin"


import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Navbar from "./components/navBar/Navbar"
import "./style.scss";
import "sass-themify";
import { useContext, useState, useEffect } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'

function App() {
  const {darkMode} = useContext(DarkModeContext);
  const {currentUser} = useContext(AuthContext);
  const queryClient = new QueryClient()



  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <Navbar />
          <div style={{display: 'flex'}}>
            {currentUser.id === 0 ? null : <LeftBar />}
            <div style={{flex: 6}}>
              <Outlet />
            </div>
            {currentUser.id === 0 ? null : <RightBar />}
          </div>
        </div>
      </QueryClientProvider>
    );
  }

  const AdminRoute = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const [showMessage, setShowMessage] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!currentUser || currentUser.admin !== 1) {
        setShowMessage(true);
  

        const countdownInterval = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
  

        const timer = setTimeout(() => {
          if (currentUser && currentUser.id !== 0) {
            navigate(`/profile/${currentUser.id}`);
          } else {
            navigate("/login");
          }
        }, 5000);
  

        return () => {
          clearTimeout(timer);
          clearInterval(countdownInterval);
        };
      }
    }, [currentUser, navigate]);
  

    if (!currentUser || currentUser.admin !== 1) {
      if (showMessage) {
        return (
          <div className="redirect">
            <p>Access Denied. You are not an admin. Redirecting in {countdown} seconds...</p>
          </div>
        );
      }
      return null;
    }
  
    return children;
  };
  

  const ProfileRoute = ({ children }) => {
    if (currentUser?.id === 0) {
      return <Navigate to="/" />;
    }
    return children;
  };
  

  const ProtectedRoute = ({ children }) => {

    if (currentUser?.admin === 1) {
      return <Navigate to="/admin" />;
    }


    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "/", element: <Home /> },
        { path: "/profile/:id", element: <ProfileRoute><Profile /></ProfileRoute> },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/admin",
      element: (
        <AdminRoute>
          <Admin />
        </AdminRoute>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/login" />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router = {router} />
    </div>
  );
}

export default App;
