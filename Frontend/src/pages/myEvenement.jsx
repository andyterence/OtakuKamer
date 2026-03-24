import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from "../components/shared/sidebar";
import axios from 'axios'
// import { QRCodeCanvas } from 'qrcode.react'
// import info from '../assets/icons/info.svg'
import logo from '../assets/logos/OtakuKamer_logo.png'
import calendrier from "../assets/icons/calendar-days-svgrepo-com.svg";
import ticket from '../assets/icons/ticket-check.svg'
// import download from '../assets/icons/download.svg'
import gain from '../assets/icons/gain.svg'
import eye from '../assets/icons/eye.svg'
// import qrcode from '../assets/icons/scan-qr-code.svg'
// import background from '../assets/imgs/background.jpg'
// import map from '../assets/icons/map-check.svg'

// import notif from '../../assets/icons/bell.svg'

export default function MyEvenement() {

    const [evenements, setEvenements] = useState([])
    const [enAttente, setEnAttente] = useState(false)
    // UseState qui va se charger de la liste des billets selon le type
    // const [billets, setbillets] = useState([])
    // Pour pouvoir naviguer entre les pages
    const navigate = useNavigate()

    // POUR ANNULER UN EVENEMENT
    const annulerEvenement = async (evenementsId) => {
        try {
                const token = localStorage.getItem('access')
                const reponse = await axios.put(
                        `http://localhost:8000/api/evenements/${evenementsId}/`,
                        { statut: 'annule' },
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                setEvenements(evenements.map(e => 
                    e.id === evenementsId ? { ...e, statut: 'annule' } : e
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
                <div className='flex flex-col justify-center items-start font-bold md:p-10'>
                    <h1 className='text-4xl'>Mes Événements</h1>
                    <p className='text-md text-[#C2611F]'>Gérez et suivez vos événements</p>
                </div>
                {/* CONTENEUR DE GESTION DES EVENEMENTS */}
                <div className='flex justify-evenly items-center font-bold'>
                    {/*Total Événements */}
                    <div className='flex flex-col justify-evenly items-start w-70 h-40 rounded-xl bg-[#C2611F]/30 py-4 px-8'>
                        <div><img className='h-7 w-7' src={calendrier} alt="Logo du calendrier" /></div>
                        <div>{evenements.length}</div>
                        <div>Total Événements</div>
                    </div>
                    {/* Nombre Billets Vendus */}
                    <div className='flex flex-col justify-evenly items-start w-70 h-40 rounded-xl bg-[#C2611F]/30 py-4 px-8'>
                        <div><img className='h-7 w-7' src={ticket} alt="Logo du ticket" /></div>
                        <div>{evenements.length}</div>
                        <div>Billets Vendus</div>
                    </div>
                    {/* Revenus (FCFA) */}
                    <div className='flex flex-col justify-evenly items-start w-70 h-40 rounded-xl bg-[#C2611F]/30 py-4 px-8'>
                        <div><img className='h-7 w-7' src={gain} alt="Logo de l'information" /></div>
                        <div>{evenements.length}</div>
                        <div>Revenus (FCFA)</div>
                    </div>
                    {/* Événements Actifs */}
                    <div className='flex flex-col justify-evenly items-start w-70 h-40 rounded-xl bg-[#C2611F]/30 py-4 px-8'>
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
                                className='relative card h-90 md:h-65 md:w-[82%] flex flex-col md:flex-row justify-start items-center gap-4 bg-[#C2611F]/40 rounded-xl border-2 border-[#C2611F] font-bold bg-cover bg-center transition-all duration-300 hover:shadow-sm shadow-indigo-500/50 hover:bg-[#C2611F]/50 p-4'>
                                {/* BACKGROUND DE L'EVENEMENT */}
                                <div className='w-1/3 h-full rounded-xl bg-cover bg-center'
                                    style={{ backgroundImage: `url(${evenement?.image})` }}>
                                {/* OVERLAY SI ANNULE */}
                                {evenement.statut === 'annule' && (
                                    <div className='absolute inset-0 bg-black/70 rounded-xl flex justify-center items-center'>
                                        <p className='text-red-500 font-bold text-xl'>Annulé</p>
                                    </div>
                                )}
                                {/* Annuler visible si pas encore annulé */}
                                {evenement.statut !== 'annule' && (
                                    <button onClick={() => annulerEvenement(evenement.id)}>Annuler</button>
                                )}
                                {evenement.statut === 'annule' && (
                                    <button onClick={() => supprimerEvenement(evenement.id)}>Supprimer</button>
                                )}
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
                                            <p>{evenement?.titre}</p>
                                            <p>{evenement?.organisateur?.first_name} {evenement?.organisateur?.last_name}</p>
                                            <p>
                                                {new Date(evenement?.dateLancement).toLocaleDateString('fr-FR', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </p>
                                            <p>{evenement?.typeEven}</p>
                                            <p>{evenement?.prix} FCFA</p>
                                            <p>{evenement?.statut}</p>
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