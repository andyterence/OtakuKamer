// Ce composant est utilisé pour protéger les routes qui nécessitent une authentification. Il vérifie si un token d'accès est présent dans le localStorage. Si le token existe, il rend les enfants du composant (c'est-à-dire la route protégée). Sinon, il redirige l'utilisateur vers la page de connexion.
// Importer le composant Navigate de react-router-dom pour permettre la redirection vers la page de connexion si l'utilisateur n'est pas authentifié
import { Navigate } from 'react-router-dom' 
// Définir le composant PrivateRoute qui prend des enfants en tant que référence aux éléments à rendre si l'utilisateur est authentifié
export default function PrivateRoute({ children }) {
    const token = localStorage.getItem('access')
    return token ? children : <Navigate to="/login" />
}