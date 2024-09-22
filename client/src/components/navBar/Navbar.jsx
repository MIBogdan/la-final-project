import "./nav-bar.scss";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link, useNavigate } from "react-router-dom"
import { DarkModeContext } from "../../context/darkModeContext";
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import { useMutation, useQuery } from "@tanstack/react-query";




function Navbar () {

  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, guestUserInfo } = useContext(AuthContext);
  const [menu, setMenuOpen] = useState(false)
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const submenuRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
  
    
    document.addEventListener('mousedown', handleClickOutside);
  
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]);
  
  useEffect(() => {
    const handleClickOutsideProfile = (event) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
  
    
    document.addEventListener('mousedown', handleClickOutsideProfile);
  
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideProfile);
    };
  }, [submenuRef]);

  

  const { isLoading, error, data: searchResult } = useQuery({
    queryKey: ['user', searchInput],
    queryFn: () =>
      makeRequest.get(`/users/search?q=${searchInput}`).then((res) => res.data),
    
      enabled: !!searchInput,
    
  });


  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setIsSearchOpen(true);
  };




  useEffect(() => {
    if (searchResult) {
      setSearchResults(searchResult);
    }
  }, [searchResult]);

  
  const handleClick = () => {
    setMenuOpen(!menu)
    
  }



  const navigate = useNavigate();

  
  const mutation = useMutation({
    mutationFn: () => {
      return makeRequest.post("/auth/logout");
    },
    onSuccess: () => {
      
      navigate("/login");
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const handleLogout = () => {
    mutation.mutate();
    localStorage.removeItem('user');
  };
  
  return (
    <div className="navbar">
      <div className="left">
        
        <Link to="/">
          <span>MB</span>
        </Link>

        
          
          { darkMode ? <WbSunnyOutlinedIcon onClick={toggle} className="theme"/> : <DarkModeOutlinedIcon onClick={toggle} className="theme"/>}
          <Link to="/">
          <HomeOutlinedIcon />
          </Link>
          
          {currentUser.id !== 0 && (
            <div className="search">
              <SearchOutlinedIcon />
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={handleSearchChange}
              />
              {isLoading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>Error fetching results</p>
              ) : searchResults.length > 0 ? (
                <div ref={searchRef}>
                  {isSearchOpen && (
                    <div className="search-results">
                      <ul>
                        {searchResults.map((user) => (
                          <Link
                          to={`/profile/${user.id}`}
                            onClick={() => {
                            setIsSearchOpen(false);
                            navigate(`/profile/${user.id}`, {replace: true});
                            window.location.href = `/profile/${user.id}`;
                          }}
                          key={user.id}
                          >
                            <li >
                                <img src={`/upload/` + user.profilePic} alt="" />
                                {user.username}
                            </li>
                          </Link>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
      </div>
                
                
                
                

      <div className="right">
        

        {currentUser.id === 0 && (
          
            <div className="guest-login-register">
              <Link to="/login">
                <button>Login</button>
              </Link>
              
              <span>or</span>

              <Link to="/register">
                <button>Register</button>
              </Link>
              
            </div>
          
          
        )}
        <div className="logout" style={{cursor: currentUser.id === 0 ? "default" : "pointer"}}>
          <div className="user" onClick={handleClick}>
            <img src={currentUser.id === 0
                ? guestUserInfo.profilePic
                : currentUser.profilePic !== null
                ? "/upload/" + currentUser.profilePic
                : require("../../assets/guest.png")} alt="Profile" style={{filter: currentUser.id === 0 && darkMode ? 'invert(100%)' : 'none', width: currentUser.id === 0 && "25px", height: currentUser.id === 0 && "25px"}}/>
            <span>{currentUser.id === 0 ? guestUserInfo.name : currentUser.name}</span>
          </div>
              {currentUser.id !== 0 ? 
              (<div className={`submenuLogout ${menu ? 'active' : ''}`} ref={submenuRef}>
              <div className="items">
                <Link to={`/profile/${currentUser.id}`} style={{textDecoration: "none", color: "inherit"}} onClick={() => setMenuOpen(false)}><span>Profile</span></Link>
                
                <span onClick={handleLogout}>Logout</span>
              </div>
              
            </div>)
            : undefined
          }
          
        </div>
        
      </div>
    </div>
  )
}

export default Navbar;