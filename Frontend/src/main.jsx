import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import 'animate.css';
import App from './App.jsx'
import "preline/dist/preline.js"

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter> 
            <App />
        </BrowserRouter>
    </StrictMode>
)