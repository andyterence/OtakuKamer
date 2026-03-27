import { useState } from "react";
import logo from '../assets/logos/OtakuKamer_logo.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Hero from "../components/accueil/hero";
import ListeEvenements from "../components/accueil/ListeEvenements";
import ListeNews from "../components/accueil/ListeNews";
import Sidebar from "../components/shared/sidebar";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import kurama_attend from '../assets/imgs/goku_attend.png';
import menu from '../assets/icons/menu.svg'
import AOS from 'aos';
import 'aos/dist/aos.css';

function Accueil() {

    // État pour indiquer si la connexion est en cours d'attente, utilisé pour afficher une image différente pendant le processus de connexion
    const [enAttente, setEnAttente] = useState(false)
    // Etat pour refuser l'autorisation du sidebar aux personnes qui ne sont pas connecter
    const token = localStorage.getItem('access')
    // Menu ouvert ou pas
    const [menuOuvert, setMenuOuvert] = useState(false)
    
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
                
                {/* L'IMAGE QU'ON AFFICHE SI UNE REQUETTE EST EN COURS */}
                {enAttente && (
                    <div className="flex flex-col fixed inset-0 bg-[#0D0D0D] flex items-center justify-center z-50">
                        <img className='w-80 h-auto anime-flotter' src={kurama_attend} />
                            <p className="text-white text-lg">Chargement en cours...</p>
                    </div>
                )}
                
            </div>
        </div>
        )
    }

export default Accueil