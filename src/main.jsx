import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'; 
import './firebaseConfig.js'
import App from './App.jsx'
import { AuthProvider } from "./utils/AuthContext.jsx"; 
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.bundle.js"
// import {BrowserRouter} from "react-router-dom"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
  </StrictMode>,
)
