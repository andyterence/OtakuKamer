import { useState } from "react";
import logo from '../assets/logos/OtakuKamer_logo.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Sidebar from "../components/shared/sidebar";
import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";
import kurama_attend from '../assets/imgs/goku_attend.png'
import menu from '../assets/icons/menu.svg'
import left from '../assets/icons/left.svg'
import heart from '../assets/icons/heart.svg'
import tags from '../assets/icons/users-2.svg'
import target from '../assets/icons/target.svg'
import excellence from '../assets/icons/target.svg'
import innov from '../assets/icons/innov.svg'
import logo_2 from '../assets/logos/logo-orange.png'
import background from '../assets/imgs/background.jpg'

function About() {

    const [evenements, setEvenements] = useState([])
    // État pour indiquer si la connexion est en cours d'attente, utilisé pour afficher une image différente pendant le processus de connexion
    const [enAttente, setEnAttente] = useState(false)
    // Etat pour refuser l'autorisation du sidebar aux personnes qui ne sont pas connecter
    const token = localStorage.getItem('access')
    // Menu ouvert ou pas
    const [menuOuvert, setMenuOuvert] = useState(false)
    // Pour pouvoir naviguer entre les pages
    const navigate = useNavigate()
    
    return(

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
            <main className={token ? 'md:w-6/7 w-full bg-gray-100 flex flex-col' : 'bg-gray-100 w-full flex flex-col'}>
                <Navbar />
                {/* TITRE ET SOUS TITRE DE BIENVENUE */}
                <div className='flex justify-between items-center md:mt-30'>
                    <div className='w-full flex flex-col justify-center items-start font-bold md:p-10'>
                        <h1 className='text-4xl'>À Propos d'OtakuKamer</h1>
                        <p className='text-md text-[#C2611F]'>La première plateforme dédiée aux événements Otaku au Cameroun</p>
                    </div>
                    <div className='pr-10 flex justify-center items-center'>
                        <button onClick={() => navigate('/accueil')} className='flex justify-center items-center text-md bg-[#C2611F]/80 w-45 h-10 rounded-md hover:bg-[#C2611F] cursor-pointer transition-all duration-300'>
                            <img className='h-6 w-6' src={left} alt="Logo du calendrier" />
                            <p className='text-white text-[14px] px-1'>Retour</p>
                        </button>
                    </div>
                </div>
                {/* NOTRE HISTOIRE */}
                <div className="h-130 flex justify-center items-center mt-15 md:p-10 p-30">
                    {/* CONTENEUR DU TEXT */}
                    <div className="w-1/2 flex flex-col justify-center items-start gap-4 md:px-20">
                        <h1 className="font-bold text-2xl">Notre Histoire</h1>
                        <p className="text-justify text-sm w-[80%]">
                            <p>OtakuKamer est né en <span className="text-[#C2611F] font-bold">2026</span> d'une passion commune pour l'anime, le manga et le gaming. Nous avons constaté qu'il n'existait pas de plateforme centralisée pour découvrir et participer aux événements Otaku au Cameroun.</p>
                            <br />
                            <p>Les fans devaient chercher sur différents réseaux sociaux, les informations étaient dispersées, et beaucoup d'événements incroyables passaient inaperçus. Les organisateurs, quant à eux, peinaient à toucher leur public cible.</p>
                            <br />
                            <p>Nous avons donc décidé de créer <span className="text-[#C2611F] font-bold">OtakuKamer</span> : un espace unique où la communauté Otaku camerounaise peut se retrouver, découvrir des événements, acheter des billets facilement, et où les organisateurs peuvent gérer leurs événements professionnellement.</p>
                        </p>
                    </div>
                    <div className="w-1/2 flex justify-center items-center">
                        <img className='h-[80%] w-[80%] anime-flotter' src={logo_2} alt="Logo du calendrier" />
                    </div>
                </div>
                {/* NOS VALEURS */}
                <div className="h-110 bg-gray-200 flex flex-col justify-center items-center md:gap-10 md:my-20">
                    <div>
                        <h1 className="font-bold text-2xl">Nos valeur</h1>
                    </div>
                    <div className="flex justify-center items-center gap-5">
                        {/* PASSION */}
                        <div className="border-1 border-[#C2611F] h-75 w-70 flex flex-col justify-evenly items-center rounded-xl hover:shadow-xl shadow-[#C2611F]/30 transition-all duration-300">
                            {/* ICONE */}
                            <div>
                                <div className="bg-[#C2611F]/40 h-10 w-10 flex justify-center items-center rounded-md">
                                    <img className='h-7 w-7' src={heart} alt="Logo de l'information" />
                                </div>
                            </div>
                            {/* TITRE */}
                            <div>
                                <h2 className="font-bold text-xl">passion</h2>
                            </div>
                            {/* CONTENUE */}
                            <div>
                                <p className="text-sm text-center px-4">
                                    Nous sommes des passionnés d'anime,
                                    manga et gaming qui veulent partager
                                    cette passion avec toute la communauté
                                    camerounaise.
                                </p>
                            </div>
                        </div>
                        {/* COMMUNAUTE */}
                        <div className="border-1 border-[#C2611F] h-75 w-70 flex flex-col justify-evenly items-center rounded-xl hover:shadow-xl shadow-[#C2611F]/30 transition-all duration-300">
                            {/* ICONE */}
                            <div>
                                <div className="bg-[#C2611F]/40 h-10 w-10 flex justify-center items-center rounded-md">
                                    <img className='h-7 w-7' src={tags} alt="Logo de l'information" />
                                </div>
                            </div>
                            {/* TITRE */}
                            <div>
                                <h2 className="font-bold text-xl">Communauté</h2>
                            </div>
                            {/* CONTENUE */}
                            <div>
                                <p className="text-sm text-center px-4">
                                    Créer un espace où tous les fans peuvent se rencontrer,
                                    échanger et célébrer ensemble leur amour de la culture Otaku.
                                </p>
                            </div>
                        </div>
                        {/* EXCELLENCE */}
                        <div className="border-1 border-[#C2611F] h-75 w-70 flex flex-col justify-evenly items-center rounded-xl hover:shadow-xl shadow-[#C2611F]/30 transition-all duration-300">
                            {/* ICONE */}
                            <div>
                                <div className="bg-[#C2611F]/40 h-10 w-10 flex justify-center items-center rounded-md">
                                    <img className='h-7 w-7' src={excellence} alt="Logo de l'information" />
                                </div>
                            </div>
                            {/* TITRE */}
                            <div>
                                <h2 className="font-bold text-xl">Excellence</h2>
                            </div>
                            {/* CONTENUE */}
                            <div>
                                <p className="text-sm text-center px-4">
                                    Nous nous engageons à offrir la meilleure expérience possible,
                                    tant pour les participants que pour les organisateurs.
                                </p>
                            </div>
                        </div>
                        {/* INNOVATION */}
                        <div className="border-1 border-[#C2611F] h-75 w-70 flex flex-col justify-evenly items-center rounded-xl hover:shadow-xl shadow-[#C2611F]/30 transition-all duration-300">
                            {/* ICONE */}
                            <div>
                                <div className="bg-[#C2611F]/40 h-10 w-10 flex justify-center items-center rounded-md">
                                    <img className='h-7 w-7' src={innov} alt="Logo de l'information" />
                                </div>
                            </div>
                            {/* TITRE */}
                            <div>
                                <h2 className="font-bold text-xl">Innovation</h2>
                            </div>
                            {/* CONTENUE */}
                            <div>
                                <p className="text-sm text-center px-4">
                                    Utiliser la technologie pour rendre les événements Otaku
                                    plus accessibles et mieux organisés au Cameroun.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* NOTRE EQUIPE */}
                <div className="h-100 flex flex-col justify-center items-center md:gap-5 md:my-20">
                    {/* TITRE */}
                    <div>
                        <h1 className="font-bold text-2xl">Notre Équipe</h1>
                    </div>
                    <div className="flex justify-center items-center">
                        {/* CADRE */}
                        <div className="border-1 border-[#C2611F] h-75 w-70 flex flex-col items-center rounded-xl hover:shadow-xl shadow-[#C2611F]/30 transition-all duration-300">
                            {/* PHOTO */}
                            <div className="h-3/4 w-full">
                                <img className='h-full w-full' src={background} alt="Logo de l'information" />
                            </div>
                            {/* INFORMATION SUR LA PERSONNE */}
                            <div className="h-1/4 flex flex-col justify-center items-center">
                                {/* NOM ET PRENOM */}
                                <div className="text-center font-bold">
                                    <p>Ndoubi Andy</p>
                                </div>
                                {/* ROLE */}
                                <div className="text-center text-[#C2611F] font-[500]">Dev Web Full stack</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* STATISTIQUE */}
                <div className="bg-[#C2611F] h-30 flex justify-evenly items-center text-white">
                    <div className="flex flex-col justify-center items-center">
                        {/* <p>{evenements?.lenght}+</p> */}
                        <p className="text-3xl font-bold">500+</p>
                        <p className="text-sm text-gray-200 font-[500]">Événements</p>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        {/* <p>{evenements?.lenght}+</p> */}
                        <p className="text-3xl font-bold">10k+</p>
                        <p className="text-sm text-gray-200 font-[500]">Utilisateurs</p>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        {/* <p>{evenements?.lenght}+</p> */}
                        <p className="text-3xl font-bold">50+</p>
                        <p className="text-sm text-gray-200 font-[500]">Organisateurs</p>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        {/* <p>{evenements?.lenght}+</p> */}
                        <p className="text-3xl font-bold">10+</p>
                        <p className="text-sm text-gray-200 font-[500]">Partenaires</p>
                    </div>
                </div>
                <Footer />
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

export default About