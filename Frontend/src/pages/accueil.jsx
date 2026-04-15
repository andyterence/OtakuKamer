import { useState, useEffect } from "react";
import Hero from "../components/accueil/hero";
import ListeEvenements from "../components/accueil/ListeEvenements";
import ListeNews from "../components/accueil/ListeNews";
import Sidebar from "../components/shared/sidebar";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import menu from '../assets/icons/menu.svg'
import AOS from 'aos';
import 'aos/dist/aos.css';

function Accueil() {

    // Etat pour refuser l'autorisation du sidebar aux personnes qui ne sont pas connecter
    const token = localStorage.getItem('access')
    // Menu ouvert ou pas
    const [menuOuvert, setMenuOuvert] = useState(false)
    const [modalBienvenue, setModalBienvenue] = useState(false)
    // Ferme le modal de bienvenue et enregistre dans le localStorage que l'utilisateur l'a déjà vu pour ne pas le réafficher à sa prochaine visite
    const fermerModal = () => {
        localStorage.setItem("dejaVuBienvenue", "true")
        setModalBienvenue(false)
    }

    // useEffect pour bloquer le modal de bienvenue si l'utilisateur n'est pas a sa toute premiere visite
    useEffect(() => {
        const dejaVu = localStorage.getItem("dejaVuBienvenue")

        if (!dejaVu) {
            setModalBienvenue(true)
        }
    }, [])
    
    return(
        <div className="flex flex-col">
            <div className="flex items-start">
                {menuOuvert && (
                    <div 
                        className='md:hidden fixed inset-0 bg-black/50 z-30'
                        onClick={() => setMenuOuvert(false)}
                        />
                    )}
                {token && (
                    <>
                        {/* BOUTON HAMBURGER */}
                        <button 
                            className='md:hidden fixed top-4 left-4 z-50'
                            onClick={() => setMenuOuvert(!menuOuvert)}
                        >
                            <img className='h-5 w-5' src={menu} alt="Menu" />
                        </button>
                        
                        {/* SIDEBAR */}
                        <aside className="md:w-1/7 w-0 md:sticky md:top-0 md:h-screen z-50">
                            <Sidebar menuOuvert={menuOuvert} setMenuOuvert={setMenuOuvert} />
                        </aside>
                    </>
                )}
                <main className={token ? 'md:w-6/7 w-full' : 'w-full'}>
                    <Navbar />
                    <Hero />
                    <ListeEvenements />
                    {/* <ListeNews /> */}
                    <Footer  />
                </main>
                
            </div>
            {/* MODAL DE BIENVENUE */}
            {modalBienvenue && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-white flex flex-col justify-center items-center rounded-lg h-[30vh] w-90 text-center">
                        <h2 className="text-xl font-bold mb-4">Bienvenue sur <span className="text-[#C2611F]">OtakuKamer</span> !</h2>
                        <p className="text-gray-600">Voulez vous debuter le tutoriel ?</p>
                        <div className="w-full flex justify-center items-center gap-10">
                            <button 
                                className="mt-4 border-1 border-[#C2611F] transition-all duration-300 cursor-pointer hover:translate-y-1 font-bold py-2 px-4 rounded"
                                 onClick={fermerModal}
                            >
                                Non
                            </button>
                            <button 
                                className="mt-4 bg-[#C2611F] transition-all duration-300 cursor-pointer hover:translate-y-1 text-white font-bold py-3 px-5 rounded"
                                onClick={fermerModal}
                            >
                                Oui
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        )
    }

export default Accueil