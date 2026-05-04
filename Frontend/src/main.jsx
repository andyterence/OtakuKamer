import './utils/axiosConfig'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import 'animate.css'
import App from './App.jsx'
import "preline/dist/preline.js"

createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </GoogleOAuthProvider>
)