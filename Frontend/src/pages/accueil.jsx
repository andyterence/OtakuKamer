import { useState, useEffect } from "react";
import Hero from "../components/accueil/hero";
import ListeEvenements from "../components/accueil/ListeEvenements";
import ListeNews from "../components/accueil/ListeNews";
import Sidebar from "../components/shared/sidebar";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import Onboarding from "../components/onboarding/onboarding";
import menu from '../assets/icons/menu.svg'
import AOS from 'aos';
import 'aos/dist/aos.css';

function Accueil() {
    
    const token = localStorage.getItem('access')
    const [menuOuvert, setMenuOuvert] = useState(false)
    const [modalBienvenue, setModalBienvenue] = useState(false)
    const [dejaVu, setDejaVu] = useState(false)
    const [tutorielActif, setTutorielActif] = useState(false);
    // Ferme le modal de bienvenue et enregistre dans le localStorage que l'utilisateur l'a déjà vu pour ne pas le réafficher à sa prochaine visite
    const fermerModal = () => {
        localStorage.setItem("dejaVuBienvenue", "true")
        setModalBienvenue(false)
    }

    const lancerTutoriel = () => {
        localStorage.setItem("dejaVuBienvenue", "true")
        setModalBienvenue(false)
        setTutorielActif(true)  // ← lance le tutoriel !
    }

    useEffect(() => {
        const dejaVu = localStorage.getItem("dejaVuBienvenue")
        if (!dejaVu && token) {  // ← ajout de token
            setModalBienvenue(true)
        }
    }, [])
    
    return(
        <div className="relative flex flex-col">
            <div className="flex items-start">
                {token && (
                    <>
                        {/* SIDEBAR */}
                        {menuOuvert && (
                            <div 
                                className='md:hidden fixed inset-0 bg-black/50 z-50'
                                onClick={() => setMenuOuvert(false)}
                            />
                        )}
                        <button 
                            className='md:hidden fixed top-4 left-4 z-50'
                            onClick={() => setMenuOuvert(!menuOuvert)}
                        >
                            <div className='flex justify-center items-center h-9 w-9 bg-black/70 rounded-md z-50'>
                                <img className='h-6 w-6' src={menu} alt="Menu" />
                            </div>
                        </button>
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
                                Non, je maitrise.
                            </button>
                            <button 
                                className="mt-4 bg-[#C2611F] transition-all duration-300 cursor-pointer hover:translate-y-1 text-white font-bold py-3 px-5 rounded"
                                onClick={lancerTutoriel}
                            >
                                Oui, c'est parti !
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* BOUTON FLOTTANT POUR DECLANCHER L'ONBOARDING */}
            <button onClick={() => setTutorielActif(true)} className="anime-flotter bg-[#C2611F]/50 fixed bottom-30 right-10 border-2 border-black h-13 w-13 rounded-full flex justify-center items-center z-50 cursor-pointer hover:bg-[#C2611F] hover:scale-110 transition-transform duration-300">
                <div className="anime-flotter absolute border-2 border-black h-7 w-7 rounded-full flex justify-center items-center">
                    <div className="absolute border-2 border-black h-5 w-5 rounded-full flex justify-center items-center">
                        <div className="absolute border-2 border-black h-3 w-3 rounded-full flex justify-center items-center"></div>
                    </div>
                </div>
            </button>
            {/* ONBOARDING */}
            <Onboarding run={tutorielActif} setRun={setTutorielActif} />
        </div>
        )
    }

export default Accueil