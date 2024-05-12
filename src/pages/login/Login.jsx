import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";
import logo from '../../../src/assets/logo-1.png'
const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false); // State to track form submission

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear the validation error when user starts typing in the input field
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    // Set formSubmitted to true to trigger validation
    setFormSubmitted(true);
    try {
      if (inputs.username.trim() === "" && inputs.password.trim() === "") {
        setErrors((prev) => ({
          ...prev,
          username: "Please enter your username.",
          password: "Please enter your password."
        }));
        return;
      }else if (inputs.username.trim() === "") {
        setErrors((prev) => ({
          ...prev,
          username: "Please enter your username.",
        }));
        return;
      }else if (inputs.password.trim() === "") {
        setErrors((prev) => ({
          ...prev,
          password: "Please enter your password.",
        }));
        return;
      }
      else {
        setErrors((prev) => ({ ...prev, username: "", password: "" })); // Reset both username and password errors
      }
      await login(inputs);
      navigate("/");
    } catch (err) {
      setErr(err.response.data);
    }
  };

  return (
    <div className="login ">
      <div className="card">
        <div className="left">
          <h1>Welcome to Pocket Donation Bank</h1>
          <p>
            "It's not how much we give, but how much love we put into giving" <br />
            -Mother Teresa
          </p>
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        
      
        <div className="right">
        <h1>Login</h1>
        <div className="d-flex justify-content-center align-items-center">
        <img src={logo} alt="" width={300} height={300} />       
        </div>
        
        <div className="form-right">
       
          <form onSubmit={handleLogin}> {/* Use onSubmit to handle form submission */}
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={inputs.username}
              onChange={handleChange}
            />
            {formSubmitted && errors.username && <p className="text-danger">{errors.username}</p>}
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
            />
            {formSubmitted && errors.password && <p className="text-danger">{errors.password}</p>}
            {err && <p className="text-danger">{err}</p>} {/* Display error message */}
            <button type="submit">Login</button> {/* Use type="submit" for login button */}
          </form>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
