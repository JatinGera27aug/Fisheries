import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredUserType }) => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    if (!token) {
        // No token means not authenticated
        return <Navigate to="/login" />;
    }

    if (requiredUserType) {
        // Check if user has the required user type
        if (userType !== requiredUserType) {
            // Redirect admin to dashboard if trying to access user routes
            if (userType === "admin") {
                return <Navigate to="/dashboard" />;
            }
            // Redirect users to profile if trying to access admin routes
            if (userType === "user") {
                return <Navigate to="/profile" />;
            }
            // If userType is neither, redirect to login
            return <Navigate to="/login" />;
        }
    }

    return children;
};

export default ProtectedRoute;