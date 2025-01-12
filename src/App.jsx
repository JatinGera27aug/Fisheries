import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import ProtectedRoute from './services/ProtectedRoute.jsx';
import { AuthProvider } from "./utils/AuthContext.jsx";
import WaterQualityDashboard from './components/WaterQuality.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import AddWaterQualityPage from './pages/AddWaterQualityPage';
import DiseaseOutbreakDashboard from './components/DiseaseOutbreak.jsx';
import AddDiseaseOutbreakForm from './components/AddDiseaseOutbreak.jsx';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Register />} />
          <Route path="/water-quality" element={<ErrorBoundary><WaterQualityDashboard /> </ErrorBoundary>} />
          <Route 
                    path="/add-water-quality" 
                    element={
                       
                            <AddWaterQualityPage />
                        
                    } 
                />

                 {/* Disease Outbreak Routes */}
                 <Route 
                    path="/disease-outbreak" 
                    element={
                       
                            <DiseaseOutbreakDashboard />
                        
                    } 
                />
                <Route 
                    path="/add-disease-outbreak" 
                    element={
                        
                            <AddDiseaseOutbreakForm />
                        
                    } 
                />

          {/* Protected routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute requiredUserType="user">
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requiredUserType="admin">
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;