import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Hero() {

    const [enAttente, setEnAttente] = useState(false)
    const [evenementsVedettes, setEvenementsVedettes] = useState(null)
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
        <div className="relative h-[100vh] w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${evenementsVedettes?.image})` }}>

            {/* Overlay sombre */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* Contenu */}
            <div className="relative z-10 h-full w-full flex flex-col justify-center items-center gap-10 text-[#F1F1F1]">

                <div className='bg-linear-to-t from-sky-500 to-indigo-500 px-4 h-8 rounded-full flex justify-center items-center font-bold'>
                    Événement Principal
                </div>

                <div className='flex flex-col justify-center items-center gap-2 text-center px-4'>
                    <h1 className='text-5xl font-bold  bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400'>{evenementsVedettes?.titre}</h1>
                    <p className='text-[18px] text-gray-300'>{evenementsVedettes?.description}</p>
                </div>

                <div className='border border-purple-500 bg-black/30 px-6 h-10 rounded-md flex justify-center items-center font-bold '>
                     LE COMPTE À REBOURS A COMMENCÉ
                </div>

                <div className='flex justify-center items-center gap-6'>
                    {[
                        { valeur: compteRebours.mois, label: 'MOIS' },
                        { valeur: compteRebours.jours, label: 'JOURS' },
                        { valeur: compteRebours.heures, label: 'HEURES' },
                        { valeur: compteRebours.minutes, label: 'MINUTES' },
                        { valeur: compteRebours.secondes, label: 'SECONDES' },
                    ].map((item, index, arr) => (
                        <div key={item.label} className='flex items-center gap-6'>
                            <div className='flex flex-col justify-center items-center'>
                                <span className='text-sm md:text-7xl font-bold shadow-lg shadow-indigo-500/50'>{String(item.valeur).padStart(2, '0')}</span>
                                <span className='text-sm tracking-widest mt-1'>{item.label}</span>
                            </div>
                            {index < arr.length - 1 && <span className='text-4xl font-bold text-purple-400'>:</span>}
                        </div>
                    ))}
                </div>

                <button className='bg-linear-to-r from-purple-600 to-blue-500 shadow-lg shadow-indigo-500/50 px-10 h-14 rounded-md font-bold text-lg cursor-pointer hover:opacity-90 transition'>
                    RÉSERVER MA PLACE
                </button>
            </div>
        </div>
    )
}