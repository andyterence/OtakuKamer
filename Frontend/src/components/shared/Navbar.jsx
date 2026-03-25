import { useState, useEffect } from "react";
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../../assets/logos/logo-orange.png'
// import facebook from '../../assets/logos/facebook.svg'
// import twitter from '../../assets/logos/twitter.svg'
// import instagram from '../../assets/logos/instagram.svg'
// import youtube from '../../assets/logos/youtube.svg'
// import send from '../../assets/icons/send.svg'
// import accueil from "../../assets/icons/home-1-svgrepo-com.svg";
// import user_icon from "../../assets/icons/user-svgrepo-com.svg";
// import align_text from "../../assets/icons/align-text-left-svgrepo-com.svg";
// import create_even from "../../assets/icons/plus-circle-add-new-create-cross-svgrepo-com.svg";
// import calendrier from "../../assets/icons/calendar-days-svgrepo-com.svg";
// import setting from "../../assets/icons/setting-svgrepo-com.svg";
// import exit from "../../assets/icons/exit.svg";
// import menu from "../../assets/icons/menu.svg";


function Navbar() {

    const navigate = useNavigate()

    // Etat pour refuser l'autorisation a un element aux personnes qui ne sont pas connecter
    const token = localStorage.getItem('access')

    return(
        <nav className="z-50 fixed w-full h-15 text-white bg-black/50 flex justify-center items-center">
            <div className="w-full h-full flex justify-start items-center pl-10">
                <img className='h-15 h-15' src={logo} alt="Logo d'OtakuKamer" />
            </div>
            <ul className="w-full flex justify-start items-center gap-4 text-[14px] font-bold">
                <li><a onClick={() => navigate(`/accueil`)} href="#">Accueil</a></li>
                <li><a onClick={() => navigate(`/accueil`)} href="#">Événements</a></li>
                <li><a onClick={() => navigate(`/ListeNews`)} href="#">Actualités</a></li>
                <li><a onClick={() => navigate(`/about`)} href="#">À propos</a></li>
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