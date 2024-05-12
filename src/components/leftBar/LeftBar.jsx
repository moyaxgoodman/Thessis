import "./leftBar.scss";
import Market from "../../assets/3.png";
import Inventory from "../../assets/6.png";
import Logout from "../../assets/12.png";
import Friend from "../../assets/friend.png";
import { AuthContext } from "../../context/authContext";
import { useContext, useEffect, useState } from "react"; // Import useState
import { isAdmin } from "../../utils/roles";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../axios";

const LeftBar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null); // State for user data

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await makeRequest.get(`users/find/${currentUser.id}`);
        setUser(response.data); // Set user data in state
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData(); // Call the async function
  }, [currentUser.id]); // Add dependency currentUser.id
  return (
    <div className="leftBar relative" style={{ cursor: 'pointer' }}>
      <div className="container">
        <div className="menu">
          {user && ( // Check if user exists before rendering user data
            <div className="user">
              <img
                src={user.profilePic} // Check if user exists
                alt=""
              />
              <span>{user.name}</span>
            </div>
          )}
          <div className="item">
            <img src={Friend} alt="" />
            <span onClick={() => navigate('/about-us')}>About Us</span>
          </div>
          
          {isAdmin(currentUser) && 
            <>
            <div className="item" style={{ ':hover': { backgroundColor: 'gray' } }}>
              <img src={Market} alt="" />
              <span onClick={() => navigate('/dashboard')}>Dashboard</span>
            </div>
          </>
          }
          {!isAdmin(currentUser) && 
          <>
          <div className="item" style={{ ':hover': { backgroundColor: 'gray' } }}>
              <img src={Market} alt="" />
              <span onClick={() => navigate(`/user-dashboard/${currentUser.id}`)}>User Dashboard</span>
            </div>
          </>
          }
          {isAdmin(currentUser) && 
          <>
          <div className="item" style={{ ':hover': { backgroundColor: 'gray' } }}>
              <img src={Inventory} alt="" />
              <span onClick={() => navigate(`/inventory`)}>Inventory</span>
            </div>
          </>
          }
          <div className="item">
            <img src={Logout} alt="" />
            <span onClick={logout}>Logout</span>
          </div>
        </div>
        <hr />
      </div>
      <div className="footer">
        <p>&copy; {new Date().getFullYear()} Pocket Donation Bank. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LeftBar;
