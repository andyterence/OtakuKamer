import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import background from '../../assets/imgs/background.jpg'
import localisation from '../../assets/icons/map.svg'
import notif from '../../assets/icons/bell.svg'

export default function Hero() {

    // UseState qui va se charger de la liste des evenements selon le type
    const [evenements, setEvenements] = useState([])
    // Pour pouvoir naviguer entre les pages
    const navigate = useNavigate()
    const [enAttente, setEnAttente] = useState(false)
    const [evenementsVedettes, setEvenementsVedettes] = useState(null)
    const [evenementTermine, setEvenementTermine] = useState(false)
    const [compteRebours, setCompteRebours] = useState({
        mois: 0, jours: 0, heures: 0, minutes: 0, secondes: 0
    })

    useEffect(() => {
        const chargerVedette = async() => {
            setEnAttente(true)
            try {
                const reponse = await axios.get('http://localhost:8000/api/evenements/vedette/')
                setEvenementsVedettes(reponse.data)
            } catch (_err) {
                console.error(_err)
            } finally {
                setEnAttente(false)
            }
        }
        chargerVedette()
    },[])

    useEffect(() => {
        if (!evenementsVedettes) return

        const interval = setInterval(() => {
        const maintenant = new Date()
        const dateLancement = new Date(evenementsVedettes.dateLancement)
        const difference = dateLancement - maintenant

        if (difference <= 0) {          
            clearInterval(interval)
            setEvenementTermine(true)
            return
        }

        const mois = Math.floor(difference / (1000 * 60 * 60 * 24 * 30))
        const jours = Math.floor((difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24))
        const heures = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const secondes = Math.floor((difference % (1000 * 60)) / 1000)

        setCompteRebours({ mois, jours, heures, minutes, secondes })
    }, 1000)           

        return () => clearInterval(interval)
        }, [evenementsVedettes])

    return (
        <div className="relative h-[80vh] md:h-[100vh] w-full flex md:flex-row items-center bg-cover-center p-10 md:p-40"
            style={{ backgroundImage: `url(${background})` }}>
            {/* Overlay sombre */}
            <div className="absolute inset-0 bg-black/70"></div>
            {/* SECTION DE GAUCHE - INFORMATION SUR L'EVENEMENT MAJEUR */}
            <section className='animate__animated animate__fadeInDown animate__slow w-full md:w-1/2 flex flex-col justify-center gap-12 md:gap-10 p-2 z-10'>
                <div className='w-50 md:h-7 flex justify-center items-center font-bold text-[#C2611F] text-[12px] border border-orange-500 bg-black/30 px-6 py-2 rounded-full'>
                    <p>Événement à venir</p>
                </div>
                <div>
                    <div className='font-bold'>
                        <h1 className='w-[50%] text-4xl md:text-6xl font-bold text-[#F1F1F1]'>{evenementsVedettes?.titre}</h1>
                    </div>
                    <div className='font-bold md:text-[#F1F1F1] text-[#C2611F]'>
                        {evenementsVedettes?.description?.slice(0, 100)}
                        {evenementsVedettes?.description?.length > 100 ? '...' : ''}
                    </div>
                </div>
                <div className='w-full font-bold flex md:justify-start items-center gap-3'>
                    <a
                        onClick={() => navigate(`/evenements/${evenements.id}`)}
                        className='bg-[#C2611F] text-[10px] md:text-[12px] text-[#F1F1F1] px-4 md:px-4 py-4 md:py-3 rounded-xl font-bold cursor-pointer hover:shadow-sm shadow-black-500/50 hover:opacity-95 transition'>
                        RÉSERVER MA PLACE
                    </a>
                    <a
                        href='#'
                        onClick={() => navigate(`/about`)}
                        className='border-1 border-[#C2611F] text-[12px] text-[#C2611F] px-12 py-3 rounded-xl font-bold cursor-pointer hover:shadow-sm hover:bg-[#F1F1F1] shadow-black-500/50 hover:opacity-70 transition'>
                        À propos
                    </a>
                </div>
                <div className='w-full flex justify-center md:justify-start items-center md:gap-6'>
                    {evenementTermine ? (
                        <div className='text-center text-[#0D0D0D]'>
                            <p className='tet-gray-300'>Le prochain événement vedette sera annoncé bientôt.</p>
                        </div>
                    ) : (
                        <div className='flex flex-col justify-center gap-3'>
                            <p className='text-[10px] md:text-[#0D0D0D] text-[#C2611F] font-bold tracking-wide'>COMPTE À REBOURS</p>
                            <div className='w-full flex justify-center items-center gap-3 md:gap-6'>
                                    {[
                                    { valeur: compteRebours.jours, label: 'JOURS' },
                                    { valeur: compteRebours.heures, label: 'HEURES' },
                                    { valeur: compteRebours.minutes, label: 'MIN' },
                                    { valeur: compteRebours.secondes, label: 'SEC' },
                                ].map((item) => (
                                    <div key={item.label} className='flex items-center'>
                                        <div className='flex flex-col justify-center items-center rounded-xl bg-gray-100 shadow-md shadow-orange-500/50 h-20 w-20'>
                                            <span className='text-sm md:text-xl text-[12px] font-bold text-[#C2611F]'>{String(item.valeur).padStart(2, '0')}</span>
                                            <span className='text-sm md:text-[10px] tracking-widest mt-1'>{item.label}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
            {/* SECTION DE DROITE - IMAGE DE L'EVENEMENT MAJEUR */}
            <section className='animate__animated animate__fadeInDown animate__slow w-1/2 flex justify-center items-center font-bold'>
                <div className="relative h-130 w-100 flex flex-col justify-end gap-2 p-5 bg-cover bg-center hidden md:block rounded-xl"
                    style={{ backgroundImage: `url(${evenementsVedettes?.image})` }}>
                    {/* Overlay sombre */}
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className='absolute z-10 w-30 h-7 shadow-md shadow-black-500/50 flex justify-center items-center text-[#F1F1F1] font-bold bg-[#C2611F] text-[10px] rounded-full md:left-64 md:bottom-118'>
                        <p>En vedette</p>
                    </div>
                    <div className='z-10 flex justify-start items-center gap-2 text-[14px] text-[#F1F1F1] w-full z-10'>
                        <img className='h-5 w-5' src={notif} alt="Icon de la notification" />
                        <p>{new Date(evenementsVedettes?.dateLancement).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        })}</p>
                    </div>
                    <div className='flex justify-start items-center gap-2 text-[14px] w-full text-[#F1F1F1] z-10'>
                        <img className='h-5 w-5' src={localisation} alt="Icon de la localisation" />
                        <p>{evenementsVedettes?.lieu}</p>
                    </div>
                </div>  
            </section>
        </div>
    )
}