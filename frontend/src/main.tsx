import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';


export const authService = "http://localhost:5000" ;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="898610648717-j9f9r3mv9vru0im13q0teo4ahcrja6d9.apps.googleusercontent.com">
     <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
