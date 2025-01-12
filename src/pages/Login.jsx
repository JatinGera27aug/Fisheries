import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import {  onAuthStateChanged } from "firebase/auth";
import { useAuth } from "../utils/AuthContext";
import app from "../firebaseConfig";
import {db} from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Alert } from "react-bootstrap";

// import { auth } from "../firebaseConfig";
import { toast } from "react-toastify";
// import SignInwithGoogle from "./signInWIthGoogle";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setToken } = useAuth();
  const auth = getAuth(app);
//   const navigate = useNavigate();

useEffect(() => {
    console.log("Login useEffect started");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log("Auth state changed:", user ? "User exists" : "No user");
        if (user) {
            try {
                // Step 1: Get and store token
                const token = await user.getIdToken();
                console.log("Token obtained successfully");
                setToken(token);
                localStorage.setItem("token", token);
                console.log("Token stored in localStorage");

                // Step 2: Get user data
                const userDocRef = doc(db, "Users", user.uid);
                console.log("Fetching user document for UID:", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    console.log("Fetched user data:", userData);

                    if (userData.userType) {
                        console.log("UserType found:", userData.userType);
                        localStorage.setItem("userType", userData.userType);
                        console.log("UserType stored in localStorage");

                        // Delay the redirect slightly to ensure localStorage is set
                        setTimeout(() => {
                            if (userData.userType === "admin") {
                                console.log("Initiating admin redirect...");
                                window.location.replace("/dashboard");
                            } else {
                                console.log("Initiating user redirect...");
                                window.location.replace("/profile");
                            }
                        }, 100);
                    } else {
                        console.error("UserType missing in userData");
                    }
                } else {
                    console.error("User document doesn't exist in Firestore");
                }
            } catch (error) {
                console.error("Login process error:", error);
            }
        } else {
            console.log("Clearing local storage - no user");
            localStorage.removeItem("token");
            localStorage.removeItem("userType");
        }
    });

    return () => {
        console.log("Cleanup: unsubscribing from auth listener");
        unsubscribe();
    };
}, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("")
  try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in Successfully");
      
      // Get the current user
      const user = auth.currentUser;
      if (user) {
          // Get user data from Firestore
          const userDocRef = doc(db, "Users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
              const userData = userDoc.data();
              if (userData.userType) {
                  localStorage.setItem("userType", userData.userType);
                  
                  // Show success message
                  toast.success("User logged in Successfully", {
                      position: "top-center",
                  });

                  // Redirect based on user type
                  if (userData.userType === "admin") {
                      console.log("Redirecting to dashboard...");
                      window.location.replace("/dashboard");
                  } else {
                      console.log("Redirecting to profile...");
                      window.location.replace("/profile");
                  }
              } else {
                console.log("Redirecting to profile...");
                window.location.replace("/profile");
                  toast.error("User type not found", {
                      position: "bottom-center",
                  });
              }
          } else {
              console.error("User document not found");
              toast.error("User data not found", {
                  position: "bottom-center",
              });
          }
      }
  } catch (error) {
    setError(error.message);
      console.log(error.message);
      toast.error(error.message, {
          position: "bottom-center",
      });
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <h3>Login</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="mb-3">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
      <p className="forgot-password text-right">
        New user <a href="/">Register Here</a>
      </p>
      {/* <SignInwithGoogle/> */}
    </form>
  );
}

export default Login;