import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { auth } from "../firebaseConfig";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  const dashboardItems = [
    {
      title: "Water Quality",
      description: "Monitor and manage water quality metrics",
      route: "/water-quality"
    },
    {
      title: "Disease Outbreak",
      description: "Track and manage disease outbreaks",
      route: "/disease-outbreak"
    },
    {
      title: "Performance Metrics",
      description: "View system and operational performance",
      route: "/performance-metrics"
    },
    {
      title: "User Profile",
      description: "Manage admin profile settings",
      route: "/profile"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome to the Fisheries Management System
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardItems.map((item, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2"
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {item.description}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(item.route)}
                >
                  Go to {item.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button 
            variant="destructive" 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;