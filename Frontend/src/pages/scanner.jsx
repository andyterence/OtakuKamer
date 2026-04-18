import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import jsQR from 'jsqr'
import axios from 'axios'
import API_URL from '../utils/api'
import Sidebar from '../components/shared/sidebar'


export default function Scanner() {
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const navigate = useNavigate()
    const token = localStorage.getItem('access')
    const [resultat, setResultat] = useState(null)
    const [scanning, setScanning] = useState(true)
    const [menuOuvert, setMenuOuvert] = useState(false)

    useEffect(() => {
        // Démarre la caméra
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                videoRef.current.srcObject = stream
                videoRef.current.play()
                requestAnimationFrame(scanner)
            })
            .catch(err => console.error('Caméra inaccessible', err))

        return () => {
            // Arrête la caméra au démontage
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(t => t.stop())
            }
        }
    }, [])

    const scanner = () => {
        if (!scanning) return
        const video = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
            requestAnimationFrame(scanner)
            return
        }

        const ctx = canvas.getContext('2d')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
            setScanning(false)
            validerBillet(code.data)
        } else {
            requestAnimationFrame(scanner)
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
        requestAnimationFrame(scanner)
    }

    return (
        <div className='flex'>
            {menuOuvert && (
                <div className='md:hidden fixed inset-0 bg-black/50 z-30' onClick={() => setMenuOuvert(false)} />
            )}
            <aside className="md:w-1/7 w-0 md:sticky md:top-0 md:h-screen">
                <Sidebar menuOuvert={menuOuvert} setMenuOuvert={setMenuOuvert} />
            </aside>

            <section className="md:w-6/7 w-full flex flex-col items-center gap-8 p-10">
                <div className='w-full font-bold'>
                    <h1 className='text-4xl'>Scanner un billet</h1>
                    <p className='text-[#C2611F]'>Pointez la caméra vers le QR code du billet</p>
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