import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react';
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
import ModifierEvenement from './pages/modifierEvenement'
import Setting from './pages/setting';
import ConditionUser from './pages/conditionUser';
import PrivatyPolicy from './pages/privatyPolicy'
import CursorTrail from "./components/shared/CursorTrail"
import Scanner from './pages/scanner';

function App() {
  const location = useLocation();

  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [location.pathname]);

  return (
    <>
      <CursorTrail />
      <Routes>
        <Route path="/" element={<Navigate to="/accueil" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/billets" element={<PrivateRoute><Billets /></PrivateRoute>} />
        <Route path="/evenement/:id" element={<EvenementShow />} />
        <Route path="/createEven/" element={<PrivateRoute><CreateEven /></PrivateRoute>} />
        <Route path="/modifierEvenement/:id" element={<PrivateRoute><ModifierEvenement /></PrivateRoute>} />
        <Route path="/myEvenement/" element={<PrivateRoute><MyEvenement /></PrivateRoute>} />
        <Route path="/calendrier/" element={<PrivateRoute><Calendrier /></PrivateRoute>} />
        <Route path="/setting/" element={<PrivateRoute><Setting /></PrivateRoute>} />
        <Route path="/about/" element={<About />} />
        <Route path="/conditionUser/" element={<ConditionUser />} />
        <Route path="/privatyPolicy/" element={<PrivatyPolicy />} />
        <Route path="/scanner" element={<PrivateRoute><Scanner /></PrivateRoute>} />
      </Routes>
    </>
  )
}
export default App