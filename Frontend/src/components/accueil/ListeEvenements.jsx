import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../../utils/api'
import CarrouselEvenements from './carrouselEvenements'
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios'
import map from '../../assets/icons/map-check.svg'
import info from '../../assets/icons/info.svg'
import calendar from '../../assets/icons/calendar-check.svg'


function ListeEvenements(){
    
    // UseState qui va se charger de la liste des evenements selon le type
    const [evenements, setEvenements] = useState([])
    // UseState qui va se charger du filtre des evenements selon le type
    const [filtreActif, setFiltreActif] = useState('Tous')
    // Pour generer les filtres boutons grace a .map()
    const filtres = ['Tous', 'Gaming', 'Anime', 'Manga']
    // Pour pouvoir naviguer entre les pages
    const navigate = useNavigate()

    useEffect(() => {
    AOS.init({
        duration: 1000, // Durée de l'animation
        once: false,    // Si tu veux que l'animation se répète au scroll
    });
    }, []);

    useEffect(() => {
        const chargerEvenements = async() => {
            try {
                const reponse = await axios.get(`${API_URL}/api/evenements/`)
                setEvenements(reponse.data)
            } catch (_err) {
                console.error(_err)
            }
        }
        chargerEvenements()
    },[])

    const evenementsFiltres = filtreActif === 'Tous' 
    ? evenements 
    : evenements.filter(e => e.typeEven === filtreActif)

    return(
        <div id="liste-evenements" className='w-full h-full flex flex-col justify-center items-center pt-10 md:pt-15 gap-10'>
            <div className='flex flex-col justify-center items-center font-bold text-[#C2611F] text-[12px] gap-1'>
                <div className='flex justify-center items-center font-bold text-[#C2611F] bg-black/30 px-6 py-2 rounded-full'>
                    <h1>Événement à venir</h1>
                </div>
                <p className='md:text-xl text-[#6B7280] font-bold'>Découvrez tous les événements Otaku au Cameroun</p>
            </div>
            <div className='w-full flex justify-center items-center gap-3 md:gap-10 md:mt-6 text-[#F1F1F1]'>
                {filtres.map(filtre => (
                    <button
                        key={filtre}
                        onClick={() => setFiltreActif(filtre)}
                        className={filtreActif === filtre 
                        ? ' bg-[#C2611F] px-6 h-14 md:px-10 md:h-14 rounded-md font-bold md:text-lg cursor-pointer transition-all duration-300 hover:shadow-sm shadow-indigo-500/50 hover:scale-105 hover:opacity-100'
                        : 'bg-[#C2611F] px-4 h-10 md:px-10 md:h-10 rounded-md font-bold cursor-pointer transition-all duration-300 hover:scale-95 hover:shadow-md shadow-cyan-300/50 hover:opacity-90'
                        }
                    >
                        {filtre}
                    </button>
                ))}
            </div>
            <div className='w-full flex flex-col justify-center items-center gap-4 md:gap-30 md:my-10 px-4 rounded-xl'>
                {evenementsFiltres.length === 0 
                    ? <p className=' font-bold'>Aucun événement de ce type</p>
                    : evenementsFiltres.map(evenement => (
                        <div key={evenement.id} data-aos="fade-right" className={`card md:h-140 w-full md:w-250 bg-[#C2611F]/20 flex flex-col md:flex-row justify-center items-center rounded-xl font-bold md:p-4 ${
                            evenement.typeEven === 'Gaming' ? 'border-green-500' :
                            evenement.typeEven === 'Anime' ? 'border-blue-500' :
                            evenement.typeEven === 'Manga' ? 'border-red-500' :
                                                    'border-purple-500'
                        }`}>
                            {/* SECTION INFORMATION A GAUCHE */}
                            <article className='h-full md:w-110 flex flex-col justify-start items-start gap-8 md:px-10'>
                                {/* BADGE */}
                                <div className='w-full flex justify-center md:justify-start items-center font-bold pt-5 md:pt-5'>
                                    <h1 className='text-[#C2611F] text-[12px] bg-black/20 px-4 py-1 rounded-full'>{evenement?.typeEven}</h1>
                                </div>
                                {/* NOM DE L'EVEN ET DESCRIPTION*/}
                                <div className='w-full flex flex-col justify-center md:justify-start items-center md:items-start gap-2'>
                                    <h1 className='text-4xl text- md:text-start font-bold'>{evenement?.titre}</h1>
                                    <p className='text-[#C2611F]'>{evenement?.description?.slice(0, 100)}
                                        {evenement?.description?.length > 100 ? '...' : ''}
                                    </p>
                                </div>
                                {/* INFORMATION SUR LA DATE, LIEU, STATUTS ET BUTTONS DE PARTICIPATION */}
                                <div className='w-full h-full flex flex-col justify-start items-center gap-2 px-8 md:px-0'>
                                    <div className='w-full flex justify-start items-center gap-2 text-[14px]'>
                                        <div className='flex justify-center items-center h-8 w-8 bg-[#C2611F] rounded-md'>
                                            <img className='h-5 w-5' src={calendar} alt="Icon de la date de lancement" />
                                        </div>
                                        <p>{new Date(evenement?.dateLancement).toLocaleDateString('fr-FR', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className='w-full flex justify-start md:justify-start items-center gap-2 text-[12px] w-full'>
                                        <div className='flex justify-center items-center h-8 w-8 bg-[#C2611F] rounded-md'>
                                            <img className='h-5 w-5' src={map} alt="Icon de la localisation" />
                                        </div>
                                        <p>{evenement?.lieu}</p>
                                    </div>
                                    <div className='w-full flex justify-start md:justify-start items-center gap-2 text-[12px] w-full'>
                                        <div className='flex justify-center items-center h-8 w-8 bg-[#C2611F] rounded-md'>
                                            <img className='h-5 w-5' src={info} alt="Icon de la localisation" />
                                        </div>
                                        <p>{evenement?.statut}</p>
                                    </div>
                                    <div className='w-full flex justify-center md:justify-start text-[12px] w-full py-6'>
                                        <button 
                                            onClick={() => navigate(`/evenement/${evenement.id}`)}
                                            className='bg-[#C2611F] text-[12px] text-[#F1F1F1] px-4 py-3 rounded-xl font-bold cursor-pointer hover:opacity-95 transition'>
                                            Voir les détails
                                        </button>
                                    </div>
                                </div>
                            </article>
                            {/* SECTION PHOTOS A DROITE */}
                            <div className='w-[80%] md:full pb-10 md:pb-0'>
                                <CarrouselEvenements image={evenement?.image} photos={evenement?.photos} />
                                {/* <EmblaCarousel image={evenement?.image} /> */}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ListeEvenements