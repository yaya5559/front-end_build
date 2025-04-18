import axios from "axios";
import { useEffect, useState } from "react"
import ProfileCard from "./ProfileCard";



const Dashboard = () =>{



    const [user, setUser] = useState("");

    const refreshUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
    
        const response = await axios.get('https://backend-build.onrender.com/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
    
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error("Error refreshing user:", error);
      }
    };
    
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) return;
            

            
            const response = await axios.get('https://backend-build.onrender.com/api/user', {
              //const response = await axios.get('http://localhost:5000/api/user', {
              headers: {
                Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json' 
              }
            });
            
            // Update both local and global state
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          } catch (error) {
            console.error("Fetch error:", error);
          }
        };
        
        fetchUserData();
      }, []); // Empty dependency array = runs once on mount
    
    return(
        <div className="dashboard">
            {user ? (
                <>
                    <ProfileCard user={user} refreshUser={refreshUser}/>
                </>
            ):(
                <p>Loading.......</p>
            )}
        </div>
        

    )
}

export default Dashboard;