import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../utils/api'
import formaterStatut from '../utils/formaterStatut'
import Sidebar from "../components/shared/sidebar";
import axios from 'axios'
import logo from '../assets/logos/OtakuKamer_logo.png'
import calendrier from "../assets/icons/calendar-days-svgrepo-com.svg";
import menu from '../assets/icons/menu.svg'

export default function Calendrier() {

    
    const [evenements, setEvenements] = useState([])
    const [enAttente, setEnAttente] = useState(false)
    const [menuOuvert, setMenuOuvert] = useState(false)
    const [moisActuel, setMoisActuel] = useState(new Date())
    const [jourSelectionne, setJourSelectionne] = useState(null)
    const navigate = useNavigate()

    // Fonction pour calculer les jours du mois et leur position dans la grille du calendrier
    const joursduMois = () => {
        const annee = moisActuel.getFullYear()
        const mois = moisActuel.getMonth()
        
        // Nombre de jours dans ce mois
        const nombreJours = new Date(annee, mois + 1, 0).getDate()
        
        // Quel jour de la semaine est le 1er ? (0=Dim, 1=Lun... 6=Sam)
        // En France, la semaine commence le Lundi → ajuster l'offset
        let premierJour = new Date(annee, mois, 1).getDay()
        premierJour = premierJour === 0 ? 6 : premierJour - 1  // ← convertit Dim(0) en 6, Lun(1) en 0
        
        const jours = []
        
        // Cases vides avant le 1er jour
        for (let i = 0; i < premierJour; i++) {
            jours.push(null)  // null = case vide
        }
        
        // Jours du mois
        for (let i = 1; i <= nombreJours; i++) {
            jours.push(i)
        }
        
        return jours
    }

    const evenementsduJour = (jour) => {
        return evenements.filter(e => {
            const dateEven = new Date(e.dateLancement)
            return (
                dateEven.getDate() === jour &&
                dateEven.getMonth() === moisActuel.getMonth() &&
                dateEven.getFullYear() === moisActuel.getFullYear()
            )
        })
    }

    const moisSuivant = () => {
        setMoisActuel(new Date(moisActuel.getFullYear(), moisActuel.getMonth() + 1, 1))
        setJourSelectionne(null)  // reset la sélection
    }

    const moisPrecedent = () => {
        setMoisActuel(new Date(moisActuel.getFullYear(), moisActuel.getMonth() - 1, 1))
        setJourSelectionne(null)
    }

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
            <section className="md:w-6/7 w-full flex flex-col items-center">
            {/* TITRE ET SOUS TITRE DE BIENVENUE */}
                <div className='md:w-full flex flex-col justify-center items-start font-bold py-8 md:p-10 pr-0'>
                    <h1 className='text-2xl md:text-4xl'>Calendrier</h1>
                    <p className='text-sm md:text-md text-[#C2611F]'>Vue d'ensemble de vos événements</p>
                </div>
                {/* ECRAN DE CHARGEMENT LORS D'UNE REQUETE */}
                {enAttente && (
                    <div className="fixed inset-0 bg-[#0D0D0D] flex flex-col items-center justify-center z-50">
                        <img className='w-80 h-auto anime-flotter' src={logo} />
                        <p className="text-white text-lg">Chargement en cours...</p>
                    </div>
                )}
                {/* GRILLE CALENDRIER */}
                <div className='bg-white w-[95%] md:w-[90%] rounded-xl p-4 mb-6 shadow-xl'>
                    
                    {/* Navigation mois */}
                    <div className='flex justify-between items-center mb-4'>
                        <button onClick={moisPrecedent}>← </button>
                        <h2 className='font-bold capitalize'>
                            {moisActuel.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                        </h2>
                        <button onClick={moisSuivant}> →</button>
                    </div>
                    
                    {/* En-têtes jours */}
                    <div className='grid grid-cols-7 mb-2'>
                        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(j => (
                            <div key={j} className='text-center text-xs font-bold text-[#C2611F]'>{j}</div>
                        ))}
                    </div>
                    
                    {/* Cases jours */}
                    <div className='grid grid-cols-7 gap-1'>
                        {joursduMois().map((jour, index) => {
                            const evenementsCeJour = jour ? evenementsduJour(jour) : []
                            const estSelectionne = jourSelectionne === jour
                            
                            // Ici — `jour` existe
                            const aujourdhui = new Date()
                            const estAujourdhui = 
                                jour === aujourdhui.getDate() &&
                                moisActuel.getMonth() === aujourdhui.getMonth() &&
                                moisActuel.getFullYear() === aujourdhui.getFullYear()
                            
                            return (
                                <div
                                    key={index}
                                    onClick={() => jour && setJourSelectionne(jour === jourSelectionne ? null : jour)}
                                    className={`relative h-20 flex flex-col justify-center items-center rounded-lg text-sm cursor-pointer transition-all duration-200
                                        ${!jour ? '' : 'hover:bg-[#C2611F]/30'}
                                        ${estSelectionne ? 'bg-[#C2611F]/30 text-black' : ''}
                                        ${estAujourdhui ? 'border-2 border-[#C2611F] font-bold' : ''}
                                    `}
                                >
                                    {jour && <span>{jour}</span>}
                                    {evenementsCeJour.length > 0 && (
                                        <div className='absolute bottom-1 w-2 h-2 rounded-full' 
                                            style={{ backgroundColor: estSelectionne ? 'white' : '#C2611F' }}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* LISTE DU JOUR SÉLECTIONNÉ */}
                {jourSelectionne && evenementsduJour(jourSelectionne).length > 0 && (
                    <div className='bg-[#C2611F]/40 w-[95%] md:w-[90%] rounded-xl p-4 mb-4'>
                        <h3 className='font-bold mb-3'>
                            Événements du {jourSelectionne} {moisActuel.toLocaleDateString('fr-FR', { month: 'long' })}
                        </h3>
                        {evenementsduJour(jourSelectionne).map(evenement => (
                            <button
                                key={evenement.id}
                                onClick={() => navigate(`/evenement/${evenement.id}`)}
                                className='w-full bg-white flex justify-between items-center hover:bg-[#C2611F]/50 transition-all rounded-md p-4 mb-2'
                            >
                                <h1 className='font-bold'>{evenement.titre}</h1>
                                <p className='h-8 w-30 md:w-40 rounded-md shadow-[#C2611F]/20 shadow-md flex justify-center items-center'>{formaterStatut(evenement?.statut)}</p>
                            </button>
                        ))}
                    </div>
                )}
                {jourSelectionne && evenementsduJour(jourSelectionne).length === 0 && (
                    <div className='w-[95%] md:w-[90%] text-center py-4 text-gray-500 text-sm'>
                        Aucun événement ce jour
                    </div>
                )}
                {/* LISTE CHRONOLOGIQUE PAR MOIS */}
                {Object.entries(evenementsParMois).map(([mois, evenementsDuMois]) => (
                    <div key={mois} className='bg-[#C2611F]/10 w-[95%] md:w-[90%] flex flex-col gap-2 rounded-md p-4 mb-4'>
                        <div className='flex items-center gap-2 font-bold'>
                            <img className='h-6 w-6' src={calendrier} />
                            <p className='capitalize'>{mois}</p>
                        </div>
                        {evenementsDuMois.map(evenement => (
                            <button
                                key={evenement.id}
                                onClick={() => navigate(`/evenement/${evenement.id}`)}
                                className='bg-[#C2611F]/20 flex justify-between items-center hover:bg-[#C2611F]/50 transition-all duration-200 rounded-md p-4'>
                                <p>{new Date(evenement.dateLancement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</p>
                                <h1 className='font-bold'>{evenement.titre}</h1>
                                <p>{formaterStatut(evenement?.statut)}</p>
                            </button>
                        ))}
                    </div>
                ))}
            </section>
        </div>
    )
}