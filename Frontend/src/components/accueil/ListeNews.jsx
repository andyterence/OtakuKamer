import { useState, useEffect } from 'react'
import axios from 'axios'
import calendar from '../../assets/icons/calendar-check.svg'
import edit from '../../assets/icons/edit.svg'
import auteur from '../../assets/icons/user-pen.svg'

export function ListeNews(){
    
    // UseState qui va se charger de la liste des news selon le type
    const [news, setnews] = useState([])
    // UseState qui va se charger du filtre des news selon le type
    const [filtreActif, setFiltreActif] = useState('Tous')
    // Pour generer les filtres boutons grace a .map()
    const filtres = ['Tous', 'gaming', 'anime', 'manga']

    useEffect(() => {
        const chargernews = async() => {
            try {
                const reponse = await axios.get('http://localhost:8000/api/news/')
                setnews(reponse.data)
            } catch (_err) {
                console.error(_err)
            }
        }
        chargernews()
    },[])

    const newsFiltres = filtreActif === 'Tous' 
    ? news 
    : news.filter(e => e.typeNews === filtreActif)

    return(
        <div className='w-full h-full bg-[#EDEDF6] flex flex-col justify-center items-center pt-15 gap-10'>
            <div className='flex flex-col justify-center items-center gap-2'>
                <h1 className='md:my-10 h-full font-bold text-3xl md:text-6xl text-[#1A1A2E]'>Actualités Otaku</h1>
                <p className='md:text-2xl text-[#9CA3AF] w-[80%] text-center font-bold'>Restez informés des dernières nouvelles de la scène Otaku</p>
            </div>
            <div className='w-full flex justify-center items-center gap-3 md:gap-10 md:mt-6 text-[#F1F1F1]'>
                {filtres.map(filtre => (
                    <button
                        key={filtre}
                        onClick={() => setFiltreActif(filtre)}
                        className={filtreActif === filtre 
                        ? 'bg-[#C2611F] px-6 h-14 md:px-10 md:h-14 rounded-md font-bold md:text-lg cursor-pointer transition-all duration-300 hover:shadow-sm shadow-indigo-500/50 hover:scale-105 hover:opacity-100'
                        : 'bg-[#C2611F] px-4 h-10 md:px-10 md:h-10 rounded-md font-bold cursor-pointer transition-all duration-300 hover:scale-95 hover:shadow-md shadow-cyan-300/50 hover:opacity-90'
                        }
                    >
                        {filtre}
                    </button>
                ))}
            </div>
            <div className='w-full flex flex-col justify-center items-center gap-10 my-10 rounded-xl text-[#6D28D9]'>
                {newsFiltres.length === 0 
                    ? <p className=' font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-800'>Aucunnews de ce type</p>
                    : newsFiltres.map(news => (
                        <div key={news.id} className='card h-120 md:h-55 w-[90%] md:w-250 flex flex-col md:flex-row justify-center items-center gap-1 bg-[#C2611F]/40 rounded-xl border-2 border-[#C2611F] font-bold transition-all duration-300 hover:shadow-sm shadow-indigo-500/50 hover:scale-105 hover:bg-[#C2611F]/60 p-4'>
                            <div className="relative h-full w-full md:w-1/3 bg-cover bg-center"
                            style={{ backgroundImage: `url(${news?.image})` }}>
                            </div>
                            <div className='w-full md:w-2/3 md:flex flex-col md:justify-evenly items-center md:gap-4'>
                                <div className='w-full text-[#F1F1F1]'>
                                    <h1 className='text-2xl font-bold'>{news?.titre}</h1>
                                </div>
                                <div className='text-[14px] w-full text-[#F1F1F1] flex justify-start items-center gap-2'>
                                    <img className='h-5 w-5' src={calendar} alt="Icon de la date de lancement" />
                                    <p>{new Date(news?.datePublication).toLocaleDateString('fr-FR', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                        })}</p>
                                </div>
                                <div className='text-[14px] w-full text-[#F1F1F1] flex justify-start items-center gap-2'>
                                    <img className='h-5 w-5' src={edit} alt="Icon de l'edit"/>
                                    {news?.description?.slice(0, 100)}
                                    {news?.description?.length > 100 ? '...' : ''}
                                </div>
                                <div className='text-[14px] w-full text-[#F1F1F1] flex justify-start items-center'>
                                    <img className='h-5 w-5' src={auteur} alt="Icon de la date de lancement" />
                                    <p>{news?.auteur}</p>
                                </div>
                                <div className='text-[14px] w-full text-[#F1F1F1]'>
                                    <div className='h-[2px] w-full bg-[#C2611F]/60'></div>
                                </div>
                                <div className='text-[12px] flex justify-between w-full text-[#F1F1F1]'>
                                    <p>{news?.statut}</p>
                                    <p className='font-bold'>{news?.dateLancement}</p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className='pb-15'>
                <button onClick={() => setFiltreActif('TOUT')} className='text-black bg-[#C2611F] px-6 h-14 md:px-10 md:h-14 rounded-md font-bold md:text-lg cursor-pointer transition-all duration-300 hover:shadow-sm shadow-indigo-500/50 hover:scale-105 hover:opacity-100'>VOIR TOUTES LES NOUVEAUTES</button>
            </div>
        </div>
    )
}

export default ListeNews