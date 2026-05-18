import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AppProvider } from './context/AppContext.tsx'
import 'leaflet/dist/leaflet.css';
import { SocketProvider } from './context/SocketContext.tsx'

export const authService = "https://biteship-auth-xa00.onrender.com";
export const restaurantService = "https://biteship-restaurant.onrender.com";
export const utilsService = "https://biteship-utils.onrender.com";
export const realtimeService = "https://biteship-realtime.onrender.com";
export const riderService = "https://biteship-rider.onrender.com";
export const adminService = "https://biteship-admin.onrender.com";

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
