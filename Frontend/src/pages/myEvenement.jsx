import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from "../components/shared/sidebar";
import axios from 'axios'
// import { QRCodeCanvas } from 'qrcode.react'
import logo from '../assets/logos/OtakuKamer_logo.png'
import calendrier from "../assets/icons/calendar-days-svgrepo-com.svg";
import ticket from '../assets/icons/ticket-check.svg'
import gain from '../assets/icons/gain.svg'
import eye from '../assets/icons/eye.svg'
import map from '../assets/icons/map-check.svg'
import info from '../assets/icons/info.svg'
import pen from '../assets/icons/pen.svg'
import trash from '../assets/icons/trash.svg'
import plus from '../assets/icons/badge-plus.svg'

// import qrcode from '../assets/icons/scan-qr-code.svg'
// import background from '../assets/imgs/background.jpg'
// import notif from '../../assets/icons/bell.svg'
// import download from '../assets/icons/download.svg'

export default function MyEvenement() {

    const [evenements, setEvenements] = useState([])
    const [enAttente, setEnAttente] = useState(false)
    // UseState qui va se charger de la liste des billets selon le type
    // const [billets, setbillets] = useState([])
    // Pour pouvoir naviguer entre les pages
    const navigate = useNavigate()

    // POUR SUPPRIMER UN EVENEMENT DEJA ANNULER
    const supprimerEvenement = async (evenementsId) => {
        try {
                const token = localStorage.getItem('access')
                const reponse = await axios.delete(
                    `http://localhost:8000/api/evenements/${evenementsId}/`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                setEvenements(evenements.filter(e => e.id !== evenementsId))
            } catch (_err) {
                if (_err.response?.status === 401) {
                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
                navigate('/login')
            }
                console.error(_err)
            } finally {
                setEnAttente(false)
        }
    }

    useEffect(() => {
        const chargerEvenements = async() => {
            setEnAttente(true)
            try {
                const token = localStorage.getItem('access')
                const reponse = await axios.get('http://localhost:8000/api/evenements/mes-evenements/', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setEvenements(reponse.data)
            } catch (_err) {
                if (_err.response?.status === 401) {
                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
                navigate('/login')
            }
                console.error(_err)
            } finally {
                setEnAttente(false)
            }
        }
        chargerEvenements()
    }, [])

    return (
        <div className='flex'>
            <aside className="w-1/7 sticky top-0 h-screen">
                <Sidebar />
            </aside>
            <section className="w-6/7 bg-gray-200">
            {/* TITRE ET SOUS TITRE DE BIENVENUE */}
                <div className='flex justify-between items-center'>
                    <div className='w-full flex flex-col justify-center items-start font-bold md:p-10'>
                        <h1 className='text-4xl'>Mes Événements</h1>
                        <p className='text-md text-[#C2611F]'>Gérez et suivez vos événements</p>
                    </div>
                    <div className='pr-10 flex justify-center items-center'>
                        <button onClick={() => navigate('/createEven')} className='flex justify-center items-center text-md bg-[#C2611F]/80 w-45 h-10 rounded-md hover:bg-[#C2611F] cursor-pointer transition-all duration-300'>
                            <img className='h-6 w-6' src={plus} alt="Logo du calendrier" />
                            <p className='text-white text-[14px] px-1'>Creer un événement</p>
                        </button>
                    </div>
                </div>
                {/* CONTENEUR DE GESTION DES EVENEMENTS */}
                <div className='flex justify-evenly items-center font-bold'>
                    {/*Total Événements */}
                    <div className='flex flex-col justify-evenly items-start w-70 h-40 rounded-xl border-1 border-[#C2611F] py-4 px-8'>
                        <div><img className='h-7 w-7' src={calendrier} alt="Logo du calendrier" /></div>
                        <div>{evenements.length}</div>
                        <div>Total Événements</div>
                    </div>
                    {/* Nombre Billets Vendus */}
                    <div className='flex flex-col justify-evenly items-start w-70 h-40 rounded-xl border-1 border-[#C2611F] py-4 px-8'>
                        <div><img className='h-7 w-7' src={ticket} alt="Logo du ticket" /></div>
                        <div>0</div>
                        <div>Billets Vendus</div>
                    </div>
                    {/* Revenus (FCFA) */}
                    <div className='flex flex-col justify-evenly items-start w-70 h-40 rounded-xl border-1 border-[#C2611F] py-4 px-8'>
                        <div><img className='h-7 w-7' src={gain} alt="Logo de l'information" /></div>
                        <div>{evenements.reduce((total, e) => total + parseFloat(e.prix), 0).toFixed(0)} FCFA</div>
                        <div>Revenus (FCFA)</div>
                    </div>
                    {/* Événements Actifs */}
                    <div className='flex flex-col justify-evenly items-start w-70 h-40 rounded-xl border-1 border-[#C2611F] py-4 px-8'>
                        <div><img className='h-7 w-7' src={eye} alt="Logo de l'information" /></div>
                        <div>{evenements.filter(e => e.statut === 'en_cours' || e.statut === 'en_preparation').length}</div>
                        <div>Événements Actifs</div>
                    </div>
                </div>
                {/* ECRAN DE CHARGEMENT LORS D'UNE REQUETE */}
                {enAttente && (
                    <div className="fixed inset-0 bg-[#0D0D0D] flex flex-col items-center justify-center z-50">
                        <img className='w-80 h-auto anime-flotter' src={logo} />
                        <p className="text-white text-lg">Chargement en cours...</p>
                    </div>
                )}
                {/* PRESENTATION DES CARTES EVENEMENTS */}
                <div className='md:flex flex-col justify-center items-center gap-10 my-10 rounded-xl'>
                    {evenements.length === 0 
                        ? <p className=' font-bold'>Vous n'avez aucun événement enregistrer</p>
                        : evenements.map(evenement => (
                            <div 
                                key={evenement.id}
                                className='animate__animated animate__zoomInDown relative card h-90 md:h-75 md:w-[95%] flex flex-col md:flex-row justify-start items-center gap-4 border-1 border-[#C2611F] rounded-xl border-2 border-[#C2611F] font-bold bg-cover bg-center transition-all duration-300 hover:shadow-sm shadow-indigo-500/50 hover:bg-[#C2611F]/10 p-4'>
                                {/* BACKGROUND DE L'EVENEMENT */}
                                <div className='w-1/3 h-full rounded-xl bg-cover bg-center'
                                    style={{ backgroundImage: `url(${evenement?.image})` }}>
                                {/* OVERLAY SI UTILISE */}
                                {evenement.statut === 'utilise' && (
                                    <div className='absolute inset-0 bg-black/70 rounded-xl flex justify-center items-center'>
                                        <p className='text-gray-400 font-bold text-xl'>Utilisé</p>
                                    </div>
                                )}
                                </div>
                                {/* Detail de l'evenement */}
                                <div className='w-2/3 h-full flex flex-col justify-evenly items-start gap-4'>
                                    <div className='w-full h-full justify-evenly flex items-start gap-2'>
                                        <div className='w-full h-full text-[12px] justify-evenly flex flex-col items-start gap-2'>
                                            <p className='text-2xl'>{evenement?.titre}</p>
                                            <p className='text-md text-[#C2611F]'>
                                                {evenement?.description?.slice(0, 100)}
                                                {evenement?.description?.length > 100 ? '...' : ''}
                                            </p>
                                            <p>{evenement?.organisateur?.first_name} {evenement?.organisateur?.last_name}</p>
                                            <div className='w-full flex justify-start items-center gap-1'>
                                                <div className='w-1/2 flex justify-start items-center gap-1'>
                                                    <img className='h-4 w-4' src={calendrier} alt="Logo du calendrier" />
                                                    <p>
                                                        {new Date(evenement?.dateLancement).toLocaleDateString('fr-FR', {
                                                        day: 'numeric', month: 'long', year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className='w-1/2 flex justify-start items-center gap-1'>
                                                    <img className='h-4 w-4' src={map} alt="Logo de la localisation" />
                                                    <p>{evenement?.lieu}</p>
                                                </div>
                                            </div>
                                            <div className='w-full flex justify-start items-center gap-1'>
                                                <div className='w-1/2 flex justify-start items-center gap-1'>
                                                    <img className='h-4 w-4' src={pen} alt="Logo du calendrier" />
                                                    <p>{evenement?.typeEven}</p>
                                                </div>
                                                <div className='w-1/2 flex justify-start items-center gap-1'>
                                                    <img className='h-4 w-4' src={info} alt="Logo du calendrier" />
                                                    <p>{evenement?.statut}</p>
                                                </div>
                                                {/* <p>{evenement?.prix} FCFA</p> */}
                                            </div>
                                            <div className='w-full flex justify-center items-center'>
                                                {/* CAONTENEUR DES STATISTIQUES */}
                                                <div className='bg-[#C2611F]/50 text-[#F1F1F1] w-[99%] h-20 rounded-md flex justify-start items-center'>
                                                    {/* BILLET VENDU */}
                                                    <div className='w-1/2 flex flex-col justify-center items-center'>
                                                        <p className='text-black'>Billets vendus</p>
                                                        <p className='text-xl'>234/500</p>
                                                        {/* BARRE DE REMPLISSAGE */}
                                                        <div className='border-1 border-[#C2611F] w-[90%] h-[6px] rounded-md'>
                                                            <div className='bg-[#C2611F] w-[60%] h-full'></div>
                                                        </div>
                                                    </div>
                                                    {/* REVENUS */}
                                                    <div className='w-1/2 flex flex-col justify-center items-center'>
                                                        <p className='text-black'>Revenus</p>
                                                        <p className='text-xl text-green-800'>FCFA</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex justify-start items-center gap-2 text-[#F1F1F1]'>
                                                <button onClick={() => navigate(`/evenement/${evenement.id}`)} className='flex justify-center items-center gap-1 text-md bg-gray-600 w-25 h-10 rounded-md hover:bg-gray-800 cursor-pointer transition-all duration-300'>
                                                    <img className='h-4 w-4' src={eye} alt="Logo du calendrier" />
                                                    voir
                                                </button>
                                                <button onClick={() => navigate(`/modifierEvenement/${evenement.id}`)} className='flex justify-center items-center gap-1 text-md bg-[#C2611F]/80 w-25 h-10 rounded-md hover:bg-[#C2611F] cursor-pointer transition-all duration-300'>
                                                    <img className='h-4 w-4' src={pen} alt="Logo du calendrier" />
                                                    Modifier
                                                </button>
                                                <button onClick={() => supprimerEvenement(evenement.id)} className='flex justify-center items-center gap-1 text-md bg-red-500 w-25 h-10 rounded-md hover:bg-red-600 cursor-pointer transition-all duration-300'>
                                                    <img className='h-4 w-4' src={trash} alt="Logo du calendrier" />
                                                    Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>
        </div>
    )
}