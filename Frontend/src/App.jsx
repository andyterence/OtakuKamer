import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// Importer les composants nécessaires pour la navigation et les pages de l'application
import PrivateRoute from './components/PrivateRoute' 
import Login from './pages/Login'
import Register from './pages/register'
import Accueil from './pages/accueil'
import EvenementShow from './pages/evenementShow'
import Billets from './pages/billets'
import CreateEven from './pages/createEven'
import MyEvenement from './pages/myEvenement'
import Calendrier from './pages/calendrier'
import About from './pages/about'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/accueil" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/billets" element={<PrivateRoute><Billets /></PrivateRoute>} />
        <Route path="/evenement/:id" element={<EvenementShow />} />
        <Route path="/createEven/" element={<PrivateRoute><CreateEven /></PrivateRoute>} />
        <Route path="/myEvenement/" element={<PrivateRoute><MyEvenement /></PrivateRoute>} />
        <Route path="/calendrier/" element={<PrivateRoute><Calendrier /></PrivateRoute>} />
        <Route path="/about/" element={<PrivateRoute><About /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App