import { useState, useEffect } from "react";
import axios from 'axios'
import API_URL from '../../utils/api'
import { useNavigate, useLocation } from 'react-router-dom'
import accueil from "../../assets/icons/home-1-svgrepo-com.svg";
import logo from '../../assets/logos/logo-orange.png'
import user_icon from "../../assets/icons/user-svgrepo-com.svg";
import align_text from "../../assets/icons/align-text-left-svgrepo-com.svg";
import create_even from "../../assets/icons/plus-circle-add-new-create-cross-svgrepo-com.svg";
import calendrier from "../../assets/icons/calendar-days-svgrepo-com.svg";
import setting from "../../assets/icons/setting-svgrepo-com.svg";
import qrcode from '../../assets/icons/qr-code.svg'
import exit from "../../assets/icons/exit.svg";
import chevron from "../../assets/icons/chevron-down.svg";

// Composant groupe dépliable
function Groupe({ titre, icone, enfants, defaultOuvert = false }) {
    const [ouvert, setOuvert] = useState(defaultOuvert)
    return (
        <div>
            <button
                onClick={() => setOuvert(!ouvert)}
                className="w-full flex justify-between items-center px-2 py-2 text-[11px] font-bold text-[#C2611F]/70 uppercase tracking-wider hover:text-[#C2611F] transition"
            >
                <span>{titre}</span>
                <img className={`transition-transform duration-200 w-4 h-4 cursor-pointer ${ouvert ? 'rotate-180' : ''}`} src={chevron} alt="Chevron" />
            </button>
            {ouvert && (
                <div className="flex flex-col gap-2 pl-2 border-l border-[#C2611F]/20 ml-2">
                    {enfants}
                </div>
            )}
        </div>
    )
}

// Item de navigation
function NavItem({ label, icone, path, onClick, location }) {
    const actif = location.pathname === path
    return (
        <div
            onClick={onClick}
            className={`rounded-md text-[12px] flex justify-start items-center gap-2 p-2 cursor-pointer transition-all duration-200
                ${actif
                    ? 'bg-[#C2611F]/70 border-l-4 border-[#C2611F] font-bold'
                    : 'bg-[#C2611F]/10 hover:bg-[#C2611F]/30 border-l-2 border-[#C2611F]/30'
                }`}
        >
            <img className='h-4 w-4' src={icone} alt={label} />
            <span>{label}</span>
        </div>
    )
}

function Sidebar({ menuOuvert, setMenuOuvert }) {
    const [utilisateur, setUtilisateur] = useState(null)
    const [search, setSearch] = useState("")
    const [resultats, setResultats] = useState([])
    const navigate = useNavigate()
    const location = useLocation()

    const seConnecter = async () => {
        try {
            const token = localStorage.getItem('access')
            const reponse = await axios.get(`${API_URL}/api/utilisateurs/me/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUtilisateur(reponse.data)
        } catch (_err) {
            if (_err.response?.status === 401) {
                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
                navigate('/login')
            }
        }
    }

    // Recherche debounce
    useEffect(() => {
        if (!search.trim()) { setResultats([]); return }
        const timer = setTimeout(async () => {
            try {
                const res = await axios.get(`${API_URL}/api/evenements/?search=${search}`)
                setResultats(res.data.slice(0, 5))
            } catch { setResultats([]) }
        }, 400)
        return () => clearTimeout(timer)
    }, [search])

    useEffect(() => { seConnecter() }, [])
    useEffect(() => {
        window.addEventListener('profilMisAJour', seConnecter)
        return () => window.removeEventListener('profilMisAJour', seConnecter)
    }, [])

    const seDeconnecter = () => {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        navigate('/login')
    }

    const aller = (path) => {
        navigate(path)
        setMenuOuvert?.(false)
    }

    const isOrga = utilisateur?.role === 'organisateur'

    return (
        <div className={`bg-white border-r border-[#C2611F]/30 flex flex-col
                        w-[75%] md:w-full h-screen text-[#1A1A2E]
                        fixed md:relative z-40 transition-transform duration-300
                        ${menuOuvert ? 'translate-x-0' : '-translate-x-full'}
                        md:translate-x-0 overflow-hidden`}>

            {/* LOGO */}
            <div className="flex items-center gap-2 p-4 border-b border-[#C2611F]/20">
                <img className='h-8 w-8' src={logo} alt="Logo OtakuKamer" />
                <span className="font-bold text-sm md:text-lg">OtakuKamer</span>
            </div>

            {/* SEARCH BAR */}
            <div className="px-3 py-2 border-b border-[#C2611F]/10 relative">
                <input
                    type="search"
                    placeholder="Rechercher un événement..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full h-8 px-3 text-[12px] rounded-md border border-[#C2611F]/30 focus:outline-none focus:border-[#C2611F] bg-[#C2611F]/5"
                />
                {resultats.length > 0 && (
                    <div className="absolute left-3 right-3 top-10 bg-white border border-[#C2611F]/30 rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
                        {resultats.map(e => (
                            <div
                                key={e.id}
                                onClick={() => { navigate(`/evenement/${e.id}`); setSearch(''); setResultats([]) }}
                                className="px-3 py-2 text-[12px] hover:bg-[#C2611F]/10 cursor-pointer border-b border-gray-100 last:border-0"
                            >
                                {e.titre}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* PROFIL */}
            <div className="flex items-center gap-2 px-3 py-3 bg-[#C2611F]/10 mx-3 mt-3 rounded-lg">
                <div className="bg-[#C2611F] w-9 h-9 rounded-full flex justify-center items-center overflow-hidden flex-shrink-0">
                    {utilisateur?.photoProfil
                        ? <img src={utilisateur.photoProfil} className='h-full w-full object-cover' alt="Profil" />
                        : <img className='h-6 w-6' src={user_icon} alt="User" />
                    }
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="font-bold text-[12px] truncate">{utilisateur?.first_name}</span>
                    <span className="text-gray-500 text-[10px] capitalize">{utilisateur?.role}</span>
                </div>
            </div>

            {/* NAVIGATION */}
            <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3">

                {/* Accueil — toujours visible */}
                <NavItem label="Accueil" icone={accueil} path="/accueil" location={location} onClick={() => aller('/accueil')} />

                {isOrga ? (
                    <>
                        {/* GROUPE GESTION */}
                        <Groupe titre="Gestion" icone={create_even} defaultOuvert={true} enfants={
                            <>
                                <NavItem label="Mes Événements" icone={align_text} path="/MyEvenement" location={location} onClick={() => aller('/MyEvenement')} />
                                <NavItem label="Créer un Événement" icone={create_even} path="/createEven" location={location} onClick={() => aller('/createEven')} />
                            </>
                        } />

                        {/* GROUPE OUTILS */}
                        <Groupe titre="Outils" icone={qrcode} enfants={
                            <>
                                <NavItem label="Scanner un billet" icone={qrcode} path="/scanner" location={location} onClick={() => aller('/scanner')} />
                                <NavItem label="Calendrier" icone={calendrier} path="/calendrier" location={location} onClick={() => aller('/calendrier')} />
                            </>
                        } />
                    </>
                ) : (
                    <>
                        {/* GROUPE ACTIVITÉ */}
                        <Groupe titre="Activité" defaultOuvert={true} enfants={
                            <>
                                <NavItem label="Mes Billets" icone={align_text} path="/billets" location={location} onClick={() => aller('/billets')} />
                                <NavItem label="Calendrier" icone={calendrier} path="/calendrier" location={location} onClick={() => aller('/calendrier')} />
                            </>
                        } />
                    </>
                )}

                {/* GROUPE COMPTE */}
                <Groupe titre="Compte" icone={setting} enfants={
                    <>
                        <NavItem label="Paramètres" icone={setting} path="/setting" location={location} onClick={() => aller('/setting')} />
                    </>
                } />
            </div>

            {/* DÉCONNEXION */}
            <div className="px-3 pb-4 border-t border-[#C2611F]/10 pt-3">
                <div
                    onClick={seDeconnecter}
                    className="flex items-center gap-2 p-2 rounded-md text-[12px] cursor-pointer text-red-600 hover:bg-red-50 transition font-bold"
                >
                    <img className='h-5 w-5' src={exit} alt="Déconnexion" />
                    <span>Déconnexion</span>
                </div>
            </div>
        </div>
    )
}

export default Sidebar