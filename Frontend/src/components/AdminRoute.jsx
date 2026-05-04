import { Navigate } from 'react-router-dom'

export default function AdminRoute({ children }) {
    const token = localStorage.getItem('access')
    
    if (!token) return <Navigate to="/login" />
    
    try {
        // Décode le payload JWT sans librairie externe
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.role !== 'admin') return <Navigate to="/accueil" />
        return children
    } catch {
        return <Navigate to="/login" />
    }
}