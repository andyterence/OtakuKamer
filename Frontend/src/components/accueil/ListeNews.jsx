import { useState, useEffect } from 'react'
import axios from 'axios'

export function ListeNews(){
    
    // UseState qui va se charger de la liste des news selon le type
    const [news, setnews] = useState([])
    // UseState qui va se charger du filtre des news selon le type
    const [filtreActif, setFiltreActif] = useState('Tous')

    useEffect(() => {
        const chargernews = async() => {
            try {
                const reponse = await axios.get('http://localhost:8000/api/evenements/')
                setnews(reponse.data)
            } catch (_err) {
                console.error(_err)
            }
        }
        chargernews()
    },[])

    const newsFiltres = filtreActif === 'Tous' 
    ? news 
    : news.filter(e => e.typeEven === filtreActif)

    return(
        <div className='w-full h-full bg-linear-to-r from-black to-violet-700 flex flex-col justify-center items-center pt-15 gap-10'>
            <div className='flex flex-col justify-center items-center bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-800 gap-2'>
                <h1 className='md:my-10 h-full font-bold md:text-6xl shadow-lg shadow-indigo-500/50'>Actualités Otaku</h1>
                <p className='md:text-2xl font-bold'>Restez informés des dernières nouvelles de la scène Otaku</p>
            </div>
            <div className='w-full grid grid-rows md:flex justify-center items-center gap-10 md:mt-6'>
                <button onClick={() => setFiltreActif('Tous')} className='shadow-lg shadow-indigo-500/50 bg-linear-to-r from-purple-600 to-blue-500 px-10 h-14 rounded-md font-bold text-lg cursor-pointer transition-all duration-300 hover:scale-90 hover:opacity-90'>Tout</button>
                <button onClick={() => setFiltreActif('Gaming')} className='shadow-lg shadow-indigo-500/50 bg-linear-to-r from-purple-600 to-blue-500 px-10 h-14 rounded-md font-bold text-lg cursor-pointer transition-all duration-300 hover:scale-90 hover:opacity-90'>Gaming</button>
                <button onClick={() => setFiltreActif('Anime')} className='shadow-lg shadow-indigo-500/50 bg-linear-to-r from-purple-600 to-blue-500 px-10 h-14 rounded-md font-bold text-lg cursor-pointer transition-all duration-300 hover:scale-90 hover:opacity-90'>Anime</button>
                <button onClick={() => setFiltreActif('Manga')} className='shadow-lg shadow-indigo-500/50 bg-linear-to-r from-purple-600 to-blue-500 px-10 h-14 rounded-md font-bold text-lg cursor-pointer transition-all duration-300 hover:scale-90 hover:opacity-90'>Manga</button>
            </div>
            <div className='md:flex justify-center items-center gap-10 my-10 rounded-xl'>
                {newsFiltres.length === 0 
                    ? <p className=' font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-800'>Aucunnews de ce type</p>
                    : newsFiltres.map(news => (
                        <div key={news.id} className='card h-110 w-70 flex flex-col justify-center items-center gap-1 bg-linear-to-r from-purple-900 to-black rounded-xl border-2 border-purple-500 shadow-lg shadow-indigo-500/50 font-bold transition-all duration-300 hover:scale-105 hover:opacity-80 p-4'>
                            <div className="relative h-[120vh] w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${news?.image})` }}>
                            </div>
                            <div className='w-full text-[#F1F1F1]'>
                                <h1 className='text-2xl text-center font-bold'>{news?.titre}</h1>
                            </div>
                            <div className='text-[12px] w-full text-[#F1F1F1]'>
                                <p className='font-bold'>{news?.dateLancement}</p>
                            </div>
                            <div className='text-[12px] w-full text-[#F1F1F1]'>
                                <p>{news?.lieu}</p>
                            </div>
                            <div className='text-[12px] w-full text-[#F1F1F1]'>
                                <p>{news?.statut}</p>
                            </div>
                            <button className='w-full h-40 text-[#F1F1F1] bg-linear-to-r from-purple-600 to-blue-500 rounded-md font-bold text-[16px] cursor-pointer hover:opacity-90 transition'>
                                VOIR TOUTES LES NOUVEAUTES
                            </button>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ListeNews