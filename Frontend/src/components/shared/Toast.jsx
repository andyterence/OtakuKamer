import { useEffect } from "react";


function Toast({ message, setMessage, type }) {

    // logique de couleur du toast en fonction du type de message (succes ou erreur)
    const couleur = type === 'succes' ? 'bg-green-500' : 'bg-red-500'
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('')
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [message])

    return(
        <div className='fixed top-6 left-1/2 -translate-x-1/2 z-50'>
            <div className={`rounded-xl p-4 w-96 flex justify-center items-center ${couleur}`}>
                <p className='text-white font-bold'>{message}</p>
            </div>
        </div>
    )
}

export default Toast