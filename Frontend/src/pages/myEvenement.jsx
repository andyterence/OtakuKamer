import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../utils/api'
import formaterStatut from '../utils/formaterStatut'
import Sidebar from "../components/shared/sidebar";
import axios from 'axios'
import calendrier from "../assets/icons/calendar-days-svgrepo-com.svg";
import ticket from '../assets/icons/ticket-check.svg'
import gain from '../assets/icons/gain.svg'
import eye from '../assets/icons/eye.svg'
import map from '../assets/icons/map-check.svg'
import info from '../assets/icons/info.svg'
import pen from '../assets/icons/pen.svg'
import plus from '../assets/icons/badge-plus.svg'
import menu from '../assets/icons/menu.svg'

export default function MyEvenement() {

    const [evenements, setEvenements] = useState([])
    const [enAttente, setEnAttente] = useState(false)
    const [modalOuvert, setModalOuvert] = useState(false)
    const [messageConfirmation, setMessageConfirmation] = useState(false)
    const [evenementAnnuler, setEvenementAnnuler] = useState(null)
    const [menuOuvert, setMenuOuvert] = useState(false)
    // Nouveau state pour les stats de calcul
    const [stats, setStats] = useState({})
    // Pour pouvoir naviguer entre les pages
    const navigate = useNavigate()

    useEffect(() => {
        const chargerStats = async () => {
            const token = localStorage.getItem('access')
            // Pour chaque événement, on fait une requête stats
            for (const evenement of evenements) {
                try {
                    const reponse = await axios.get(
                        `${API_URL}/api/evenements/${evenement.id}/stats/`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                    // On ajoute les stats de cet événement dans le state
                    // en gardant les stats des autres événements déjà chargés
                    setStats(prev => ({
                        // Sans prev, chaque setStats écraserait les stats des événements précédents. prev représente l'état actuel du state
                        ...prev,
                        [evenement.id]: reponse.data
                    }))
                } catch (_err) {
                    console.error(_err)
                }
            }
        }
        // On attend que la liste soit chargée avant de charger les stats
        if (evenements.length > 0) {
            chargerStats()
        }
    }, [evenements])  // ← se déclenche quand evenements change

    // POUR ANNULER UN BILLET
    const annulerEvenement = async (evenementId) => {
        try {
                const token = localStorage.getItem('access')
                const reponse = await axios.patch(
                        `${API_URL}/api/evenements/${evenementId}/`,
                        { statut: 'annule' },
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                setEvenements(evenements.map(e => 
                    e.id === evenementId ? { ...e, statut: 'annule' } : e
                ))
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

    // POUR SUPPRIMER UN EVENEMENT DEJA ANNULER
    const supprimerEvenement = async (evenementsId) => {
        try {
                const token = localStorage.getItem('access')
                const reponse = await axios.delete(
                    `${API_URL}/api/evenements/${evenementsId}/`,
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
                const reponse = await axios.get(`${API_URL}/api/evenements/mes-evenements/`, {
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
            {/* SIDEBAR */}
            {menuOuvert && (
                <div 
                    className='md:hidden fixed inset-0 bg-black/50 z-30'
                    onClick={() => setMenuOuvert(false)}
                />
            )}
            <button 
                className='md:hidden fixed top-4 left-4 z-50'
                onClick={() => setMenuOuvert(!menuOuvert)}
            >
                <div className='flex justify-center items-center h-9 w-9 bg-black/70 rounded-md'>
                    <img className='h-6 w-6' src={menu} alt="Menu" />
                </div>
            </button>
            <aside className="md:w-1/7 w-0 md:sticky md:top-0 md:h-screen">
                <Sidebar menuOuvert={menuOuvert} setMenuOuvert={setMenuOuvert} />
            </aside>
            <section className="md:w-6/7 w-full">
            {/* TITRE ET SOUS TITRE DE BIENVENUE */}
                <div className='flex justify-center md:justify-between items-center gap-2 px-4 md:px-0'>
                    <div className='md:w-full flex flex-col justify-center items-start font-bold py-8 md:p-10 pr-0'>
                        <h1 className='text-2xl md:text-4xl'>Mes Événements</h1>
                        <p className='text-sm md:text-md text-[#C2611F]'>Gérez et suivez vos événements</p>
                    </div>
                    <div className=' flex justify-center items-center md:px-8'>
                        <button onClick={() => navigate('/createEven')} className='flex justify-center items-center text-md bg-[#C2611F]/80 w-45 h-10 rounded-md hover:bg-[#C2611F] cursor-pointer transition-all duration-300'>
                            <img className='h-6 w-6' src={plus} alt="Logo du calendrier" />
                            <p className='text-white text-[14px] px-2'>Creer un événement</p>
                        </button>
                    </div>
                </div>
                {/* CONTENEUR DE GESTION DES EVENEMENTS */}
                <div className='flex flex-col md:flex-row justify-evenly items-center gap-5 md:gap-0 font-bold'>
                    {/*Total Événements */}
                    <div className='flex flex-col justify-evenly items-start w-70 h-40 rounded-xl border-1 border-[#C2611F] py-4 px-8'>
                        <div><img className='h-7 w-7' src={calendrier} alt="Logo du calendrier" /></div>
                        <div>{evenements.length}</div>
                        <div>Total Événements</div>
                    </div>
                    {/* Nombre Billets Vendus */}
                    <div className='flex flex-col justify-evenly items-start w-70 h-40 rounded-xl border-1 border-[#C2611F] py-4 px-8'>
                        <div><img className='h-7 w-7' src={ticket} alt="Logo du ticket" /></div>
                        <div>{Object.values(stats).reduce((total, s) => total + (s.billets_vendus ?? 0), 0)}</div>
                        <div>Billets Vendus</div>
                    </div>
                    {/* Revenus (FCFA) */}
                    <div className='flex flex-col justify-evenly items-start w-70 h-40 rounded-xl border-1 border-[#C2611F] py-4 px-8'>
                        <div><img className='h-7 w-7' src={gain} alt="Logo de l'information" /></div>
                        <div>{Object.values(stats).reduce((total, s) => total + parseFloat(s.revenus ?? 0), 0).toFixed(0)} FCFA</div>
                        <div>Revenus (FCFA)</div>
                    </div>
                    {/* Événements Actifs */}
                    <div className='flex flex-col justify-evenly items-start w-70 h-40 rounded-xl border-1 border-[#C2611F] py-4 px-8'>
                        <div><img className='h-7 w-7' src={eye} alt="Logo de l'information" /></div>
                        <div>{evenements.filter(e => e.statut === 'en_cours' || e.statut === 'en_preparation').length}</div>
                        <div>Événements Actifs</div>
                    </div>
                </div>
                {/* PRESENTATION DES CARTES EVENEMENTS */}
                <div className='md:flex flex-col justify-center items-center gap-10 md:my-10 p-5 rounded-xl'>
                    {evenements.length === 0 
                        ? <p className=' font-bold'>Vous n'avez aucun événement enregistrer</p>
                        : evenements.map(evenement => (
                            <div 
                                key={evenement.id}
                                className='animate__animated animate__zoomInDown relative card h-full md:h-75 w-full md:w-[95%] flex flex-col md:flex-row justify-center md:justify-start items-center gap-4 rounded-xl border-2 border-[#C2611F] font-bold bg-cover bg-center transition-all duration-300 hover:shadow-sm shadow-indigo-500/50 hover:bg-[#C2611F]/10 p-4 my-4'>
                                {/* BACKGROUND DE L'EVENEMENT */}
                                <div className='relative w-1/3 h-full rounded-xl bg-cover bg-center'
                                    style={{ backgroundImage: `url(${evenement?.image})` }}>
                                {/* OVERLAY SI ANNULE */}
                                {evenement.statut === 'annule' && (
                                    <div className='absolute inset-0 bg-black/70 rounded-xl flex justify-center items-center'>
                                        <p className='text-red-500 font-bold text-xl'>Annulé</p>
                                    </div>
                                )}
                                
                                {/* OVERLAY SI TERMINE */}
                                {evenement.statut === 'termine' && (
                                    <div className='absolute inset-0 bg-black/70 rounded-xl flex justify-center items-center'>
                                        <p className='text-gray-400 font-bold text-xl'>termine</p>
                                    </div>
                                )}
                                </div>
                                {/* Detail de l'evenement */}
                                <div className='w-full md:w-2/3 h-full flex flex-col justify-evenly items-start gap-4'>
                                    <div className='w-full h-full justify-evenly flex items-start gap-2'>
                                        <div className='w-full h-full text-[12px] justify-evenly flex flex-col items-start gap-2'>
                                            <p className='text-2xl'>{evenement?.titre}</p>
                                            <p className='text-md text-[#C2611F]'>
                                                {evenement?.description?.slice(0, 100)}
                                                {evenement?.description?.length > 100 ? '...' : ''}
                                            </p>
                                            {/* <p>{evenement?.organisateur?.first_name} {evenement?.organisateur?.last_name}</p> */}
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
                                                    <p>{formaterStatut(evenement?.statut)}</p>
                                                </div>
                                                {/* <p>{evenement?.prix} FCFA</p> */}
                                            </div>
                                            <div className='w-full flex justify-center items-center'>
                                                {/* CAONTENEUR DES STATISTIQUES */}
                                                <div className='bg-[#C2611F]/50 text-[#F1F1F1] w-[99%] h-20 rounded-md flex justify-start items-center'>
                                                    {/* BILLET VENDU */}
                                                    <div className='w-1/2 flex flex-col justify-center items-center'>
                                                        <p className='text-black'>Billets vendus</p>
                                                        <p className='text-xl'>
                                                            {stats[evenement.id]?.billets_vendus ?? 0}
                                                            /
                                                            {stats[evenement.id]?.total_places ?? 0}
                                                        </p>
                                                        {/* BARRE DE REMPLISSAGE — calcul dynamique du pourcentage */}
                                                        <div className='border-1 border-[#C2611F] w-[90%] h-[6px] rounded-md'>
                                                            <div 
                                                                className='bg-[#C2611F] h-full rounded-md transition-all'
                                                                style={{ 
                                                                    width: `${stats[evenement.id]?.total_places 
                                                                        ? (stats[evenement.id].billets_vendus / stats[evenement.id].total_places * 100) 
                                                                        : 0}%` 
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* REVENUS */}
                                                    <div className='w-1/2 flex flex-col justify-center items-center'>
                                                        <p className='text-black'>Revenus</p>
                                                        <p className='text-xl text-green-800'>
                                                            {/* Le ?? est le nullish coalescing operator il retourne 0 si la valeur est null ou undefined, ce qui évite d'afficher undefined pendant le chargement. */}
                                                            {stats[evenement.id]?.revenus ?? 0} FCFA
                                                        </p>
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
                                                {(evenement.statut === 'en_preparation' || evenement.statut === 'en_cours') && (
                                                    <button 
                                                        className='flex justify-center items-center gap-1 text-md bg-red-600 w-25 h-10 rounded-md hover:bg-red-800 cursor-pointer transition-all duration-300'
                                                        onClick={() => {
                                                        setEvenementAnnuler(evenement.id) 
                                                        setModalOuvert(true)
                                                    }}>
                                                        Annuler
                                                    </button>
                                                )}
                                                {/* Supprimer — visible seulement si annulé */}
                                                {(evenement.statut === 'annule' || evenement.statut === 'termine') && (
                                                    <button 
                                                        className='flex justify-center items-center gap-1 text-md bg-red-600 w-25 h-10 rounded-md hover:bg-red-800 cursor-pointer transition-all duration-300'
                                                        onClick={() => supprimerEvenement(evenement.id)}
                                                    >
                                                        Supprimer
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>
            {/* MODAL DE CONFIRMATION */}
            {modalOuvert && (
                <div className='fixed inset-0 bg-black/60 z-50 flex justify-center items-center'>
                    <div className='bg-white rounded-xl p-8 w-96 flex flex-col gap-6'>
                        <h2 className='text-xl font-bold'>Confirmer l'annulation</h2>
                        <p className='text-gray-600'>Cette action est irréversible.</p>
                        <div className='flex gap-4'>
                            {/* Ferme le modal sans rien faire */}
                            <button 
                                onClick={() => setModalOuvert(false)}
                                className='w-1/2 py-3 border border-gray-300 rounded-xl'
                            >
                                Retour
                            </button>
                            {/* Confirme l'annulation */}
                            <button 
                                onClick={async () => {
                                    await annulerEvenement(evenementAnnuler)
                                    setModalOuvert(false)
                                    setMessageConfirmation(true)
                                    setTimeout(() => setMessageConfirmation(false), 2000)
                                }}
                                className='w-1/2 py-3 bg-red-500 text-white rounded-xl'
                            >
                                Confirmer l'annulation
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* MESSAGE DE CONFIRMATION */}
            {messageConfirmation && (
                <div className='fixed inset-0 z-50 flex justify-center items-start md:pt-10'>
                    <div className='bg-white/40 rounded-xl p-8 w-96 flex flex-col justify-center items-center gap-6'>
                        <h2 className='text-xl font-bold text-green-800'>Votre événement a bien été annulé</h2>
                    </div>
                </div>
            )}
        </div>
    )
}