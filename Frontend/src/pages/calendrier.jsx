import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from "../components/shared/sidebar";
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

export default function Billets() {

    const [evenements, setEvenements] = useState([])
    const [enAttente, setEnAttente] = useState(false)
    // Pour pouvoir naviguer entre les pages
    const navigate = useNavigate()

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
                <div className='bg-[#C2611F]/10 w-[90%] h-90 flex flex-col justify-center items-center rounded-md'>
                    {/* REGROUPEMENT PAR MOIS */}
                    <div className='w-[95%] flex justify-start items-start gap-2 p-4 font-bold'>
                        <img className='h-6 w-6' src={calendrier} alt="Icon de la date de lancement" />
                        <p>
                            {/* AFFICHE UNIQUEMENT LE MOIS */}
                            {new Date(evenements.dateLancement).getMonth()}
                        </p>
                    </div>
                    {/* CHAQUE EVENEMENT FILTRER EN MAP */}
                    <div className='bg-[#C2611F]/20 w-[95%] h-20 flex justify-start items-center rounded-md p-4'>
                        <div className='flex justify-center items-start gap-2'>
                            <img className='h-6 w-6' src={calendrier} alt="Icon de la date de lancement" />
                            <p>
                                {new Date(evenements.map(evenement => evenement.dateLancement)).toLocaleDateString('fr-FR', {
                                    day: 'numeric', month: 'long'
                                })}
                            </p>
                        </div>
                        <div>
                            <h1>{evenements.titre}</h1>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}