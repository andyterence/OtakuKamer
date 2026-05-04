import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from "react";
import axios from 'axios'
import API_URL from '../../utils/api'
import logo from '../../assets/logos/logo-orange.png'

function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const [search, setSearch] = useState("")
    const [rechercheActive, setRechercheActive] = useState(false)
    const [evenements, setEvenements] = useState([])
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [menuMobileOuvert, setMenuMobileOuvert] = useState(false)
    const token = localStorage.getItem('access')

    // UseEffect pour implémenter un délai de debounce sur la barre de recherche. Chaque fois que la valeur de search change, un timer est démarré pour mettre à jour le state debouncedSearch après un délai de 400 millisecondes. Si l'utilisateur continue à taper avant que le délai ne soit écoulé, le timer précédent est annulé et un nouveau timer est démarré. Cela permet d'éviter d'envoyer une requête à l'API à chaque frappe de l'utilisateur et d'attendre qu'il ait fini de saisir avant d'effectuer la recherche.
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 400)
    
        return () => clearTimeout(timer)
    }, [search])
    
    // UseEffect pour écouter les changements de la barre de recherche et effectuer une requête à l'API pour récupérer les événements correspondants au terme de recherche saisi. Chaque fois que la valeur de search change, une nouvelle requête est envoyée à l'API avec le paramètre de recherche, et les événements correspondants sont stockés dans le state evenements.
    useEffect(() => {
        if (!debouncedSearch.trim()) {
            setEvenements([])
            return
        }
    
        const fetchEvents = async () => {
            try {
                const res = await axios.get(
                    `${API_URL}/api/evenements/?search=${debouncedSearch}`
                )
                setEvenements(res.data)
            } catch (err) {
                console.error(err)
            }
        }
    
        fetchEvents()
    }, [debouncedSearch])
    // Function qui surligne la partie du texte correspondant a la recherche 
    const surlignerTexte = (texte, recherche) => {
        if (!recherche.trim()) return texte
        const regex = new RegExp(`(${recherche})`, 'gi')
        const parties = texte.split(regex)
        return parties.map((partie, i) =>
            regex.test(partie) 
                ? <span key={i} className='text-[#C2611F] font-bold'>{partie}</span>
                : partie
        )
    }

    if (token) return null

    return(
        <nav className="z-50 fixed w-screen text-white bg-black/50">
            {/* BARRE PRINCIPALE */}
            <div className="w-full h-15 flex justify-start items-center pr-4 md:pr-10">
                {/* LOGO */}
                <img className='h-12 w-12  md:ml-[2%]' src={logo} alt="Logo d'OtakuKamer" />

                {/* RECHERCHE — cachée sur mobile */}
                <div className="hidden md:flex w-2/5 md:ml-[10%] relative flex-col">
                    <div className='relative w-full flex items-center gap-1'>
                        <label className="font-bold text-md text-[#C2611F]/80 whitespace-nowrap" htmlFor="search">Rechercher</label>
                        <input
                            type="search"
                            id="search"
                            placeholder="Rechercher un événement..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => setRechercheActive(true)}
                            onBlur={() => setTimeout(() => setRechercheActive(false), 200)}
                            className="w-full p-3 h-7 rounded-sm border-1 border-[#C2611F] text-black"
                        />
                    </div>
                    {rechercheActive && evenements.length > 0 && (
                        <div className="absolute top-8 w-full bg-black/90 rounded-sm border border-[#C2611F] max-h-40 overflow-y-auto z-50">
                            {evenements.map((event) => (
                                <div key={event.id} onClick={() => { navigate(`/evenement/${event.id}`); setSearch(''); setEvenements([]) }}
                                    className="px-2 py-1 hover:bg-[#C2611F]/30 cursor-pointer text-[12px]">
                                    <p>{surlignerTexte(event.titre, search)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {debouncedSearch && evenements.length === 0 && (
                        <div className="absolute top-8 w-full bg-black/90 p-3 text-sm text-gray-400 rounded-md border border-[#C2611F] z-50">
                            Aucun événement trouvé pour "{debouncedSearch}"
                        </div>
                    )}
                </div>

                {/* LIENS — cachés sur mobile */}
                <ul className="hidden md:flex items-center gap-4 text-[14px] md:ml-[10%] font-bold">
                    <li><a className={location.pathname === '/accueil' ? 'text-[#C2611F]' : 'hover:text-[#C2611F]/80'} onClick={() => navigate('/accueil')} href="#">Accueil</a></li>
                    <li><a className='hover:text-[#C2611F]/80 cursor-pointer' onClick={() => { navigate('/accueil'); setTimeout(() => document.getElementById('liste-evenements')?.scrollIntoView({ behavior: 'smooth' }), 100) }}>Événements</a></li>
                    <li><a className={location.pathname === '/ListeNews' ? 'text-[#C2611F]' : 'hover:text-[#C2611F]/80'} onClick={() => navigate('/ListeNews')} href="#">Actualités</a></li>
                    <li><a className={location.pathname === '/about' ? 'text-[#C2611F]' : 'hover:text-[#C2611F]/80'} onClick={() => navigate('/about')} href="#">À propos</a></li>
                    {!token && (
                        <button onClick={() => navigate('/Login')} className='border border-[#C2611F] text-[12px] text-[#C2611F] px-6 py-2 rounded-xl font-bold cursor-pointer hover:bg-white/10 transition'>
                            Se connecter
                        </button>
                    )}
                </ul>

                {/* HAMBURGER — visible sur mobile */}
                {!token && (
                    <button className="md:hidden text-white text-2xl ml-auto" onClick={() => setMenuMobileOuvert(!menuMobileOuvert)}>
                        {menuMobileOuvert ? '✕' : '☰'}
                    </button>
                )}
            </div>

            {/* MENU MOBILE DÉROULANT */}
            {/* MENU MOBILE — visible seulement si non connecté */}
            {!token && menuMobileOuvert && (
                <div className="md:hidden bg-black/90 flex flex-col gap-4 px-6 py-4 text-[14px] font-bold">
                    {/* Recherche mobile */}
                    <input
                        type="search"
                        placeholder="Rechercher un événement..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-2 rounded-sm border border-[#C2611F] text-black text-sm"
                    />
                    <a onClick={() => { navigate('/accueil'); setMenuMobileOuvert(false) }} className='cursor-pointer hover:text-[#C2611F]'>Accueil</a>
                    <a onClick={() => { navigate('/accueil'); setMenuMobileOuvert(false); setTimeout(() => document.getElementById('liste-evenements')?.scrollIntoView({ behavior: 'smooth' }), 100) }} className='cursor-pointer hover:text-[#C2611F]'>Événements</a>
                    <a onClick={() => { navigate('/ListeNews'); setMenuMobileOuvert(false) }} className='cursor-pointer hover:text-[#C2611F]'>Actualités</a>
                    <a onClick={() => { navigate('/about'); setMenuMobileOuvert(false) }} className='cursor-pointer hover:text-[#C2611F]'>À propos</a>
                    {!token && (
                        <button onClick={() => { navigate('/Login'); setMenuMobileOuvert(false) }} className='border border-[#C2611F] text-[#C2611F] px-6 py-2 rounded-xl font-bold'>
                            Se connecter
                        </button>
                    )}
                </div>
            )}
        </nav>
    )
}

export default Navbar