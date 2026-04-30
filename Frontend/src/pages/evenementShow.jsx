import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../utils/api'
import formaterStatut from '../utils/formaterStatut'
import CarrouselEvenements from '../components/accueil/carrouselEvenements'
import AOS from 'aos';
import 'aos/dist/aos.css';
import background from '../assets/imgs/background.jpg'
import move_left from '../assets/icons/left.svg'
import star from '../assets/icons/star.svg'
import users from '../assets/icons/users.svg'
import link from '../assets/icons/link.svg'
import send from '../assets/icons/send2.svg'
import calendrier from "../assets/icons/calendar-days-svgrepo-com.svg";
import map from '../assets/icons/map-check.svg'
import shield from '../assets/icons/shield-check.svg'
import whatsapp from '../assets/logos/whatsapp.svg'
 
export default function EvenementShow() {
 
    const { id } = useParams()
    const [evenement, setEvenement] = useState(null)
    const [modalOuvert, setModalOuvert] = useState(false)
    const [messageConfirmation, setMessageConfirmation] = useState(false)
    const [enAttente, setEnAttente] = useState(false)
    const [utilisateur, setUtilisateur] = useState(null)
    // DECREMENTATION ET INCREMENTATION POUR L'ACHAT DES BILLETS
    const [quantite, setQuantite] = useState(1)
    const evenementAchetable = ['en_cours', 'en_preparation'].includes(evenement?.statut)
    // UseState qui va se charger de la catégorie choisie par l'utilisateur
    const [categorieChoisie, setCategorieChoisie] = useState(null)
    // Etat pour ouvrir/fermer le drawer de réservation sur mobile
    const [drawerOuvert, setDrawerOuvert] = useState(false)
    // Pour pouvoir naviguer entre les pages
    const navigate = useNavigate()
    // Etat pour refuser l'autorisation a un element aux personnes qui ne sont pas connecter
    const token = localStorage.getItem('access')
    const [methode, setMethode] = useState("MTN")
    const [numero, setNumero] = useState("")
    const [voirPlus, setVoirPlus] = useState(false)
    const [lienCopie, setLienCopie] = useState(false)
    
 
    // ─── FONCTIONS ────────────────────────────────────────────────────────────
 
    // Vérifie si l'utilisateur est connecté et récupère ses données depuis l'API.
    // Si le token est invalide (401), on le supprime et on redirige vers /login.
    // Appelée au chargement et à chaque événement 'profilMisAJour'.
    const seConnecter = async () => {
        try {
            const token = localStorage.getItem('access')
            const reponse = await axios.get(`${API_URL}/api/utilisateurs/me/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUtilisateur(reponse.data)
        } catch (_err) {
            if (_err.response?.status === 401) {
                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
                navigate('/login')
            }
            console.error(_err)
        }
    }
 
    // Envoie la réservation à l'API et redirige vers /billets si succès.
    // const reserver = async () => {
    //     if (!categorieChoisie) {
    //         alert('Veuillez choisir une catégorie !')
    //         return
    //     }
    //     try {
    //         const token = localStorage.getItem('access')
    //         await axios.post(
    //             `${API_URL}/api/billet/`,
    //             { categorie: categorieChoisie.id, quantite: quantite },
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         )
    //         setMessageConfirmation(true)
    //         setTimeout(() => {
    //             setMessageConfirmation(false)
    //             navigate('/billets')
    //         }, 1000)
    //     } catch (_err) {
    //         console.error(_err)
    //     }
    // }

    const payer = async () => {
        if (!categorieChoisie) {
            alert('Veuillez choisir une catégorie !')
            return
        }
        try {
            const token = localStorage.getItem('access')
            const res = await axios.post(`${API_URL}/api/payments/init/`, {
                amount: quantite * categorieChoisie.prix,
                categorie_id: categorieChoisie.id,
                quantite: quantite,
                methode: methode,
                numero: numero 
            }, { headers: { Authorization: `Bearer ${token}` } })

            // GeniusPay retourne une URL de paiement
            if (res.data?.data?.checkout_url) {
                window.location.href = res.data.data.checkout_url
            } else {
                console.error('Pas de payment_url dans la réponse', res.data)
                alert('Erreur lors de l\'initialisation du paiement')
            }
        } catch (err) {
            console.error(err)
            alert('Erreur lors du paiement')
        }
    }
 
    // Incrémente la quantité sans dépasser le nombre de places restantes
    const incrementer = () => {
        if (quantite < categorieChoisie?.nombreRestant) {
            setQuantite(quantite + 1)
        }
    }
 
    // Décrémente la quantité sans descendre en dessous de 1
    const decrementer = () => {
        if (quantite > 1) {
            setQuantite(quantite - 1)
        }
    }

    // Copier le lien dans le presse-papier
    const copierLien = () => {
        navigator.clipboard.writeText(window.location.href)
        setLienCopie(true)
        setTimeout(() => setLienCopie(false), 2000)  // remet à false après 2s
    }

    // Partager sur WhatsApp
    const partagerWhatsApp = () => {
        const texte = `Découvre cet événement : ${evenement?.titre} — ${window.location.href}`
        // wa.me est l'URL officielle WhatsApp pour partager un message
        window.open(`https://wa.me/?text=${encodeURIComponent(texte)}`)
    }

    // Partage natif du téléphone (API Web Share)
    // navigator.share est disponible sur mobile uniquement
    const partagerNatif = async () => {
        if (navigator.share) {
            await navigator.share({
                title: evenement?.titre,
                text: `Découvre cet événement sur OtakuKamer !`,
                url: window.location.href,
            })
        }
    }

    // Pourcentage de places RESTANTES
    const pourcentageRestant = categorieChoisie
        ? (categorieChoisie.nombreRestant / categorieChoisie.nombreteTotale) * 100
        : 0

    // Couleur selon disponibilité
    // > 50% → vert (beaucoup de places)
    // 20-50% → orange (places limitées)
    // < 20% → rouge (presque complet)
    const couleurBarre = 
        pourcentageRestant > 50 ? 'bg-green-500' :
        pourcentageRestant > 20 ? 'bg-orange-400' :
        'bg-red-500'
 
    // ─── EFFETS ───────────────────────────────────────────────────────────────
 
    // Chargement initial — récupère les données de l'utilisateur connecté
    useEffect(() => {
        seConnecter()
    }, [])
 
    // Écoute les mises à jour de profil (ex : changement de photo depuis Setting)
    // pour maintenir les données utilisateur à jour dans le composant
    useEffect(() => {
        window.addEventListener('profilMisAJour', seConnecter)
        return () => window.removeEventListener('profilMisAJour', seConnecter)
    }, [])
 
    // Initialise les animations AOS au scroll
    useEffect(() => {
        AOS.init({
            duration: 1000, // Durée de l'animation en ms
            once: false,    // L'animation se répète à chaque scroll
        })
    }, [])
 
    // Charge les détails de l'événement depuis l'API via l'ID dans l'URL
    useEffect(() => {
        const chargerEvenement = async () => {
            setEnAttente(true)
            try {
                const reponse = await axios.get(`${API_URL}/api/evenements/${id}/`)
                setEvenement(reponse.data)
            } catch (_err) {
                console.error(_err)
            } finally {
                setEnAttente(false)
            }
        }
        chargerEvenement()
    }, [id])
 
    // ─── CONTENU ACHAT (partagé entre desktop et drawer mobile) ──────────────
    // Ce bloc JSX est utilisé deux fois : dans la colonne droite desktop
    // et dans le drawer mobile. On le définit ici pour éviter la duplication.
    const contenuAchat = (
        <div className='bg-[#C2611F]/20 w-full rounded-md font-bold'>
            {/* CHOISIR LE TYPE DE BILLET */}
            <div className='flex flex-col justify-center items-start gap-2 p-4'>
                <p className='text-sm'>Type de billet</p>
                {evenementAchetable ? (
                    <div className='text-sm w-full'>
                        <select
                            name="billet"
                            id="billet"
                            className='w-full h-10 text-[12px] bg-[#C2611F]/10 rounded-md px-2'
                            onChange={(e) => {
                                const categorie = evenement.categories.find(c => c.id === parseInt(e.target.value))
                                setCategorieChoisie(categorie)
                                // Remet la quantité à 1 quand on change de catégorie
                                setQuantite(1)
                            }}
                        >
                            <option className='w-full bg-[#C2611F]/20' value="">Choisir une catégorie</option>
                            {evenement?.categories?.map(categorie => (
                                <option className='w-full bg-[#C2611F]/20' key={categorie.id} value={categorie.id}>
                                    {categorie.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                 ) : (
                    <p className='text-red-400 text-sm'>Billets indisponibles</p>
                )}
            </div>
 
            {/* BARRE DE SEPARATION */}
            <div className='h-1 w-[90%] bg-[#C2611F]/40 mx-auto'></div>
 
            {/* INFORMATIONS SUR L'EVENEMENT */}
            <div className='w-full p-4 flex flex-col gap-4'>
                {/* DATE ET HEURE */}
                <div className='flex flex-col justify-center items-start pt-2'>
                    <div className='flex justify-center items-start gap-2'>
                        <img className='h-5 w-5' src={calendrier} alt="Logo du calendrier" />
                        <p className='text-[14px] font-bold'>Date & Heure</p>
                    </div>
                    <div className='flex flex-col justify-center items-start text-[12px] pl-6'>
                        {/* Date lisible en français */}
                        <p className='text-gray-600'>
                            {new Date(evenement?.dateLancement).toLocaleDateString('fr-FR', {
                                day: 'numeric', month: 'long', year: 'numeric'
                            })}
                        </p>
                        {/* Heure */}
                        <p className='font-bold'>
                            {new Date(evenement?.dateLancement).toLocaleTimeString('fr-FR', {
                                hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>
                </div>
 
                {/* LIEU */}
                <div className='flex justify-start items-center gap-2'>
                    <img className='h-5 w-5' src={map} alt="Icon de la localisation" />
                    {evenement?.estVirtuel ? (
                    <div className='flex flex-col gap-1'>
                        <div className='flex items-center gap-2'>
                            <span>🌐</span>
                            <p className='text-[14px] font-bold'>Événement en ligne</p>
                        </div>
                        {evenement?.lienVirtuel && (
                            <a 
                                href={evenement.lienVirtuel}
                                target='_blank'
                                rel='noreferrer'
                                className='text-blue-500 text-sm underline pl-6 hover:text-blue-700'
                            >
                                Rejoindre la réunion →
                            </a>
                        )}
                    </div>
                ) : (
                    <div className='flex justify-start items-center gap-2'>
                        <p className='text-[14px] font-bold'>
                            <p className='text-[14px] font-bold'>{evenement?.ville}</p>
                            <p className='text-[14px] font-bold'>({evenement?.lieu})</p>
                        </p>
                    </div>
                )}
                </div>
 
                {/* STATUT — formaterStatut convertit 'en_preparation' en 'En préparation' */}
                <div className='flex justify-start items-center gap-2'>
                    <img className='h-5 w-5' src={calendrier} alt="Logo du statut" />
                    <p className='text-[14px] font-bold'>{formaterStatut(evenement?.statut)}</p>
                </div>
            </div>
            
            {/* BARRE DE PROGRESSION */}
            <div className='flex flex-col gap-1 mx-4'>
                <div className='w-full h-3 bg-[#C2611F]/30 rounded-full overflow-hidden'>
                    <div 
                        className={`h-full rounded-full transition-all duration-500 ${couleurBarre}`}
                        style={{ width: `${pourcentageRestant}%` }}
                    />
                </div>
                {/* Message selon disponibilité — sans chiffres */}
                <p className='text-xs text-gray-500'>
                    {pourcentageRestant < 20 ? 'Fait vite, reserve ton billet !' :
                    pourcentageRestant < 50 ? 'Places limitées' :
                    'Places disponibles'}
                </p>
            </div>
 
            {/* BARRE DE SEPARATION */}
            {/* <div className='h-1 w-[90%] bg-[#C2611F]/40 mx-auto'></div> */}
 
            {/* SECTION RESERVATION — visible seulement si une catégorie est choisie */}
            <div className='font-[500] p-4'>
            {!evenementAchetable ? (
                // Événement terminé ou annulé
                <div className='text-center py-4'>
                    <p className='text-red-500 font-bold text-lg'>
                        {evenement?.statut === 'annule' ? 'Événement annulé' : 'Événement terminé'}
                    </p>
                    <p className='text-gray-500 text-sm mt-2'>
                        Les billets ne sont plus disponibles pour cet événement.
                    </p>
                </div>
            ) : categorieChoisie ? (
                // Catégorie choisie — affiche prix + quantité + bouton
                <div className='flex flex-col gap-6'>
                        {/* Prix unitaire */}
                        <div>
                            <p>Prix par personne</p>
                            <p className='text-4xl font-bold'>{categorieChoisie.prix} FCFA</p>
                        </div>
                        {/* Places restantes */}
                        <div>
                            <p>Disponibilité</p>
                            <p className='text-4xl font-bold'>
                                {categorieChoisie.nombreRestant}
                                <span className='font-[100] text-xl'> places restantes</span>
                            </p>
                        </div>
                        {/* SELECTEUR DE QUANTITE */}
                        <div className='flex flex-col gap-4'>
                            <p>Nombre de billets</p>
                            <div className='w-full flex gap-4 h-12'>
                                {/* Bouton moins */}
                                <button
                                    onClick={decrementer}
                                    className='w-1/4 bg-[#C2611F]/30 flex justify-center items-center rounded-xl cursor-pointer hover:bg-[#C2611F]/50 transition-all'
                                >-</button>
                                {/* Compteur */}
                                <div className='w-2/4 bg-[#C2611F]/40 flex justify-center items-center rounded-xl'>{quantite}</div>
                                {/* Bouton plus */}
                                <button
                                    onClick={incrementer}
                                    className='w-1/4 bg-[#C2611F]/30 flex justify-center items-center rounded-xl cursor-pointer hover:bg-[#C2611F]/50 transition-all'
                                >+</button>
                            </div>
                            {/* BOUTON RESERVER — visible seulement si connecté */}
                            {token && (
                                <button
                                    onClick={() => setModalOuvert(true)}
                                    className='w-full h-12 bg-[#C2611F] text-white flex justify-center items-center rounded-xl cursor-pointer hover:bg-[#a14f19] transition-all'
                                >
                                    Réserver ma place
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    // Message par défaut si aucune catégorie n'est sélectionnée
                    <p className='text-gray-500 text-sm text-center py-4'>
                        Sélectionnez une catégorie pour voir les prix et réserver
                    </p>
                )}
            </div>
 
            {/* BARRE DE SEPARATION */}
            <div className='h-1 w-[90%] bg-[#C2611F]/40 mx-auto'></div>
 
            {/* MOT DE FIN */}
            <div className='text-[14px] flex justify-center items-center gap-2 p-4'>
                <img className='h-7 w-7' src={shield} alt="Logo de sécurité" />
                <p>Paiement 100% sécurisé</p>
            </div>
        </div>
    )
 
    // ─── RENDU ────────────────────────────────────────────────────────────────
    return (
        <div>
            {/* ── SECTION 1 : HERO ──────────────────────────────────────────────── */}
            <section
                className="relative text-[#F1F1F1] font-bold h-[70vh] w-full flex md:flex-row bg-cover bg-center p-4"
                style={{ backgroundImage: `url(${evenement?.image || background})` }}
            >
                {/* Overlay sombre pour lisibilité du texte */}
                <div className="absolute inset-0 bg-black/70"></div>
 
                <div className='z-10 flex flex-col justify-between items-start w-full'>
                    {/* BOUTON RETOUR */}
                    <button
                        onClick={() => navigate(-1)}
                        className='bg-[#C2611F]/30 flex justify-center items-center gap-2 text-[12px] text-[#F1F1F1] px-4 py-3 rounded-xl font-bold cursor-pointer hover:px-6 hover:bg-[#C2611F]/50 transition-all'
                    >
                        <img className='h-5 w-5' src={move_left} alt="Retour" />
                        <p>Retour</p>
                    </button>
                    {/* TITRE + TYPE + AVIS + PARTICIPANTS */}
                    <div className='flex items-center animate__animated animate__zoomInLeft'>
                        <div className='flex flex-col items-start justify-center gap-4'>
                            {/* Titre de l'événement */}
                            <h1 className='text-3xl md:text-5xl font-bold text-[#F1F1F1]'>
                                {evenement?.titre}
                            </h1>
                            {/* Badge type d'événement */}
                            <div className='w-40 h-10 border-1 border-[#C2611F] text-white text-[12px] flex justify-center items-center px-4 py-1 rounded-xl'>
                                <p>{evenement?.typeEven}</p>
                            </div>
                            {evenement?.estVirtuel && (
                                <div className='w-32 h-10 border border-blue-400 text-blue-300 text-[12px] flex justify-center items-center rounded-xl'>
                                    Virtuel
                                </div>
                            )}
                            {/* Avis et participants — données statiques pour l'instant */}
                            <div className='flex items-center justify-center gap-4 flex-wrap'>
                                <div className='flex justify-center items-center'>
                                    <img className='h-5 w-5' src={star} alt="Étoile" />
                                    <p className='text-sm'>  /  ( avis)</p>
                                </div>
                                <span className='text-[20px]'>·</span>
                                <div className='flex justify-center items-center'>
                                    <img className='h-5 w-5' src={users} alt="Participants" />
                                    <p className='text-sm'>  Vues</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
 
            {/* ── SECTION 2 : INFOS + ACHAT ─────────────────────────────────────── */}
            {/* Sur mobile : colonne unique (flex-col)
                Sur desktop : deux colonnes côte à côte (md:flex-row) */}
            <section className='flex flex-col md:flex-row justify-center items-center md:items-start w-full bg-gray-200'>
                {/* ── COLONNE GAUCHE : INFORMATIONS ─────────────────────────────── */}
                {/* Prend toute la largeur sur mobile, 3/5 sur desktop */}
                <div className='w-full md:w-3/5 h-full flex flex-col justify-center items-center gap-4 m-4'>
 
                    {/* À PROPOS */}
                    <div data-aos="fade-up" className='w-[90%] min-h-40 bg-gray-100 p-4 flex flex-col justify-center items-start rounded-md gap-2'>
                        <h1 className='font-bold text-lg'>À propos de l'événement</h1>
                        <p className='bg-[#C2611F]/20 overflow-auto w-full rounded-md p-4 text-sm leading-relaxed'>
                            {/* Si voirPlus est false — affiche seulement 200 caractères
                                Si voirPlus est true — affiche tout le texte */}
                            {voirPlus 
                                ? evenement?.description
                                : evenement?.description?.slice(0, 200)
                            }
                            {/* Affiche "..." et le bouton seulement si la description dépasse 200 caractères */}
                            {evenement?.description?.length > 200 && (
                                <>
                                    {!voirPlus && '...'}
                                    <button
                                        onClick={() => setVoirPlus(!voirPlus)}
                                        className='block text-[#C2611F] font-bold mt-2 hover:underline cursor-pointer'
                                    >
                                        {voirPlus ? 'Voir moins ↑' : 'Voir plus ↓'}
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                    
                    {/* GALERIE PHOTOS */}
                    <div data-aos="fade-up" className='w-[90%] bg-gray-100 p-4 font-bold flex flex-col rounded-md gap-2'>
                        <CarrouselEvenements 
                            image={evenement?.image}
                            photos={evenement?.photos || []}
                        />
                    </div>
 
                    {/* ORGANISATEUR */}
                    <div data-aos="fade-up" className='w-[90%] h-full bg-gray-100 p-4 font-bold flex flex-col rounded-xl gap-2 mb-24 md:mb-4'>
                        <h1>Organisé par</h1>
                        <div className="w-full flex items-center justify-start gap-4 bg-[#C2611F]/20 rounded-md p-6">
                            {/* Photo de profil de l'organisateur */}
                            <div className="bg-[#C2611F] w-16 h-16 md:w-20 md:h-20 rounded-full flex justify-center items-center overflow-hidden flex-shrink-0">
                                {evenement?.organisateur?.photoProfil ? (
                                    <img
                                        src={evenement.organisateur.photoProfil}
                                        className='h-full w-full object-cover rounded-full'
                                        alt="Photo de l'organisateur"
                                    />
                                ) : (
                                    <img className='h-8 w-8' src={users} alt="Utilisateur" />
                                )}
                            </div>
                            {/* Nom de l'organisateur */}
                            <div className="flex flex-col">
                                <h1 className="font-bold text-lg md:text-2xl">
                                    {evenement?.organisateur?.first_name} {evenement?.organisateur?.last_name}
                                </h1>
                                <p className="text-gray-500 text-sm">Organisateur vérifié</p>
                            </div>
                        </div>
                    </div>
                    {/* BOUTON PARTAGER — dans le Hero, en haut à droite */}
                    <div className='flex flex-col md:flex-row justify-center items-center gap-2 cursor-pointer absolute top-4 right-4 z-50 text-white'>
                        <button className='flex justify-center items-center gap-2 bg-white/20 w-full px-4 py-2 rounded-xl cursor-pointer hover:text-[#C2611F] transition-all' onClick={copierLien}>
                            <img className='h-5 w-5' src={link} alt="Logo de l'information" />
                            <p>{lienCopie ? 'Lien copié !' : 'Copier'}</p>
                        </button>
                        <button className='flex justify-center items-center gap-2 bg-white/20 w-full px-4 py-2 rounded-xl cursor-pointer hover:text-[#C2611F] transition-all' onClick={partagerWhatsApp}>
                            <img className='h-5 w-5' src={whatsapp} alt="Logo de l'information" />
                            <p>WhatsApp</p>
                        </button>
                        {navigator.share && (
                            // N'affiche le bouton natif que si le navigateur le supporte
                            <button className='flex justify-center items-center gap-2 bg-white/20 w-full px-4 py-2 rounded-xl cursor-pointer hover:text-[#C2611F] transition-all' onClick={partagerNatif}>
                                <img className='h-5 w-5' src={send} alt="Logo de l'information" />
                                <p>Partager</p>
                            </button>
                        )}
                    </div>
                </div>

                {/* ── COLONNE DROITE : ACHAT DE BILLET (DESKTOP UNIQUEMENT) ─── */}
                {/* hidden sur mobile — le drawer prend le relais sur mobile */}
                {/* visible (flex) à partir de md */}
                <div className='hidden md:flex relative w-2/5 justify-center items-start py-4 px-2'>
                    <div className='sticky top-4 w-full max-w-sm'>
                        {contenuAchat}
                    </div>
                </div>
            </section>

            {/* BOUTON FIXE MOBILE — visible dès que l'événement est chargé */}
            {token && evenement && (
                <div className='md:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-white border-t border-gray-200 shadow-lg'>
                    <button
                        onClick={() => setDrawerOuvert(true)}
                        className='w-full h-14 bg-[#C2611F] text-white font-bold rounded-xl text-lg'
                    >
                        {categorieChoisie 
                            ? `Réserver — ${(quantite * (categorieChoisie?.prix || 0)).toFixed(0)} FCFA`
                            : 'Choisir mes billets'
                        }
                    </button>
                </div>
            )}
            {/* ── DRAWER MOBILE ──────────────────────────────────────────────────── */}
            {/* Visible uniquement sur mobile (md:hidden)
                S'ouvre depuis le bas quand drawerOuvert === true
                Contient le même contenu que la colonne droite desktop */}
            {drawerOuvert && (
                <div className='md:hidden fixed inset-0 z-50'>
                    {/* Overlay sombre — clic pour fermer le drawer */}
                    <div
                        className='absolute inset-0 bg-black/60'
                        onClick={() => setDrawerOuvert(false)}
                    />
                    {/* Panneau blanc qui remonte depuis le bas */}
                    <div className='absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl flex flex-col max-h-[85vh]'>
                        {/* Barre grise de fermeture en haut du drawer */}
                        <div className='flex justify-center pt-3 pb-2'>
                            <div className='w-12 h-1 bg-gray-300 rounded-full'></div>
                        </div>
                        {/* Contenu scrollable du drawer */}
                        <div className='overflow-y-auto px-4 pb-6'>
                            {/* contenuAchat contient : sélect catégorie, infos date/lieu/statut,
                                sélecteur quantité, bouton réserver, mention paiement sécurisé */}
                            {contenuAchat}
                        </div>
                    </div>
                </div>
            )}
 
            {/* ── MODAL DE CONFIRMATION ──────────────────────────────────────────── */}
            {/* S'ouvre quand l'utilisateur clique sur "Réserver ma place"
                Affiche le récap de la commande avant confirmation finale */}
            {modalOuvert && (
                <div className='fixed inset-0 bg-black/60 z-50 flex justify-center items-center px-4'>
                    <div className='bg-white rounded-xl p-6 md:p-8 w-full max-w-md flex flex-col gap-4'>
                        <h2 className='text-xl font-bold'>Confirmer la réservation</h2>
                        {/* Récapitulatif */}
                        <p className='text-gray-600'>{quantite} billet(s) — {categorieChoisie?.nom}</p>
                        <p className='text-2xl font-bold text-[#C2611F]'>
                            Total : {(quantite * (categorieChoisie?.prix || 0)).toFixed(0)} FCFA
                        </p>
                        {/* Sélecteur méthode de paiement */}
                        <select
                            value={methode}
                            onChange={(e) => setMethode(e.target.value)}
                            className='border border-gray-300 rounded-lg p-2'
                        >
                            <option value="MTN">MTN Mobile Money</option>
                            <option value="ORANGE">Orange Money</option>
                        </select>
                        {/* Champ numéro — pré-rempli avec le téléphone du profil */}
                        <input
                            type="text"
                            placeholder="Numéro (ex: 677...)"
                            value={numero || utilisateur?.phone || ''}
                            onChange={(e) => setNumero(e.target.value)}
                            className="border border-gray-300 p-2 rounded-lg"
                        />
                        {/* Boutons d'action */}
                        <div className='flex gap-4'>
                            <button
                                onClick={() => setModalOuvert(false)}
                                className='w-1/2 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all'
                            >
                                Annuler
                            </button>
                            <button
                                onClick={async () => {
                                    setModalOuvert(false)
                                    setDrawerOuvert(false) // Ferme aussi le drawer si ouvert sur mobile
                                    await payer()
                                }}
                                className='w-1/2 py-3 bg-[#C2611F] text-white rounded-xl hover:bg-[#a14f19] transition-all'
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
 
            {/* ── MESSAGE DE CONFIRMATION ────────────────────────────────────────── */}
            {/* Affiché brièvement après une réservation réussie
                Disparaît automatiquement après 1 seconde puis redirige vers /billets */}
            {messageConfirmation && (
                <div className='fixed inset-0 bg-black/60 z-50 flex justify-center items-start pt-10 px-4'>
                    <div className='bg-white/90 rounded-xl p-8 w-full max-w-sm flex flex-col justify-center items-center gap-4'>
                        <h2 className='text-xl font-bold text-green-800 text-center'>
                            Votre billet a bien été réservé !
                        </h2>
                        <p className='text-gray-500 text-sm'>Redirection vers vos billets...</p>
                    </div>
                </div>
            )}
        </div>
    )
}