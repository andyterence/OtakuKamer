import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../utils/api'
import formaterStatut from '../utils/formaterStatut'
import Sidebar from "../components/shared/sidebar";
import axios from 'axios'
import logo from '../assets/logos/OtakuKamer_logo.png'
import calendrier from "../assets/icons/calendar-days-svgrepo-com.svg";

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
                const reponse = await axios.get(`${API_URL}/api/evenements/`, {
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
            <section className="w-6/7 flex flex-col items-center">
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
                    <div key={mois} className='bg-[#C2611F]/10 w-[80%] flex flex-col gap-2 rounded-md p-4 mb-4'>
                        {/* TITRE DU MOIS */}
                        <div className='flex items-center gap-2 font-bold'>
                            <img className='h-6 w-6' src={calendrier} />
                            <p className='capitalize'>{mois}</p>
                        </div>
                        {/* EVENEMENTS DU MOIS */}
                        {evenementsDuMois.map(evenement => (
                            <div key={evenement.id} className='bg-[#C2611F]/20 flex justify-between items-center rounded-md p-4'>
                                <p className='h-12 w-16 rounded-md shadow-[#C2611F]/20 shadow-md flex justify-center items-center'>{new Date(evenement.dateLancement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</p>
                                <h1 className='font-bold'>{evenement.titre}</h1>
                                <p  className='h-8 w-40 rounded-md shadow-[#C2611F]/20 shadow-md flex justify-center items-center'>{formaterStatut(evenement?.statut)}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </section>
        </div>
    )
}