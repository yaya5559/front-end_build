import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/style.css'
import { Link, useNavigate } from 'react-router-dom';
import Dashboard from "./Dashboard"


function Login(){
    
    const [form, setForm] = useState({email:'', password:''});
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    useEffect(()=>{
      const token = localStorage.getItem('token');
      if(token){
        navigate('/user');
      }
    }, [navigate]);


    const handleChange = (e) =>{
        setForm({...form, [e.target.name] : e.target.value});

    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setError("");

        try{
            const res = await axios.post('http://localhost:5000/api/auth/login', form)
            localStorage.setItem('token', res.data.token);
            setUser(res.data);

        }catch(err){
            
            setError("Invalid email or password. Please try again.");
        }

    }

    return user ? (
        <h1><Dashboard /></h1>
    ) : (

        <div className="login-page">
        <div className="login-container">
          <div className="login-box">
            <h2>Welcome Back</h2>
            <p>Sign in to continue</p>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
              {error && <p className="error-message">{error}</p>}
              <button type="submit">Login</button>
            </form>
            <div className="forgot-password">
              <Link to="#">Forgot password?</Link>
            </div>
            <div className="signup-link">
              Don't have an account? <Link to="/register">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
        
    );

}

export default Login;