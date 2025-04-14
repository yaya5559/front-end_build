import React, { useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/style.css'

function Register() {
    const [form, setForm] = useState({username:'', email: '', password:''});
    const [error, setError] = useState(''); // State for error messages


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(''); 
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 

        try{
            await axios.post('https://backend-build.onrender.com/api/auth/register', form);
            //await axios.post('http://localhost:5000/api/auth/register', form);
            
            alert('User registered successfully!');
        }catch(err){
            if(err.response && err.response.status===400){
                setError(err.response.data.error);
            }else{
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };
    
    return (
        <div className="auth-container">
        <div className="form-box">
            <header>Register</header>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    required
                />
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
                <button type="submit">Register</button>
                {error && <p className="error-message">{error}</p>}
            </form>
            <div className="signup">
                <span>
                    Already have an account? <Link to="/login">Login</Link>
                </span>
            </div>
        </div>
    </div>
            
    )

}

export default Register
