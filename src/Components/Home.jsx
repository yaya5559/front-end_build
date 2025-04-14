import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/style.css'
import Navbar from './Navbar';


function Home() {
    const navigate = useNavigate();
    localStorage.clear();



    return(
    <div className="bgimage">
        <Navbar />
      <div className="bgimage">
      <div className="overlay"></div>
      
      <div className="text">
        <h4>Recycling in Guatemala</h4>
        <h1>Innovative & Efficient</h1>
        <h3>Building the world's most effective recycling system</h3>
        <div className="button-group">
          <button onClick={() => navigate("/register")} className="btn primary">
            Register
          </button>
          <button onClick={() => navigate("/login")} className="btn secondary">
            Login
          </button>
        </div>
      </div>
    </div>
    </div>
    );
}

export default Home;