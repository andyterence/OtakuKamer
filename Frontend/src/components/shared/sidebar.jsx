import { useState, useEffect } from "react";
import logo2 from '../../assets/logos/logo-orange.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import accueil from "../../assets/icons/home-1-svgrepo-com.svg";
import user_icon from "../../assets/icons/user-svgrepo-com.svg";
import align_text from "../../assets/icons/align-text-left-svgrepo-com.svg";
import create_even from "../../assets/icons/plus-circle-add-new-create-cross-svgrepo-com.svg";
import calendrier from "../../assets/icons/calendar-days-svgrepo-com.svg";
import setting from "../../assets/icons/setting-svgrepo-com.svg";
import exit from "../../assets/icons/exit.svg";
import avatar_orga from "../../assets/icons/avatar-orga.svg";


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
        <div className="bg-[#1A1A2E] border-r border-purple-900 flex flex-col justify-start w-full h-screen md:p-4 text-[#F1F1F1]">
            {utilisateur?.role === 'organisateur' ? (
                <>
                    <div className="flex flex-col justify-center items-start font-bold gap-2">
                        <h2 className="text-2xl">OtakuKamer</h2>
                        <p className="text-[12px] text-[#9CA3AF]">Organisateur</p>
                    </div>
                    <div className="w-full h-[1px] bg-purple-900 my-2"></div>
                    <div className="flex justify-start items-center gap-2 my-2">
                        <div className="bg-violet-500 w-16 h-16 rounded-full flex justify-center items-center"><img className='h-8 w-8' src={user_icon} alt="Icon d'utilisateur" /></div>
                        <div>
                            <h2>{utilisateur?.name}</h2>
                            <p className="text-[12px] text-[#9CA3AF]">Compte Pro</p>
                        </div>
                    </div>
                    <div  className="w-full h-full flex flex-col justify-center items-start text-[13px] font-bold gap-4">
                        <div className="w-full h-[1px] bg-gray-700 my-2"></div>
                        <div className="flex justify-start items-center h-[6vh] w-[80%] rounded-sm hover:bg-linear-to-r from-purple-600 to-blue-500 hover:px-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-indigo-500/50 gap-2">
                            <img className='h-5 w-5 md:h-7 md:w-7' src={accueil} alt="Logo d'accueil" />
                            <a href="#">Accueil</a>
                            {/* <img className='h-10 h-10' src={arrow_left} alt="Logo d'OtakuKamer" /> */}
                        </div>
                        <div className="flex justify-start items-center h-[6vh] w-[80%] rounded-sm hover:bg-linear-to-r from-purple-600 to-blue-500 hover:px-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-indigo-500/50 gap-2">
                            <img className='h-5 w-5 md:h-7 md:w-7' src={align_text} alt="Logo des evenements" />
                            <a href="#">Mes Événement</a>
                        </div>
                        <div className="flex justify-start items-center h-[6vh] w-[80%] rounded-sm hover:bg-linear-to-r from-purple-600 to-blue-500 hover:px-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-indigo-500/50 gap-2">
                            <img className='h-5 w-5 md:h-7 md:w-7' src={create_even} alt="Logo pour creer un evenement" />
                            <a href="#">Créer un Événement</a>
                        </div>
                        <div className="flex justify-start items-center h-[6vh] w-[80%] rounded-sm hover:bg-linear-to-r from-purple-600 to-blue-500 hover:px-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-indigo-500/50 gap-2">
                            <img className='h-5 w-5 md:h-7 md:w-7' src={calendrier} alt="Logo pour creer un evenement" />
                            <a href="#">Calendrier</a>
                        </div>
                        <div className="flex justify-start items-center h-[6vh] w-[80%] rounded-sm hover:bg-linear-to-r from-purple-600 to-blue-500 hover:px-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-indigo-500/50 gap-2">
                            <img className='h-5 w-5 md:h-7 md:w-7' src={setting} alt="Logo pour creer un evenement" />
                            <a href="#">Paramètres</a>
                        </div>
                    </div>
                    <div className="w-full h-full flex flex-col justify-end items-center text-[14px] gap-3 md:mt-0">
                        <div className="w-full h-[1px] bg-gray-700 my-2"></div>
                        <div className="flex justify-start items-center h-[6vh] w-[80%] rounded-sm bg-linear-to-r from-purple-600 to-blue-500 px-2 hover:px-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-indigo-500/50 gap-2">
                            <img className='h-5 w-5 md:h-7 md:w-7' src={avatar_orga} alt="Logo d'utilisateur" />
                            <p>Mode utilisateur</p>
                        </div>
                        <div className="flex justify-start items-center h-[6vh] w-[80%] rounded-sm hover:bg-linear-to-r from-red-900 to-pink-900 px-2 hover:px-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-indigo-500/50 gap-2">
                            <img className='h-5 w-5 md:h-7 md:w-7' src={exit} alt="Logo pour creer un evenement" />
                            <button onClick={seDeconnecter}>Deconnexion</button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex flex-col justify-center items-start font-bold gap-2">
                        <h2 className="text-2xl">OtakuKamer</h2>
                        <p className="text-[12px] text-[#9CA3AF]">Utilisateur</p>
                    </div>
                    <div className="w-full h-[1px] bg-purple-900 my-2"></div>
                    <div className="flex justify-start items-center gap-2 mt-7">
                        <div className="bg-violet-500 w-16 h-16 rounded-full flex justify-center items-center"><img className='h-8 w-8' src={user_icon} alt="Icon d'utilisateur" /></div>
                        <div>
                            <h2>{utilisateur?.name}</h2>
                            <p className="text-[12px] text-[#9CA3AF]">Membre</p>
                        </div>
                    </div>
                    <div  className="w-full h-full flex flex-col justify-center items-start text-[13px] font-bold gap-4">
                        <div className="w-full h-[1px] bg-purple-900 my-2"></div>
                        <div className="flex justify-start items-center h-[6vh] w-[80%] rounded-sm hover:bg-linear-to-r from-purple-600 to-blue-500 hover:px-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-indigo-500/50 gap-2">
                            <img className='h-5 w-5 md:h-7 md:w-7' src={accueil} alt="Logo d'accueil" />
                            <a href="#">Accueil</a>
                            {/* <img className='h-10 h-10' src={arrow_left} alt="Logo d'OtakuKamer" /> */}
                        </div>
                        <div className="flex justify-start items-center h-[6vh] w-[80%] rounded-sm hover:bg-linear-to-r from-purple-600 to-blue-500 hover:px-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-indigo-500/50 gap-2">
                            <img className='h-5 w-5 md:h-7 md:w-7' src={align_text} alt="Logo des evenements" />
                            <a href="#">Mes Billets</a>
                        </div>
                        <div className="flex justify-start items-center h-[6vh] w-[80%] rounded-sm hover:bg-linear-to-r from-purple-600 to-blue-500 hover:px-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-indigo-500/50 gap-2">
                            <img className='h-5 w-5 md:h-7 md:w-7' src={setting} alt="Logo pour creer un evenement" />
                            <a href="#">Paramètres</a>
                        </div>
                    </div>
                    <div className="w-full h-full flex flex-col justify-end items-center text-[14px] font-bold gap-3 md:mt-0">
                        <div className="w-full h-[1px] bg-purple-900 my-2"></div>
                        <div className="flex justify-start items-center h-[6vh] w-[80%] rounded-sm hover:bg-linear-to-r from-red-900 to-pink-900 px-2 hover:px-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-indigo-500/50 gap-2">
                            <img className='h-5 w-5 md:h-7 md:w-7' src={exit} alt="Logo pour creer un evenement" />
                            <button onClick={seDeconnecter}>Deconnexion</button>
                        </div>
                    </div>
                </>
            )}
            
        </div>
    )
}

export default Sidebar