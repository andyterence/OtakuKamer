import { useState, useEffect } from 'react'
import axios from 'axios'

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
                <h1 className='md:my-10 h-full font-bold md:text-6xl text-[#1A1A2E]'>Actualités Otaku</h1>
                <p className='md:text-2xl text-[#9CA3AF] font-bold'>Restez informés des dernières nouvelles de la scène Otaku</p>
            </div>
            <div className='w-full grid grid-rows md:flex justify-center items-center gap-10 md:mt-6  text-[#F1F1F1]'>
                {filtres.map(filtre => (
                    <button
                        key={filtre}
                        onClick={() => setFiltreActif(filtre)}
                        className={filtreActif === filtre 
                        ? 'bg-[#C2611F] px-10 h-14 rounded-md font-bold text-lg cursor-pointer transition-all duration-300 hover:shadow-sm shadow-indigo-500/50 hover:scale-105 hover:opacity-100'
                        : 'bg-[#C2611F] px-10 h-10 rounded-md font-bold cursor-pointer transition-all duration-300 hover:scale-95 hover:shadow-sm shadow-cyan-300/50 hover:opacity-90'
                        }
                    >
                        {filtre}
                    </button>
                ))}
            </div>
            <div className='md:flex flex-col justify-center items-center gap-10 my-10 rounded-xl text-[#6D28D9]'>
                {newsFiltres.length === 0 
                    ? <p className=' font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-800'>Aucunnews de ce type</p>
                    : newsFiltres.map(news => (
                        <div key={news.id} className='card h-90 md:h-55 md:w-250 flex flex-col md:flex-row justify-center items-center gap-1 bg-[#C2611F]/40 rounded-xl border-2 border-[#C2611F] font-bold transition-all duration-300 hover:shadow-sm shadow-indigo-500/50 hover:scale-105 hover:bg-[#C2611F]/60 p-4'>
                            <div className="relative h-full w-1/3 bg-cover bg-center"
                            style={{ backgroundImage: `url(${news?.image})` }}>
                            </div>
                            <div className='w-2/3 md:flex flex-col md:justify-evenly items-center md:gap-4'>
                                <div className='w-full text-[#F1F1F1]'>
                                    <h1 className='text-2xl font-bold'>{news?.titre}</h1>
                                </div>
                                <div className='text-[12px] w-full text-[#F1F1F1]'>
                                    <p>{new Date(news?.datePublication).toLocaleDateString('fr-FR', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                        })}</p>
                                </div>
                                <div className='text-[12px] w-full text-[#F1F1F1]'>
                                    {news?.description?.slice(0, 100)}
                                    {news?.description?.length > 100 ? '...' : ''}
                                </div>
                                <div className='text-[12px] w-full text-[#F1F1F1]'>
                                    <p>{news?.auteur}</p>
                                </div>
                                <div className='text-[12px] w-full text-[#F1F1F1]'>
                                    <div className='h-[1px] w-full bg-gray-500'></div>
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
                <button onClick={() => setFiltreActif('TOUT')} className='text-black  px-10 h-14 rounded-md font-bold text-lg cursor-pointer transition-all duration-300 hover:shadow-lg shadow-indigo-500/50 hover:scale-90 hover:opacity-90'>VOIR TOUTES LES NOUVEAUTES</button>
            </div>
        </div>
    )
}

export default ListeNews