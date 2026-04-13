import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../../assets/logos/logo-orange.png'


function Navbar() {

    const navigate = useNavigate()
    const location = useLocation()

    // Etat pour refuser l'autorisation a un element aux personnes qui ne sont pas connecter
    const token = localStorage.getItem('access')

    return(
        <nav className="z-50 fixed w-full h-15 text-white bg-black/50 flex justify-center items-center">
            <div className="w-full h-full flex justify-start items-center pl-10">
                <img className='h-15 w-15' src={logo} alt="Logo d'OtakuKamer" />
            </div>
            <ul className="w-full flex justify-start items-center gap-4 text-[14px] font-bold">
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