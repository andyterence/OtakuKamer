import { useState, useEffect } from "react";
// import logo2 from '../../assets/logos/logo-orange.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logos/logo-orange.png'
import accueil from "../../assets/icons/home-1-svgrepo-com.svg";
import user_icon from "../../assets/icons/user-svgrepo-com.svg";
import align_text from "../../assets/icons/align-text-left-svgrepo-com.svg";
import create_even from "../../assets/icons/plus-circle-add-new-create-cross-svgrepo-com.svg";
import calendrier from "../../assets/icons/calendar-days-svgrepo-com.svg";
import setting from "../../assets/icons/setting-svgrepo-com.svg";
import exit from "../../assets/icons/exit.svg";


function Sidebar() {

    const [utilisateur, setUtilisateur] = useState(null)
    const [menuOuvert, setMenuOuvert] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const seConnecter = async() => {
            try {
                const token = localStorage.getItem('access')
                const reponse = await axios.get('http://localhost:8000/api/utilisateurs/me/', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUtilisateur(reponse.data)
            } catch (_err) {
                if (_err.response?.status === 401) {
                    localStorage.removeItem('access')
                    localStorage.removeItem('refresh')
                    navigate('/login')
                }
                console.error(_err)
            }
                    }
                    seConnecter()
            },[])

    function seDeconnecter(){
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        navigate('/login')
    }

    return(
        <div className="bg-[#EDEDF5] border-r border-[#C2611F] flex flex-col justify-start w-full h-screen md:p-4 text-[#1A1A2E]">
            {/* PREMIER GRANDE SECTION */}
            <div className="flex flex-col justify-center gap-4 text-xl">
                {/* SECTION TITRE + LOGO */}
                <div className="flex justify-start items-center font-bold">
                    {/* Conteneur du logo */}
                    <div className="flex justify-center items-center">
                        <img className='h-10 h-10' src={logo} alt="Logo d'OtakuKamer" />
                    </div>
                    {/* Conteneur du titre */}
                    <div>
                        <h1>KamerOtaku</h1>
                    </div>
                </div>
                {/* SECTION DE RECHERCHE */}
                <div className="text-[12px] flex flex-col gap-1">
                    <label className="font-bold text-[#C2611F]" htmlFor="search">Rechercher</label>
                    <input
                        type="search" 
                        name="search" 
                        id="search"
                        placeholder="  Que recherchez vous ?"
                        className="bg-gray-300 h-7 rounded-sm border-none"
                    />
                </div>
                {/* SECTION PRINCIPALE */}
                <div>
                    {/* TITRE DU PROGIL */}
                    <div className="w-full text-[12px] font-bold text-[#C2611F]/80 px4">
                        <h2>Profil</h2>
                    </div>
                    {/* PROFIL DU USER */}
                    <div className="w-full flex items-center justify-start gap-2 bg-[#C2611F]/20 rounded-md p-2">
                        {/* ICON DU USER */}
                        <div className="bg-[#C2611F] w-10 h-10 rounded-full flex justify-center items-center">
                            <img className='h-6 h-6' src={user_icon} alt="Logo d'utilisateur" />
                        </div>
                        {/* NOM ET TYPE DU USER */}
                        <div className="flex flex-col">
                            <h1 className="font-bold text-[12px]">{utilisateur?.first_name}</h1>
                            <p className="text-gray-500 text-[10px]">{utilisateur?.role}</p>
                        </div>
                    </div>
                </div>
            </div>
            {utilisateur?.role === 'organisateur' ? (
                <div className="flex flex-col justify-between h-screen">
                    {/* BARRE DE SEPARATION */}
                    <div className="bg-[#C2611F] h-[2px] w-full my-4 p-0"></div>
                    {/* DEUXIEME GRANDE SECTION */}
                    <div className="flex-1 flex flex-col gap-4 font-bold">
                        {/* Accueil */}
                        <div className="active border-l-4 border-[#C2611F] bg-[#C2611F]/50 rounded-md text-[12px] flex justify-start items-center gap-2 py-2 px-4 cursor-pointer transition-all duration-300 hover:shadow-sm shadow-[#C2611F]/50 hover:px-4 hover:bg-[#C2611F]/80">
                            <img className='h-5 w-5' src={accueil} alt="Logo d'accueil" />
                            <button 
                                className="cursor-pointer"
                                onClick={() => navigate(`/accueil/`)}
                            >
                                Accueil
                            </button> 
                        </div>
                        {/* Mes Événement */}
                        <div className="border-l-4 border-[#C2611F] bg-[#C2611F]/10 rounded-md text-[12px] flex justify-start items-center gap-2 p-2 cursor-pointer transition-all duration-300 hover:shadow-sm shadow-[#C2611F]/50 hover:px-4 hover:bg-[#C2611F]/80">
                            <img className='h-5 w-5' src={align_text} alt="Logo de mes evenements" />
                            <button 
                                className="cursor-pointer"
                                onClick={() => navigate(`/MyEven/`)}
                            >
                                Mes Événement
                            </button>
                        </div>
                        {/* Créer un Événement */}
                        <div className="border-l-4 border-[#C2611F] bg-[#C2611F]/10 rounded-md text-[12px] flex justify-start items-center gap-2 p-2 cursor-pointer transition-all duration-300 hover:shadow-sm shadow-[#C2611F]/50 hover:px-4 hover:bg-[#C2611F]/80">
                            <img className='h-5 w-5' src={create_even} alt="Logo d'evenement" />
                            <button 
                                className="cursor-pointer"
                                onClick={() => navigate(`/createEven/`)}
                            >
                                Créer un Événement
                            </button>
                        </div>
                        {/* Calendrier */}
                        <div className="border-l-4 border-[#C2611F] bg-[#C2611F]/10 rounded-md text-[12px] flex justify-start items-center gap-2 p-2 cursor-pointer transition-all duration-300 hover:shadow-sm shadow-[#C2611F]/50 hover:px-4 hover:bg-[#C2611F]/80">
                            <img className='h-5 w-5' src={calendrier} alt="Logo du calendrier" />
                            <button 
                                className="cursor-pointer"
                                onClick={() => navigate(`/calendrier/`)}
                            >
                                Calendrier
                            </button>
                        </div>
                        {/* Paramètres */}
                        <div className="border-l-4 border-[#C2611F] bg-[#C2611F]/10 rounded-md text-[12px] flex justify-start items-center gap-2 p-2 cursor-pointer transition-all duration-300 hover:shadow-sm shadow-[#C2611F]/50 hover:px-4 hover:bg-[#C2611F]/80">
                            <img className='h-5 w-5' src={setting} alt="Logo d'accueil" />
                            <button 
                                className="cursor-pointer"
                                onClick={() => navigate(`/setting/`)}
                            >
                                Paramètres
                            </button>
                        </div>
                    </div>
                    {/* TROISIEME GRANDE SECTION */}
                    <div className="flex flex-col font-bold">
                        {/* Deconnexion */}
                        <div className="bg-[#C2611F]/10 rounded-md text-[12px] flex justify-start items-center gap-2 p-2 cursor-pointer transition-all duration-300 hover:shadow-sm shadow-[#C2611F]/50 hover:py-2 hover:px-6 hover:bg-red-900/80">
                            <img className='h-5 w-5 md:h-7 md:w-7' src={exit} alt="Logo pour creer un evenement" />
                            <button onClick={seDeconnecter}>Deconnexion</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col justify-between h-screen">
                    {/* BARRE DE SEPARATION */}
                    <div className="bg-[#C2611F] h-[2px] w-full my-4 p-0"></div>
                    {/* DEUXIEME GRANDE SECTION */}
                    <div className="flex-1 flex flex-col gap-4 font-bold">
                        {/* Accueil */}
                        <div className="active border-l-4 border-[#C2611F] bg-[#C2611F]/50 rounded-md text-[12px] flex justify-start items-center gap-2 py-2 px-4 cursor-pointer transition-all duration-300 hover:shadow-sm shadow-[#C2611F]/50 hover:px-4 hover:bg-[#C2611F]/80">
                            <img className='h-5 w-5' src={accueil} alt="Logo d'accueil" />
                            <button 
                                className="cursor-pointer"
                                onClick={() => navigate(`/accueil/`)}
                            >
                                Accueil
                            </button>
                        </div>
                        {/* Mes Billets */}
                        <div className="border-l-4 border-[#C2611F] bg-[#C2611F]/10 rounded-md text-[12px] flex justify-start items-center gap-2 p-2 cursor-pointer transition-all duration-300 hover:shadow-sm shadow-[#C2611F]/50 hover:px-4 hover:bg-[#C2611F]/80">
                            <img className='h-5 w-5' src={align_text} alt="Logo de mes billets" />
                            <button 
                                className="cursor-pointer"
                                onClick={() => navigate(`/billets/`)}
                            >
                                Mes billets
                            </button>
                        </div>
                        {/* Paramètres */}
                        <div className="border-l-4 border-[#C2611F] bg-[#C2611F]/10 rounded-md text-[12px] flex justify-start items-center gap-2 p-2 cursor-pointer transition-all duration-300 hover:shadow-sm shadow-[#C2611F]/50 hover:px-4 hover:bg-[#C2611F]/80">
                            <img className='h-5 w-5' src={setting} alt="Logo des parametres" />
                            <button 
                                className="cursor-pointer"
                                onClick={() => navigate(`/setting/`)}
                            >
                                Paramètres
                            </button>
                        </div>
                    </div>
                    {/* TROISIEME GRANDE SECTION */}
                    <div className="flex flex-col font-bold">
                        {/* Deconnexion */}
                        <div className="bg-[#C2611F]/10 rounded-md text-[12px] flex justify-start items-center gap-2 p-2 cursor-pointer transition-all duration-300 hover:shadow-sm shadow-[#C2611F]/50 hover:py-2 hover:px-6 hover:bg-red-900/80">
                            <img className='h-5 w-5 md:h-7 md:w-7' src={exit} alt="Logo pour creer un evenement" />
                            <button onClick={seDeconnecter}>Deconnexion</button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    )
}

export default Sidebar