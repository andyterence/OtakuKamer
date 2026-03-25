import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from "../components/shared/sidebar";
import Footer from "../components/shared/Footer";
import axios from 'axios'
// import info from '../assets/icons/info.svg'
import logo from '../assets/logos/OtakuKamer_logo.png'
import calendrier from "../assets/icons/calendar-days-svgrepo-com.svg";
// import ticket from '../assets/icons/ticket-check.svg'
// import download from '../assets/icons/download.svg'
// import qrcode from '../assets/icons/scan-qr-code.svg'
// import background from '../assets/imgs/background.jpg'
// import map from '../assets/icons/map-check.svg'

// import notif from '../../assets/icons/bell.svg'

export default function Calendrier() {

    
    const [evenements, setEvenements] = useState([])
    const [enAttente, setEnAttente] = useState(false)
    // Pour pouvoir naviguer entre les pages
    const navigate = useNavigate()

    // AFFICHAGE DU CALENDRIER PAR MOIS
    const evenementsParMois = evenements.reduce((groupes, evenement) => {
    const mois = new Date(evenement.dateLancement).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    if (!groupes[mois]) groupes[mois] = []
    groupes[mois].push(evenement)
    return groupes
    }, {})

    useEffect(() => {
        const chargerEvenements = async() => {
            setEnAttente(true)
            try {
                const token = localStorage.getItem('access')
                const reponse = await axios.get('http://localhost:8000/api/evenements/', {
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
            <section className="w-6/7 bg-gray-200 flex flex-col items-center">
            {/* TITRE ET SOUS TITRE DE BIENVENUE */}
                <div className='w-full flex flex-col justify-center items-start font-bold md:p-10'>
                    <h1 className='text-4xl'>Calendrier</h1>
                    <p className='text-md text-[#C2611F]'>Vue d'ensemble de vos événements</p>
                </div>
                {/* ECRAN DE CHARGEMENT LORS D'UNE REQUETE */}
                {enAttente && (
                    <div className="fixed inset-0 bg-[#0D0D0D] flex flex-col items-center justify-center z-50">
                        <img className='w-80 h-auto anime-flotter' src={logo} />
                        <p className="text-white text-lg">Chargement en cours...</p>
                    </div>
                )}
                {/* CONTENEUR GENERAL REGROUPANT LES EVENEMENTS PAR MOIS*/}
                {Object.entries(evenementsParMois).map(([mois, evenementsDuMois]) => (
                    <div key={mois} className='bg-[#C2611F]/10 w-[90%] flex flex-col gap-2 rounded-md p-4 mb-4'>
                        {/* TITRE DU MOIS */}
                        <div className='flex items-center gap-2 font-bold'>
                            <img className='h-6 w-6' src={calendrier} />
                            <p className='capitalize'>{mois}</p>
                        </div>
                        {/* EVENEMENTS DU MOIS */}
                        {evenementsDuMois.map(evenement => (
                            <div key={evenement.id} className='bg-[#C2611F]/20 flex justify-between items-center rounded-md p-4'>
                                <p className='bg-[#C2611F]/30 h-12 w-16 rounded-md shadow-[#C2611F]/30 shadow-md flex justify-center items-center'>{new Date(evenement.dateLancement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</p>
                                <h1 className='font-bold'>{evenement.titre}</h1>
                                <p  className='bg-[#C2611F]/30 h-8 w-40 rounded-md shadow-[#C2611F]/10 shadow-md flex justify-center items-center'>{evenement.statut}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </section>
        </div>
    )
}