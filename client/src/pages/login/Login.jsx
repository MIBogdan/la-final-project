import { Link, useNavigate, useLocation } from "react-router-dom";
import "./login.scss";
import { AuthContext } from "../../context/authContext";
import { useContext, useState, useEffect } from "react";


function Login() {

  const {login, currentUser} = useContext(AuthContext);

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  })
  const location = useLocation();
  const [message, setMessage] = useState(null);

  
  const [err, setErr] = useState(null);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    })
    )
  }

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      await login(inputs); // Login and redirection are handled inside authContext
    } catch (err) {
      setErr(err.response?.data || "Login failed. Please try again.");
    }
  };
  


  


  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);


      const timer = setTimeout(() => {
        setMessage(null);
        

        navigate("/login", { replace: true, state: {} });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [location, navigate]);


  return (
    <div className="login">
      
      {message ? <h2>{message}</h2> : null}
      <div className="card">
        <div className="left">
          <h1>MB Forum</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro, itaque? Voluptates quas quaerat velit repellendus, quo pariatur unde ipsam asperiores vel nulla distinctio reprehenderit. Fugit quo facere consequuntur vero magnam.</p>
          <span>Need an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
          
        </div>


        <div className="right">
          <h1>Login</h1>
          <form>
            <input type="text" placeholder="Username" name="username" onChange={handleChange}/>
            <input type="password" placeholder="Password" name="password" onChange={handleChange}/>
            {err && err}
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>



      </div>
    </div>
  )
}

export default Login;
