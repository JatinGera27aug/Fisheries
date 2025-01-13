import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, requiredUserType }) => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    if (!token) {
        // No token means not authenticated
        toast.error("Please login to access this page");
        return <Navigate to="/login" />;
    }

    // Define route access permissions
    const routePermissions = {
        'water_quality': ['admin'],
        'add_water_quality': ['admin'],
        'disease_outbreak': ['admin'],
        'add_disease_outbreak': ['admin'],
        'performance_metrics': ['admin'],
        'profile': ['user'],
        'dashboard': ['admin']
    };

    // Get the route name from the required user type
    const routeName = requiredUserType.toLowerCase();

    // Check if the user has permission to access the route
    if (routePermissions[routeName] && !routePermissions[routeName].includes(userType)) {
        // Unauthorized access, redirect based on user type
        toast.error("You are not authorized to access this page");
        
        switch(userType) {
            case 'admin':
                return <Navigate to="/dashboard" />;
            case 'user':
                return <Navigate to="/profile" />;
            default:
                return <Navigate to="/login" />;
        }
    }

    return children;
};

export default ProtectedRoute;