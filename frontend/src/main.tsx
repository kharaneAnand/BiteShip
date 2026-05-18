import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AppProvider } from './context/AppContext.tsx'
import 'leaflet/dist/leaflet.css';
import { SocketProvider } from './context/SocketContext.tsx'

export const authService = "https://biteship-auth.onrender.com";
export const restaurantService = "http://localhost:5001";
export const utilsService = "http://localhost:5002";
export const realtimeService = "http://localhost:5003";
export const riderService = "http://localhost:5004";
export const adminService = "http://localhost:5005";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='898610648717-j9f9r3mv9vru0im13q0teo4ahcrja6d9.apps.googleusercontent.com'>
      <AppProvider>
        <SocketProvider>
           <App />
        </SocketProvider>
      </AppProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
