import { useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import { auth } from "../firebaseConfig";
const Dashboard = () => {
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      console.log("Token available in Dashboard:", token);
    } else {
      console.error("No Token Found");
    }
  }, [token]);


  async function handleLogout() {
      try {
        await auth.signOut();
        window.location.href = "/login";
        console.log("User logged out successfully!");
      } catch (error) {
        console.error("Error logging out:", error.message);
      }
    }


  return (
    <div>
      <h1>Dashboard</h1>
      {token ? <p>Token: {token}</p> : <p>No Token Found</p>}

      <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
    </div>
  );
};

export default Dashboard;
