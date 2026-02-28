import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Importer les composants nécessaires pour la navigation et les pages de l'application
import PrivateRoute from './components/PrivateRoute' 
import Login from './pages/Login'
import Register from './pages/register'
import Hero from './components/accueil/hero'
import Accueil from './pages/accueil'
import ListeEvenements from './components/accueil/ListeEvenements'
import ListeNews from './components/accueil/ListeNews'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
            <h1>Page Accueil</h1>
          </PrivateRoute>
          } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/hero" element={<Hero />} />
        <Route path="/ListeEvenements" element={<ListeEvenements   />} />
        <Route path="/ListeNews" element={<ListeNews   />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App