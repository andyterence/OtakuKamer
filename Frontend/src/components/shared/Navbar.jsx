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
    // UseState pour stocker les résultats de recherche des événements en fonction du terme de recherche saisi dans la barre de recherche. Lorsque l'utilisateur saisit un terme de recherche, une requête est envoyée à l'API pour récupérer les événements correspondants, et ces événements sont stockés dans le state evenements. Cela permet d'afficher les résultats de la recherche dans la barre latérale lorsque l'utilisateur effectue une recherche.
    const [debouncedSearch, setDebouncedSearch] = useState("")


    // Etat pour refuser l'autorisation a un element aux personnes qui ne sont pas connecter
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

    return(
        <nav className="z-50 fixed w-full h-15 text-white bg-black/50 flex justify-center items-center md:gap-30">
            <div className=" h-full flex justify-start items-center pl-10">
                <img className='h-15 w-15' src={logo} alt="Logo d'OtakuKamer" />
            </div>
            {/* SECTION DE RECHERCHE */}
            <div className="w-2/5 h-full text-[12px] flex flex-col justify-center items-center gap-1">
                <div className='relative w-full flex justify-center items-center gap-1'>
                    <label className="font-bold text-md text-[#C2611F]/80" htmlFor="search">Rechercher</label>
                    <input
                        type="search"
                        name="search"
                        id="search"
                        placeholder="Rechercher un événement..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => setRechercheActive(true)}
                        onBlur={() => setTimeout(() => setRechercheActive(false), 200)}
                        className="w-full p-3 h-7 rounded-sm border-1 border-[#C2611F]"
                    />
                </div>
                <div className='flex justify-center items-start'>
                    {rechercheActive && evenements.length > 0 && (
                        <div className="w-[35%] h-8 absolute mt-2 rounded-sm border-1 border-[#C2611F] shadow max-h-40 overflow-y-auto">
                            {evenements.map((event) => (
                                <div
                                    key={event.id}   
                                    onClick={() => {
                                        navigate(`/evenement/${event.id}`)
                                        setSearch('')
                                        setEvenements([])
                                    }}
                                    className="w-full h-full px-2 flex justify-start items-center hover:bg-[#C2611F]/30 cursor-pointer text-[12px] transition-all duration-200 rounded-sm"
                                >
                                    <p>{surlignerTexte(event.titre, search)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {debouncedSearch && evenements.length === 0 && (
                        <div className="absolute w-[35%] bg-black/90 p-3 text-sm text-gray-400 rounded-md border border-[#C2611F]">
                            Aucun événement trouvé pour "{debouncedSearch}"
                        </div>
                    )}
                </div>
            </div>
            <ul className="w-2/5 flex justify-start items-center gap-4 text-[14px] font-bold">
                <li>
                    <a 
                        className={location.pathname === '/accueil' 
                            ? 'active text-[#C2611F] transition-all duration-300 hover:px-4'
                            : 'transition-all duration-300 hover:px-4 hover:text-[#C2611F]/80'
                        }
                        onClick={() => navigate(`/accueil`)} 
                        href="#"
                    >
                        Accueil
                    </a>
                </li>
                <li>
                    <a 
                        className={location.pathname === '/ListeEvenements' 
                            ? 'active text-[#C2611F] transition-all duration-300 hover:px-4 cursor-pointer'
                            : 'transition-all duration-300 hover:px-4 hover:text-[#C2611F]/80 cursor-pointer'
                        }
                        onClick={() => {
                            navigate('/accueil')
                            // Petit délai pour laisser la page charger avant de scroller
                            setTimeout(() => {
                                document.getElementById('liste-evenements')?.scrollIntoView({ behavior: 'smooth' })
                            }, 100)
                        }}
                    >
                        Événements
                    </a>
                </li>
                <li>
                    <a 
                        className={location.pathname === '/ListeNews' 
                            ? 'active text-[#C2611F] transition-all duration-300 hover:px-4'
                            : 'transition-all duration-300 hover:px-4 hover:text-[#C2611F]/80'
                        }
                        onClick={() => navigate(`/ListeNews`)} 
                        href="#"
                    >
                        Actualités
                    </a>
                </li>
                <li>
                    <a 
                        className={location.pathname === '/about' 
                            ? 'active text-[#C2611F] transition-all duration-300 hover:px-4'
                            : 'transition-all duration-300 hover:px-4 hover:text-[#C2611F]/80'
                        }
                        onClick={() => navigate(`/about`)} 
                        href="#"
                    >
                        À propos
                    </a>
                </li>
                {!token && (
                    <button
                        onClick={() => navigate(`/Login`)}
                        className='border-1 border-[#C2611F] text-[12px] text-[#C2611F] px-12 py-2 rounded-xl font-bold cursor-pointer hover:shadow-sm hover:bg-[#F1F1F1] shadow-black-500/50 hover:opacity-70 transition'>
                        Se connecter
                    </button>
                )}
            </ul>
        </nav>
    )
}

export default Navbar