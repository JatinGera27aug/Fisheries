import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "./utils/AuthContext.jsx";
import ProtectedRoute from './services/ProtectedRoute.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

// Import all pages and components
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import WaterQualityDashboard from './components/WaterQuality.jsx';
import AddWaterQualityPage from './pages/AddWaterQualityPage';
import DiseaseOutbreakDashboard from './components/DiseaseOutbreak.jsx';
import AddDiseaseOutbreakForm from './components/AddDiseaseOutbreak.jsx';
import PerformanceMetrics from './pages/PerformanceMetrics.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Register />} />

          {/* Admin Protected Water Quality Routes */}
          <Route 
            path="/water-quality" 
            element={
              <ProtectedRoute requiredUserType="water_quality">
                <ErrorBoundary>
                  <WaterQualityDashboard />
                </ErrorBoundary>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-water-quality" 
            element={
              <ProtectedRoute requiredUserType="add_water_quality">
                <AddWaterQualityPage />
              </ProtectedRoute>
            } 
          />

          {/* Admin Protected Disease Outbreak Routes */}
          <Route 
            path="/disease-outbreak" 
            element={
              <ProtectedRoute requiredUserType="disease_outbreak">
                <ErrorBoundary>
                  <DiseaseOutbreakDashboard />
                </ErrorBoundary>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-disease-outbreak" 
            element={
              <ProtectedRoute requiredUserType="add_disease_outbreak">
                <AddDiseaseOutbreakForm />
              </ProtectedRoute>
            } 
          />

          {/* Admin Protected Performance Metrics Route */}
          <Route 
            path="/performance-metrics" 
            element={
              <ProtectedRoute requiredUserType="performance_metrics">
                <PerformanceMetrics />
              </ProtectedRoute>
            } 
          />

          {/* User Protected Profile Route */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute requiredUserType="profile">
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Protected Dashboard Route */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requiredUserType="dashboard">
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;