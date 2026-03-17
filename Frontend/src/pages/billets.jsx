import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from "../components/shared/sidebar";
import axios from 'axios'
import { QRCodeCanvas } from 'qrcode.react'
import info from '../assets/icons/info.svg'
import logo from '../assets/logos/OtakuKamer_logo.png'
import calendrier from "../assets/icons/calendar-days-svgrepo-com.svg";
import ticket from '../assets/icons/ticket-check.svg'
import download from '../assets/icons/download.svg'
import qrcode from '../assets/icons/scan-qr-code.svg'
import background from '../assets/imgs/background.jpg'
import map from '../assets/icons/map-check.svg'

// import notif from '../../assets/icons/bell.svg'

export default function Billets() {

    const [billets, setBillets] = useState([])
    const [enAttente, setEnAttente] = useState(false)
    const [qrOuvert, setQrOuvert] = useState(null)
    // UseState qui va se charger de la liste des billets selon le type
    // const [billets, setbillets] = useState([])
    // Pour pouvoir naviguer entre les pages
    const navigate = useNavigate()

    // TELECHARGEMENT DU QRCODE
    const telechargerQR = (billetId) => {
        // 1. On trouve le canvas par son id
        const canvas = document.getElementById(`qr-${billetId}`)
        
        // 2. On vérifie qu'il est bien visible
        if (!canvas) {
            alert('Veuillez d\'abord afficher le QR code !')
            return
        }
        
        // 3. On convertit le canvas en image
        const url = canvas.toDataURL('image/png')
        
        // 4. On crée un lien de téléchargement automatique
        const lien = document.createElement('a')
        lien.href = url
        lien.download = `billet by Otakukamer event -${billetId}.png`
        lien.click()
    }

    useEffect(() => {
        const chargerBillets = async() => {
            setEnAttente(true)
            try {
                const token = localStorage.getItem('access')
                const reponse = await axios.get('http://localhost:8000/api/billet/', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setBillets(reponse.data)
            } catch (_err) {
                if (_err.response?.status === 401) {
                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
                navigate('/login')
            }
                console.error(_err)
            } finally {
                setEnAttente(false)
            }
        }
        chargerBillets()
    }, [])

    return (
        <div className='flex'>
            <aside className="w-1/7 sticky top-0 h-screen">
                <Sidebar />
            </aside>
            <section className="w-6/7 bg-gray-200">
            {/* TITRE ET SOUS TITRE DE BIENVENUE */}
                <div className='flex flex-col justify-center items-start font-bold md:p-10'>
                    <h1 className='text-4xl'>Mes Billets</h1>
                    <p className='text-md text-[#C2611F]'>Gérez et téléchargez vos billets d'événements</p>
                </div>
                {/* CONTENEUR DE GESTION DES BILLETS */}
                <div className='flex justify-evenly items-center font-bold'>
                    {/* Nombre Billets Achetés */}
                    <div className='flex flex-col justify-evenly items-start w-70 h-40 rounded-xl bg-[#C2611F]/30 py-4 px-8'>
                        <div><img className='h-7 w-7' src={ticket} alt="Logo du ticket" /></div>
                        <div>{billets.length}</div>
                        <div>Billets Achetés</div>
                    </div>
                    {/*Nombre Événements À Venir */}
                    <div className='flex flex-col justify-evenly items-start w-70 h-40 rounded-xl bg-[#C2611F]/30 py-4 px-8'>
                        <div><img className='h-7 w-7' src={calendrier} alt="Logo du calendrier" /></div>
                        <div>{billets.filter(billet => billet.statut === 'valide').length}</div>
                        <div>Événements À Venir</div>
                    </div>
                    {/* Total Dépensé (FCFA) */}
                    <div className='flex flex-col justify-evenly items-start w-70 h-40 rounded-xl bg-[#C2611F]/30 py-4 px-8'>
                        <div><img className='h-7 w-7' src={info} alt="Logo de l'information" /></div>
                        <div>{billets.reduce((total, billet) => total + parseFloat(billet.prix), 0).toFixed(0)} FCFA</div>
                        <div>Total Dépensé (FCFA)</div>
                    </div>
                </div>
                {/* ECRAN DE CHARGEMENT LORS D'UNE REQUETE */}
                {enAttente && (
                    <div className="fixed inset-0 bg-[#0D0D0D] flex flex-col items-center justify-center z-50">
                        <img className='w-80 h-auto anime-flotter' src={logo} />
                        <p className="text-white text-lg">Chargement en cours...</p>
                    </div>
                )}
                {/* PRESENTATION DES BILLETS */}
                <div className='md:flex flex-col justify-center items-center gap-10 my-10 rounded-xl'>
                    {billets.length === 0 
                        ? <p className=' font-bold'>Vous n'avez aucun billet</p>
                        : billets.map(billet => (
                            <div 
                                key={billet.id} 
                                className='relative card h-90 md:h-65 md:w-[82%] flex flex-col md:flex-row justify-start items-center gap-4 bg-[#C2611F]/40 rounded-xl border-2 border-[#C2611F] font-bold bg-cover bg-center transition-all duration-300 hover:shadow-sm shadow-indigo-500/50 hover:bg-[#C2611F]/50 p-4'>
                                {/* BACKGROUND DE L'EVENEMENT */}
                                <div className='w-1/3 h-full rounded-xl bg-cover bg-center'
                                    style={{ backgroundImage: `url(${billet?.categorie?.evenement?.image})` }}>
                                </div>
                                {/* Detail du billet */}
                                <div className='w-2/3 h-full flex flex-col justify-evenly items-start gap-4'>
                                    <div className='w-full h-full justify-evenly flex items-start gap-2'>
                                        <div className='w-full h-full text-[12px] justify-evenly flex flex-col items-start gap-2'>
                                            <p>{billet?.categorie.evenement.titre}</p>
                                            <p>{billet?.categorie.nom}</p>
                                            <p>
                                                {new Date(billet?.dateAchat).toLocaleDateString('fr-FR', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </p>
                                            <p>
                                                {new Date(billet?.categorie?.evenement?.dateLancement).toLocaleDateString('fr-FR', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </p>
                                            <p>{billet?.prix} FCFA</p>
                                            <p>{billet?.statut}</p>
                                        </div>
                                        {/* QRCODE */}
                                        <div className='w-full h-full flex justify-center items-center top-10'>
                                            {qrOuvert === billet?.id && (
                                                <QRCodeCanvas 
                                                    value={billet?.qrcode}
                                                    size={120}
                                                    id={`qr-${billet?.id}`}
                                                    // niveau de correction d'erreur. Plus il est élevé, plus le QR code reste lisible même abîmé 
                                                    level="H"
                                                    // Marge blanche
                                                    includeMargin={true}
                                                    imageSettings={{
                                                        src: logo,
                                                        height: 30,
                                                        width: 30,
                                                        excavate: true  // creuse le fond sous le logo
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    {/* PRESENTATION DU QRCODE */}
                                        <div className='w-full flex justify-center items-center gap-4'>
                                            <div className='bg-[#C2611F]/40 h-10 w-full p-4 flex justify-center gap-4 items-center cursor-pointer rounded-xl'>
                                                <img className='h-6 w-6' src={qrcode} alt="Logo de telechargement du qrcode" />
                                                <button
                                                    onClick={() => setQrOuvert(qrOuvert === billet?.id ? null : billet?.id)}
                                                    className='cursor-pointer'
                                                >
                                                    Afficher le QRCODE 
                                                </button>
                                            </div>
                                            {/* BUTON DE TELECHARGEMENT */}
                                            <div>
                                                <button 
                                                    onClick={() => telechargerQR(billet?.id)}
                                                    className='cursor-pointer'
                                                >
                                                    <img className='h-7 w-7' src={download} alt="Logo de telechargement du fichier" />
                                                </button>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>
        </div>
    )
}