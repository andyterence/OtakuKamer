import { useState } from "react";
import logo from '../assets/logos/OtakuKamer_logo.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Hero from "../components/accueil/hero";
import ListeEvenements from "../components/accueil/ListeEvenements";
import ListeNews from "../components/accueil/ListeNews";
import Sidebar from "../components/shared/sidebar";
import kurama_attend from '../assets/imgs/goku_attend.png'

function Accueil() {

    // État pour indiquer si la connexion est en cours d'attente, utilisé pour afficher une image différente pendant le processus de connexion
    const [enAttente, setEnAttente] = useState(false)
    
    return(

        <div className="flex items-start">
            <aside className="w-1/7 sticky top-0 h-screen">
                <Sidebar />
            </aside>
            <main className="w-6/7">
                <Hero />
                <ListeEvenements />
                <ListeNews />
            </main>
            
            {/* L'IMAGE QU'ON AFFICHE SI UNE REQUETTE EST EN COURS */}
            {enAttente && (
                <div className="flex flex-col fixed inset-0 bg-[#0D0D0D] flex items-center justify-center z-50">
                    <img className='w-80 h-auto anime-flotter' src={kurama_attend} />
                        <p className="text-white text-lg">Chargement en cours...</p>
                </div>
            )}
        </div>
    )
}

export default Accueil