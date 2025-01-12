import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Alert } from "react-bootstrap";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("user"); // Default to 'user'

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("")
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          userType, // Save the userType in Firestore
          // photo:""
        });
      }
      const token = await user.getIdToken();
      console.log("Setting token:", token);
      localStorage.setItem("token", token);
      console.log("User Registered Successfully!!");
      localStorage.setItem("userType", userType);
      if (userType === "admin") {
        console.log("Redirecting to dashboard...");
        window.location.href = "/dashboard";
      } else {
        console.log("Redirecting to profile...");
        window.location.href = "/profile";
      }
    } catch (error) {
      setError(error.message);
      console.log(error.message);
      toast.error(error.message, {
        position: "top-center",
      });
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h3>Sign Up</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="mb-3">
        <label>First name</label>
        <input
          type="text"
          className="form-control"
          placeholder="First name"
          onChange={(e) => setFname(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Last name</label>
        <input
          type="text"
          className="form-control"
          placeholder="Last name"
          onChange={(e) => setLname(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>User Type</label>
        <select
          className="form-control"
          onChange={(e) => setUserType(e.target.value)}
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>


      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </div>
      <p className="forgot-password text-right">
        Already registered <a href="/login">Login</a>
      </p>
    </form>
  );
}
export default Register;