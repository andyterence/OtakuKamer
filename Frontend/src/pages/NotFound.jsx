import { useNavigate } from 'react-router-dom'
import logo from '../assets/logos/logo-orange.png'

export default function NotFound() {
    const navigate = useNavigate()
    
    return (
        <div className='h-screen w-full flex flex-col justify-center items-center gap-6'>
            <img className='w-32 h-auto animate-bounce' src={logo} alt="Logo OtakuKamer" />
            <h1 className='text-6xl font-bold text-[#C2611F]'>404</h1>
            <p className='text-xl text-gray-600'>Cette page n'existe pas</p>
            <button
                onClick={() => navigate('/accueil')}
                className='bg-[#C2611F] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#a14f19] transition-all'
            >
                Retour à l'accueil
            </button>
        </div>
    )
}