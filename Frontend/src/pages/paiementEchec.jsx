  import { useNavigate, useSearchParams } from 'react-router-dom'

export default function PaiementEchec() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const raison = searchParams.get('reason')

    return (
        <div className='h-screen w-full flex flex-col justify-center items-center gap-6 bg-red-50'>
            <div className='text-6xl'>x</div>
            <h1 className='text-3xl font-bold text-red-700'>Paiement échoué</h1>
            <p className='text-gray-600 text-center'>
                Votre paiement n'a pas pu être traité.<br/>
                Aucun billet n'a été débité.
            </p>
            {raison && (
                <p className='text-sm text-red-400'>Raison : {raison}</p>
            )}
            <div className='flex gap-4'>
                <button
                    onClick={() => navigate(-1)}
                    className='bg-[#C2611F] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#a14f19] transition-all'
                >
                    Réessayer
                </button>
                <button
                    onClick={() => navigate('/accueil')}
                    className='border border-gray-300 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all'
                >
                    Retour à l'accueil
                </button>
            </div>
        </div>
    )
}