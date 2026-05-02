import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function PaiementSucces() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    // GeniusPay peut passer la référence en paramètre URL
    const reference = searchParams.get('reference')

    useEffect(() => {
        // Redirige vers les billets après 4 secondes
        const timer = setTimeout(() => navigate('/billets'), 4000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className='h-screen w-full flex flex-col justify-center items-center gap-6 bg-green-50'>
            <div className='text-6xl'>🎉</div>
            <h1 className='text-3xl font-bold text-green-700'>Paiement réussi !</h1>
            <p className='text-gray-600 text-center'>
                Votre billet a été confirmé.<br/>
                Vous allez être redirigé vers vos billets...
            </p>
            {reference && (
                <p className='text-xs text-gray-400'>Référence : {reference}</p>
            )}
            <button
                onClick={() => navigate('/billets')}
                className='bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all'
            >
                Voir mes billets →
            </button>
        </div>
    )
}