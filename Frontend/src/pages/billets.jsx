import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../utils/api'
import Sidebar from "../components/shared/sidebar";
import Footer from "../components/shared/Footer";
import axios from 'axios'
import { QRCodeCanvas } from 'qrcode.react'
import info from '../assets/icons/info.svg'
import logo from '../assets/logos/OtakuKamer_logo.png'
import calendrier from "../assets/icons/calendar-days-svgrepo-com.svg";
import ticket from '../assets/icons/ticket-check.svg'
import download from '../assets/icons/download.svg'
import qrcode from '../assets/icons/scan-qr-code.svg'
// import background from '../assets/imgs/background.jpg'
import map from '../assets/icons/locate.svg'
import map_check from '../assets/icons/locate-fixed.svg'
import bank from '../assets/icons/banknote.svg'
import menu from '../assets/icons/menu.svg'

// import notif from '../../assets/icons/bell.svg'

export default function Billets() {

    const [billets, setBillets] = useState([])
    const [enAttente, setEnAttente] = useState(false)
    const [qrOuvert, setQrOuvert] = useState(null)
    const [modalOuvert, setModalOuvert] = useState(false)
    const [messageConfirmation, setMessageConfirmation] = useState(false)
    const [billetAnnuler, setBilletAnnuler] = useState(null)
    const [menuOuvert, setMenuOuvert] = useState(false)
    // Etat pour refuser l'autorisation du sidebar aux personnes qui ne sont pas connecter
    const token = localStorage.getItem('access')
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

    // POUR ANNULER UN BILLET
    const annulerBillet = async (billetId) => {
        try {
                const token = localStorage.getItem('access')
                const reponse = await axios.put(
                        `${API_URL}/api/billet/${billetId}/`,
                        { statut: 'annule' },
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                setBillets(billets.map(b => 
                    b.id === billetId ? { ...b, statut: 'annule' } : b
                ))
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

    // POUR SUPPRIMER UN BILLET DEJA ANNULER
    const supprimerBillet = async (billetId) => {
        try {
                const token = localStorage.getItem('access')
                const reponse = await axios.delete(
                    `${API_URL}/api/billet/${billetId}/`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                setBillets(billets.filter(b => b.id !== billetId))
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

    useEffect(() => {
        const chargerBillets = async() => {
            setEnAttente(true)
            try {
                const token = localStorage.getItem('access')
                const reponse = await axios.get(`${API_URL}/api/billet/`, {
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
                <img className='h-5 w-5' src={menu} alt="Menu" />
            </button>
            <aside className="md:w-1/7 w-0 md:sticky md:top-0 md:h-screen">
                <Sidebar menuOuvert={menuOuvert} setMenuOuvert={setMenuOuvert} />
            </aside>
            {/* CONTENU PRINCIPAL */}
            <section className="md:w-6/7 w-full flex flex-col">
            {/* TITRE ET SOUS TITRE DE BIENVENUE */}
                <div className='flex flex-col justify-center items-start font-bold md:p-10 mx-12 py-2'>
                    <h1 className='text-4xl'>Mes Billets</h1>
                    <p className='text-md text-[#C2611F]'>Gérez et téléchargez vos billets d'événements</p>
                </div>
                {/* CONTENEUR DE GESTION DES BILLETS */}
                <div className='flex flex-col md:flex-row gap-4 md:gap-0 justify-evenly items-center font-bold'>
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
                        ? <p className=' font-bold text-center'>Vous n'avez aucun billet</p>
                        : billets.map(billet => (
                            <div 
                                key={billet.id} 
                                className='relative card h-full md:w-[82%] flex flex-col md:flex-row justify-start items-center gap-4 bg-[#C2611F]/40 rounded-xl border-2 border-[#C2611F] bg-cover bg-center transition-all duration-300 hover:shadow-sm shadow-indigo-500/50 hover:bg-[#C2611F]/50 p-4'>
                                {/* BACKGROUND DE L'EVENEMENT */}
                                <div className='w-1/3 h-full rounded-xl bg-cover bg-center'
                                    style={{ backgroundImage: `url(${billet?.categorie?.evenement?.image})` }}>
                                {/* OVERLAY SI ANNULE */}
                                {billet.statut === 'annule' && (
                                    <div className='absolute inset-0 bg-black/70 rounded-xl flex justify-center items-center'>
                                        <p className='text-red-500 font-bold text-xl'>Annulé</p>
                                    </div>
                                )}
                                
                                {/* OVERLAY SI UTILISE */}
                                {billet.statut === 'utilise' && (
                                    <div className='absolute inset-0 bg-black/70 rounded-xl flex justify-center items-center'>
                                        <p className='text-gray-400 font-bold text-xl'>Utilisé</p>
                                    </div>
                                )}
                                </div>
                                {/* Detail du billet */}
                                <div className='w-2/3 h-full flex flex-col justify-evenly items-start gap-4'>
                                    <div className='w-full h-full justify-evenly flex items-start gap-2'>
                                        <div className='w-full h-full text-[12px] justify-evenly flex flex-col items-start gap-2'>
                                            <p className=' font-bold text-xl'>{billet?.categorie.evenement.titre}</p>
                                            <div className='flex flex-col justify-start items-center'>
                                                <div className='w-full flex justify-start items-center gap-1'>
                                                    <img className='h-4 w-4' src={map} alt="Logo de l'information" />
                                                    <p className='text-[12px]'>Categorie</p>
                                                </div>
                                                <p className='font-bold w-full'>{billet?.categorie.nom}</p>
                                            </div>
                                            <div className='flex flex-col justify-start items-center'>
                                                <div className='w-full flex justify-start items-center gap-1'>
                                                    <img className='h-4 w-4' src={map} alt="Logo de l'information" />
                                                    <p className='text-[12px]'>Date d'achat</p>
                                                </div>
                                                <p className='font-bold'>
                                                    {new Date(billet?.dateAchat).toLocaleDateString('fr-FR', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className='flex flex-col justify-start items-center'>
                                                <div className='w-full flex justify-start items-center gap-1'>
                                                    <img className='h-4 w-4' src={map_check} alt="Logo de l'information" />
                                                    <p className='text-[12px]'>Date de lancement</p>
                                                </div>
                                                <p className='w-full font-bold'>
                                                    {new Date(billet?.categorie?.evenement?.dateLancement).toLocaleDateString('fr-FR', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className='flex flex-col justify-start items-center'>
                                                <div className='w-full flex justify-start items-center gap-1'>
                                                    <img className='h-4 w-4' src={bank} alt="Logo de l'information" />
                                                    <p className='text-[12px]'>Prix unitaire</p>
                                                </div>
                                                <p  className='font-bold'>{billet?.prix} FCFA</p>
                                            </div>
                                            <p className='font-bold'>{billet?.statut}</p>
                                        </div>
                                        {/* QRCODE */}
                                        <div className='w-full h-full flex justify-center items-center top-10'>
                                            {qrOuvert === billet?.id && (
                                                <QRCodeCanvas 
                                                    value={JSON.stringify({ // stringify pour convertir l'objet en string en vue de l'inclure dans le QR code
                                                        uuid: billet?.qrcode, // uuid du billet pour l'identifier de manière unique lors de la validation
                                                        evenement: billet?.categorie?.evenement?.titre,
                                                        categorie: billet?.categorie?.nom,
                                                        prix: billet?.prix,
                                                        acheteur: billet?.categorie?.evenement?.organisateur?.first_name
                                                    })}
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
                                        <div className='w-full h-full flex justify-center items-center gap-2'>
                                            {/* Annuler — visible seulement si valide */}
                                            {billet.statut === 'valide' && (
                                                <button 
                                                    onClick={() => {
                                                        setBilletAnnuler(billet.id)  // ← ici billet existe
                                                        setModalOuvert(true)
                                                    }}
                                                    className='bg-red-500/60 w-full text-red-700 px-4 py-2 rounded-xl'
                                                >
                                                    Annuler
                                                </button>
                                            )}
                                            {/* Supprimer — visible seulement si annulé */}
                                            {billet.statut === 'annule' && (
                                                <button 
                                                    onClick={() => supprimerBillet(billet.id)}
                                                    className='inset-0 z-10 bg-red-700/60 w-full text-gray-200 px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-500/50 transition'
                                                >
                                                    Supprimer
                                                </button>
                                            )}

                                        </div>
                                        <div className='bg-[#C2611F]/40 h-10 w-full p-4 flex justify-center gap-4 items-center cursor-pointer rounded-xl'>
                                            <img className='h-6 w-6' src={qrcode} alt="Logo de telechargement du qrcode" />
                                            <button
                                                onClick={() => setQrOuvert(qrOuvert === billet?.id ? null : billet?.id)}
                                                className='cursor-pointer'
                                            >
                                                Afficher le QRCODE 
                                            </button>
                                        </div>
                                        {/* BUTON DE TELECHARGEMENT, D'ANNULATION ET DE SUPPRESSION*/}
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
            {/* MODAL DE CONFIRMATION */}
            {modalOuvert && (
                <div className='fixed inset-0 bg-black/60 z-50 flex justify-center items-center'>
                    <div className='bg-white rounded-xl p-8 w-96 flex flex-col gap-6'>
                        <h2 className='text-xl font-bold'>Confirmer l'annulation</h2>
                        <p className='text-gray-600'>Cette action est irréversible.</p>
                        <div className='flex gap-4'>
                            {/* Ferme le modal sans rien faire */}
                            <button 
                                onClick={() => setModalOuvert(false)}
                                className='w-1/2 py-3 border border-gray-300 rounded-xl'
                            >
                                Retour
                            </button>
                            {/* Confirme l'annulation */}
                            <button 
                                onClick={async () => {
                                    await annulerBillet(billetAnnuler)
                                    setModalOuvert(false)
                                    setMessageConfirmation(true)
                                    setTimeout(() => setMessageConfirmation(false), 2000)
                                }}
                                className='w-1/2 py-3 bg-red-500 text-white rounded-xl'
                            >
                                Confirmer l'annulation
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* MESSAGE DE CONFIRMATION */}
            {messageConfirmation && (
                <div className='fixed inset-0 z-50 flex justify-center items-start md:pt-10'>
                    <div className='bg-white/40 rounded-xl p-8 w-96 flex flex-col justify-center items-center gap-6'>
                        <h2 className='text-xl font-bold text-green-800'>Votre billet a bien été annulé</h2>
                    </div>
                </div>
            )}
        </div>
    )
}