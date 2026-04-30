import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import jsQR from 'jsqr'
import axios from 'axios'
import API_URL from '../utils/api'
import Sidebar from '../components/shared/sidebar'
import menu from '../assets/icons/menu.svg'


export default function Scanner() {
    const videoRef = useRef(null) // Référence à l'élément vidéo pour accéder à la caméra
    const canvasRef = useRef(null) // Référence à un canvas pour capturer les images de la vidéo et les analyser
    const navigate = useNavigate() // Hook pour la navigation entre les pages
    const token = localStorage.getItem('access')
    const [resultat, setResultat] = useState(null) // État pour stocker le résultat de la validation du billet (succès ou échec)
    const [scanning, setScanning] = useState(true) // État pour savoir si le scanner est actif ou non
    const [menuOuvert, setMenuOuvert] = useState(false)
    const intervalRef = useRef(null) // Référence pour stocker l'intervalle de temps qui contrôle la fréquence du scan

    useEffect(() => {
        // Démarre la caméra
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                videoRef.current.srcObject = stream
                videoRef.current.play()
                intervalRef.current = setInterval(scanner, 300)
            })
            .catch(err => console.error('Caméra inaccessible', err))

        return () => {
            clearInterval(intervalRef.current)
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(t => t.stop())
            }
        }
    }, [])

    const scanner = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    
    console.log('readyState:', video.readyState) 
    
    if (video.readyState !== video.HAVE_ENOUGH_DATA) return
        const ctx = canvas.getContext('2d', { willReadFrequently: true }) // ✅ Indique au navigateur que getImageData sera appelé souvent
        
        canvas.width = video.videoWidth / 2
        canvas.height = video.videoHeight / 2
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
            clearInterval(intervalRef.current)  // ← arrête le scan
            validerBillet(code.data)
        }
    }

    const validerBillet = async (qrData) => {
        try {
            // Extrait l'UUID du JSON scanné
            const parsed = JSON.parse(qrData)
            const uuid = parsed.uuid ?? qrData

            const reponse = await axios.post(
                `${API_URL}/api/billet/valider/`,
                { qrcode: uuid },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setResultat({ succes: true, data: reponse.data })
        } catch (err) {
            setResultat({ 
                succes: false, 
                message: err.response?.data?.detail ?? 'Erreur de validation'
            })
        }
    }

    const reessayer = () => {
        setResultat(null)
        setScanning(true)
        intervalRef.current = setInterval(scanner, 300)
    }

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

            <section className="md:w-6/7 w-full flex flex-col items-center gap-8 p-10">
                <div className='md:w-full flex flex-col justify-center items-start font-bold md:p-10 pr-0'>
                    <h1 className='text-2xl md:text-4xl'>Scanner un billet</h1>
                    <p className='text-sm md:text-md text-[#C2611F]'>Pointez la caméra vers le QR code du billet</p>
                </div>

                {/* CAMERA */}
                {!resultat && (
                    <div className='relative w-80 h-80 rounded-xl overflow-hidden border-2 border-[#C2611F]'>
                        <video ref={videoRef} className='w-full h-full object-cover' />
                        {/* Viseur */}
                        <div className='absolute inset-0 flex justify-center items-center'>
                            <div className='w-48 h-48 border-2 border-[#C2611F] rounded-md opacity-70' />
                        </div>
                    </div>
                )}
                <canvas ref={canvasRef} className='hidden' />

                {/* RESULTAT */}
                {resultat && (
                    <div className={`w-full max-w-md rounded-xl p-6 flex flex-col gap-4 ${
                        resultat.succes ? 'bg-green-100 border border-green-500' : 'bg-red-100 border border-red-500'
                    }`}>
                        <p className={`text-2xl font-bold ${resultat.succes ? 'text-green-700' : 'text-red-700'}`}>
                            {resultat.succes ? 'Billet valide !' : 'INVALIDE ' + resultat.message}
                        </p>
                        {resultat.succes && (
                            <div className='flex flex-col gap-2 text-sm'>
                                <p><strong>Événement :</strong> {resultat.data.billet.evenement}</p>
                                <p><strong>Catégorie :</strong> {resultat.data.billet.categorie}</p>
                                <p><strong>Acheteur :</strong> {resultat.data.billet.acheteur}</p>
                                <p><strong>Prix :</strong> {resultat.data.billet.prix} FCFA</p>
                            </div>
                        )}
                        <button
                            onClick={reessayer}
                            className='w-full py-3 bg-[#C2611F] text-white rounded-xl font-bold'
                        >
                            Scanner un autre billet
                        </button>
                    </div>
                )}
            </section>
        </div>
    )
}