import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import app from "../firebaseConfig";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const auth = getAuth(app);

  useEffect(() => {
    // Check if there's a token in localStorage on component mount
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then((token) => {
          console.log("Setting token:", token);
          setToken(token);
          localStorage.setItem("token", token);
          navigate('/dashboard');
        });
      } else {
        console.log("User not authenticated, clearing token.");
        setToken(null);
        localStorage.removeItem("token");
      }
    });
  
    return () => unsubscribe();
  }, [auth, setToken, navigate]);
  
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("User logged in:", result.user);
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out.");
        setToken(null);
        localStorage.removeItem("token");
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <div>
      <div>
        <button onClick={loginWithGoogle}>Login with Google</button>
      </div>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Login;
