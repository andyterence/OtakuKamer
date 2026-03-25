import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import background from '../assets/imgs/background.jpg'
import move_left from '../assets/icons/left.svg'
import star from '../assets/icons/star.svg'
import users from '../assets/icons/users.svg'
import calendrier from "../assets/icons/calendar-days-svgrepo-com.svg";
import map from '../assets/icons/map-check.svg'
import shield from '../assets/icons/shield-check.svg'
import ticket from '../assets/icons/ticket-check.svg'
// import notif from '../../assets/icons/bell.svg'

export default function EvenementShow() {

    const { id } = useParams()
    const [evenement, setEvenement] = useState(null)
    const [enAttente, setEnAttente] = useState(false)
    // DECREMENTATION ET INCREMENTATION POUR L'ACHAT DES BILLETS
    const [quantite, setQuantite] = useState(1)
    // UseState qui va se charger de la liste des evenements selon le type
    const [categorieChoisie, setCategorieChoisie] = useState(null)
    // Pour pouvoir naviguer entre les pages
    const navigate = useNavigate()
    // Etat pour refuser l'autorisation a un element aux personnes qui ne sont pas connecter
    const token = localStorage.getItem('access')

    // FONCTION POUR LA RESERVATION
    const reserver = async () => {
    if (!categorieChoisie) {
        alert('Veuillez choisir une catégorie !')
        return
    }
    try {
        const token = localStorage.getItem('access')
        const reponse = await axios.post(
            'http://localhost:8000/api/billet/',
            { categorie: categorieChoisie.id, quantite: quantite },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        navigate('/billets')
    } catch (_err) {
        console.error(_err)
    }
    }
    const incrementer = () => {
        if (quantite < categorieChoisie?.nombreRestant) {
            setQuantite(quantite + 1)
        }
    }
    const decrementer = () => {
        if (quantite > 1) {
            setQuantite(quantite - 1)
        }
    }

    useEffect(() => {
        const chargerEvenement = async() => {
            setEnAttente(true)
            try {
                const reponse = await axios.get(`http://localhost:8000/api/evenements/${id}/`)
                setEvenement(reponse.data)
            } catch (_err) {
                console.error(_err)
            } finally {
                setEnAttente(false)
            }
        }
        chargerEvenement()
    }, [id])


    return (
        <div>
            {/* PREMIERE SECTION HERO - L'IMAGE DE L'EVENEMENT */}
            <section className="relative text-[#F1F1F1] font-bold h-[70vh] w-full flex md:flex-row bg-cover-center md:p-4"
                style={{ backgroundImage: `url(${evenement?.image || background})` }}>
                {/* Overlay sombre */}
                <div className="absolute inset-0 bg-black/70"></div>
                <div className='z-10 flex flex-col justify-between items-start'>
                    {/* Bouton retour */}
                    <div>
                        <button 
                            onClick={() => navigate(-1)}
                            className='bg-[#C2611F]/30 flex justify-center items-center gap-2 text-[12px] text-[#F1F1F1] px-4 py-3 rounded-xl font-bold cursor-pointer hover:px-6 hover:bg-[#C2611F]/50 transition-all'>
                            <img className='h-5 w-5' src={move_left} alt="Logo de mes evenements" />
                            <p>Retour</p>
                        </button>
                    </div>
                    {/* Section - TYPE + TITRE + AVIS + PARTICIPANTS */}
                    <div className='flex jusfity-evenly items-center'>
                        <div className='flex flex-col items-center justify-center gap-4'>
                            {/* Titre */}
                            <div>
                                <h1 className='text-5xl font-bold text-[#F1F1F1]'>
                                    {evenement?.titre}
                                </h1>
                            </div>
                            {/* Type */}
                            <div className='w-40 h-10 bg-[#C2611F] text-white text-[12px] flex justify-center items-center px-4 py-1 rounded-full'>
                                <p>{evenement?.typeEven}</p>
                            </div>
                            <div className='flex justify-center items-center gap-4'>
                                {/* Participants + Avis */}
                                <div className='flex items-center justify-center gap-6'>
                                    <div className='flex justify-center items-center'>
                                        <img className='h-5 w-5' src={star} alt="Logo de mes evenements" />
                                        <p> 4.5 / 5 (156 avis)</p>
                                    </div>
                                    <div className='flex justify-center items-center text-[20px]'>.</div>
                                    <div className='flex justify-center items-center'>
                                        <img className='h-5 w-5' src={users} alt="Logo de mes evenements" />
                                        <p> 120 participants</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* DEUXIEME SECTION INFORMATION SUR L'EVEN */}
            <section className='flex justify-center w-full h-full bg-gray-200'>
                {/* PREMIERE COLONE */}
                <div className='w-3/5 h-full flex flex-col justify-center items-center gap-4 m-4'>
                    {/* À propos de l'événement */}
                    <div className='w-full h-110 bg-gray-100 p-4 font-bold flex flex-col justify-center items-start rounded-md gap-2'>
                        <h1>À propos de l'événement</h1>
                        <p className='bg-[#C2611F]/20 h-full w-full rounded-md p-4'>
                            {evenement?.description}
                        </p>
                    </div>
                    {/* Galerie */}
                    <div className='w-full h-90 bg-gray-100 p-4 font-bold flex flex-col rounded-md gap-2'>
                        <h1>Galerie</h1>
                        <div className='h-full w-full flex justify-center items-center gap-2'>
                            {evenement?.photos?.map(photo => (
                                <div 
                                    key={photo.id}
                                    className='bg-cover bg-center h-full w-full rounded-xl cursor-pointer'
                                    style={{ backgroundImage: `url(${photo.image})` }}>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Organisé par */}
                    <div className='w-full h-full bg-gray-100 p-4 font-bold flex flex-col rounded-xl gap-2'>
                        <h1>Organisé par</h1>
                        <div className="w-full h-35 flex items-center justify-start gap-2 bg-[#C2611F]/20 rounded-md p-10">
                            {/* Icon de l'organisateur */}
                            <div className="bg-[#C2611F] w-25 h-25 rounded-full flex justify-center items-center">
                                <img className='h-10 h-10' src={users} alt="Logo d'utilisateur" />
                            </div>
                            {/* Nom de l'organisation */}
                            <div className="flex flex-col">
                                <h1 className="font-bold text-2xl">{evenement?.organisateur?.first_name} {evenement?.organisateur?.last_name}</h1>
                                <p className="text-gray-500 text-md">Organisateur verifier</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* DEUXIEME COLONE - INFO SUR L'ACHAT DE BILLET*/}
                <div className='relative w-2/5 bg-gray-200 flex justify-center items-start py-4'>
                    <div className='sticky top-0 bg-[#C2611F]/20 w-100 min-h-screen rounded-md font-bold'>
                        {/* CHOISIR LE TYPE DE BILLET */}
                        <div className='flex flex-col justify-center items-start gap-2 p-4'>
                            <div className='text-sm'>
                                <p>Type de billet</p>
                            </div>
                            <div className='text-sm w-full'>
                                <select
                                    name="billet" 
                                    id="billet" 
                                    className='w-full h-10 text-[12px] bg-[#C2611F]/10'
                                    onChange={(e) => {
                                        const categorie = evenement.categories.find(c => c.id === parseInt(e.target.value))
                                        setCategorieChoisie(categorie)
                                    }}
                                    >
                                    <option 
                                    className='w-full bg-[#C2611F]/20' 
                                    value=""> Choisir une catégorie </option>
                                    {evenement?.categories?.map(categorie => (
                                        <option className='w-full bg-[#C2611F]/20' key={categorie.id} value={categorie.id}>
                                            {categorie.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* BARRE DE SEPARATION */}
                        <div className='h-1 w-[90%] bg-[#C2611F]/40 mx-auto'></div>
                        {/* INFORMATION SUR L'EVEN */}
                        <div className='w-full p-4'>
                            {/* INFORMATION SPECIFIQUE */}
                            <div className='flex flex-col gap-4'>
                                {/* INFORMATION SUR LA DATE & HEURE */}
                                <div>
                                    {/* Date et heure */}
                                    <div className='flex flex-col justify-center items-start pt-4'>
                                        <div className='flex justify-center items-start gap-2'>
                                            <img className='h-5 w-5' src={calendrier} alt="Logo du calendrier" />
                                            <p className='text-[14px] font-bold'>Date & Heure</p>
                                        </div>
                                        {/* CASE DATE ET HEURE */}
                                        <div className='flex flex-col justify-center items-start text-[12px] pl-6'>
                                            {/* Date */}
                                            <div className='flex justify-start items-center text-gray-600'>
                                                <p>{new Date(evenement?.dateLancement).toLocaleDateString('fr-FR', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            {/* Heure */}
                                            <div className='flex justify-start items-center gap-2'>
                                                <p className='font-bold'>
                                                    {new Date(evenement?.dateLancement).toLocaleTimeString('fr-FR', {
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* LIEU */}
                                <div className='flex justify-start items-center gap-2'>
                                        <img className='h-5 w-5' src={map} alt="Icon de la localisation" />
                                        <p className='text-[14px] font-bold'>{evenement?.lieu}</p>
                                    </div>
                                {/* DISPONIBILITE */}
                                <div></div>
                            </div>
                            {/* NOMBRE DE BILLETS */}
                            <div>
                                <div className='flex justify-start items-center gap-2'>
                                    <img className='h-5 w-5' src={calendrier} alt="Logo du lieu" />
                                    <p className='text-[14px] font-bold'>{evenement?.statut}</p>
                                </div>
                            </div>
                        </div>
                        {/* BARRE DE SEPARATION */}
                        <div className='h-1 w-[90%] bg-[#C2611F]/40 mx-auto'></div>
                        {/* RESERVATION */}
                        <div className='font-[500] p-4'>
                            {categorieChoisie && (
                                // AFFICHE LE PRIX SELON LE BILLET ET LES PLACES RESTANTES
                                <div className='flex flex-col gap-6'>
                                    <div>
                                        <p>Prix par personne</p>
                                        <p className='text-4xl font-bold'>{categorieChoisie.prix} FCFA</p>
                                    </div>
                                    <div>
                                        <p>Disponibilité</p>
                                        <p className='text-4xl font-bold'>{categorieChoisie.nombreRestant} <span className='font-[100] text-xl'>places restantes</span></p>
                                    </div>
                                    <div className='flex flex-col gap-4'>
                                        <p>Nombre de billets</p>
                                        {/* PARTIE INCREMENTATION */}
                                        <div className='w-full flex gap-4 h-12'>
                                            {/* DECREMENTATION */}
                                            <button 
                                                onClick={decrementer}
                                                className='w-1/4 bg-[#C2611F]/30 flex justify-center items-center rounded-xl cursor-pointer hover:px-6 hover:bg-[#C2611F]/50 transition-all'>-</button>
                                            {/* COMPTEUR */}
                                            <div className='w-2/4 bg-[#C2611F]/40 flex justify-center items-center rounded-xl'>{quantite}</div>
                                            {/* INCREMENTATION */}
                                            <button
                                                onClick={incrementer}
                                                className='w-1/4 bg-[#C2611F]/30 flex justify-center items-center rounded-xl cursor-pointer hover:px-6 hover:bg-[#C2611F]/50 transition-all'>+</button>
                                        </div>
                                        {/* BUTON DE RESERVATION */}
                                        {token && (
                                            <button
                                                onClick={reserver}
                                                className='w-full h-12 bg-[#C2611F]/30 flex justify-center items-center rounded-xl cursor-pointer hover:px-6 hover:bg-[#C2611F]/50 transition-all'
                                                >
                                                    Reserver ma place
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* BARRE DE SEPARATION */}
                        <div className='h-1 w-[90%] bg-[#C2611F]/40 mx-auto'></div>
                        {/* MOT DE FIN */}
                        <div className='text-[14px] flex justify-center items-center gap-2 p-4'>
                            <img className='h-7 w-7' src={shield} alt="Logo de mes evenements" />
                            <p>Paiement 100% sécurisé</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}