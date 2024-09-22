import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import { useState } from "react";
import axios from "axios";

function Register () {

  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  })

  const navigate = useNavigate();

  const [err, setErr] = useState(null);


  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    })
    )
  }

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
      navigate("/login", { state: { message: "Account created successfully, you may login." } });
    } catch (err) {
      setErr(err.response.data);
    }

  }

  console.log(err)



  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>MB Forum</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro, itaque? Voluptates quas quaerat velit repellendus, quo pariatur unde ipsam asperiores vel nulla distinctio reprehenderit. Fugit quo facere consequuntur vero magnam.</p>
          <span>Already got an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>


        <div className="right">
          <h1>Register</h1>
          <form>
            <input type="text" placeholder="Username" name="username" onChange={handleChange} />
            <input type="email" placeholder="Email" name="email" onChange={handleChange}/>
            <input type="password" placeholder="Password" name="password" onChange={handleChange}/>
            <input type="text" placeholder="Name" name="name" onChange={handleChange}/>
            {err && <p style={{color: "red"}}>{err}</p>}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>



      </div>
    </div>
  )
}

export default Register;
