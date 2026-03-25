import { useState } from 'react'
// Ajoute cet import
import { useNavigate } from 'react-router-dom'
import Sidebar from "../components/shared/sidebar";
import axios from 'axios'
import imageIcon from '../assets/icons/image.svg'
// import background from '../assets/imgs/background.jpg'
// import move_left from '../assets/icons/move-left.svg'
// import star from '../assets/icons/star.svg'
// import users from '../assets/icons/users.svg'
import calendrier from "../assets/icons/calendar-days-svgrepo-com.svg";
import map from '../assets/icons/map-check.svg'
import note from '../assets/icons/note.svg'
import tags from '../assets/icons/tags.svg'
import tag from '../assets/icons/tag.svg'
// import money from '../assets/icons/money.svg'
import clock from '../assets/icons/clock.svg'
// import notif from '../../assets/icons/bell.svg'

export default function CreateEven() {

    const [titre, setTitre] = useState('')
    const [description, setDescription] = useState('')
    const [typeEven, setTypeEven] = useState('')
    // const [categorieBillet, setCategorieBillet] = useState('')
    const [date, setDate] = useState('')
    const [heure, setHeure] = useState('')
    const [ville, setVille] = useState('')
    const [lieu, setLieu] = useState('')
    const [image, setImage] = useState(null)
    const [statut, setStatut] = useState('en_preparation')
    const [enAttente, setEnAttente] = useState(false)
    // Pour pouvoir naviguer entre les pages
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Préparation des données (obligatoire pour les fichiers/images)
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('description', description);
    formData.append('typeEven', typeEven);
    formData.append('ville', ville);
    formData.append('lieu', lieu);
    formData.append('prix', 0); 
    formData.append('statut', statut)
    
    // Fusion Date + Heure pour le format DateTime de Django
    if (date && heure) {
        formData.append('dateLancement', `${date}T${heure}:00`);
    }

    // L'image
    if (image) {
        formData.append('image', image);
    }

    try {
        setEnAttente(true);
        // Récupère ton token (depuis le localStorage ou un context)
        const token = localStorage.getItem('access')

        const response = await axios.post('http://localhost:8000/api/evenements/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}` // Nécessaire pour perform_create
            }
        });
        
        console.log("Succès !", response.data);
        navigate('/accueil')
    } catch (error) {
        console.error("Erreur détaillée :", error.response?.data);
    } finally {
        setEnAttente(false);
    }
};


    return (
        <div className='flex'>
            {/* SIDEBAR */}
            <aside className="w-1/7 sticky top-0 h-screen">
                <Sidebar />
            </aside>
            {/* SECTION PRINCIPALE */}
            <section className="w-6/7 h- bg-gray-200 flex flex-col justify-center items-center gap-10">
                {/* TITRE ET SOUS TITRE */}
                <div className='w-full flex flex-col justify-center items-start font-bold md:p-10 md:pb-0'>
                    <h1 className='text-4xl'>Créer un Événement</h1>
                    <p className='text-md text-[#C2611F]'>Remplissez les informations pour créer votre événement</p>
                </div>
                {/* INFROMATION A REMPLIRE POUR LA CREATION DE L'EVNEMENT */}
                <div className='w-full px-10'>
                    {/* FORMULAIRE DE REMPLISSAGE */}
                    <form 
                        onSubmit={handleSubmit}
                        action=""
                         className='flex flex-col gap-8'
                        >
                        {/* PHOTO DE COUVERTURE */}
                        <div className='w-full flex flex-col justify-center items-center gap-4 w-[70%] h-[50vh] bg-[#C2611F]/10 rounded-xl'>
                            <div className='w-full h-1/10 flex justify-start items-center gap-2 font-[500] px-10 pt-2'>
                                <img className='h-6 w-6' src={imageIcon} alt="Icone_de_la_photo_de_couverture" />
                                <h1>Photo de couverture</h1>
                            </div>
                            {/* CONTENEUR DE LA PHOTO */}
                            <input
                                type='file' 
                                onChange={(e) => setImage(e.target.files[0])}
                                className='bg-[#C2611F]/20 w-[90%] h-9/10 cursor-pointer mb-6 rounded-xl'
                            >
                            </input>
                        </div>
                        {/* INFORMATION DE BASES */}
                        <div className='w-full flex flex-col justify-center items-center gap-4 w-[70%] h-[70vh] bg-[#C2611F]/10 rounded-xl px-10'>
                            {/* MOT DE REFERENCE */}
                            <div className='w-full flex justify-start items-center gap-2 font-[500]'>
                                <img className='h-6 w-6' src={note} alt="Icone des informations" />
                                <h1>Informations de Base</h1>
                            </div>
                            {/* CONTENEUR DES INFORMATIONS */}
                            <div className='w-full flex flex-col gap-4'>
                                {/* Nom de l'evenement */}
                                <div className='flex flex-col px-4'>
                                    <label htmlFor="name">Nom de l'événement</label>
                                    <input
                                        type='text'
                                        id='name'
                                        onChange={(e) => setTitre(e.target.value)}
                                        placeholder='     Ex:OtakuFest 2026'
                                        className='bg-[#C2611F]/20 h-10 cursor-pointer rounded-md'
                                    >
                                    </input>
                                </div>
                                {/* Description complète */}
                                <div className='flex flex-col px-4'>
                                    <label htmlFor="description_long">Description complète</label>
                                    <input
                                        type='text' 
                                        id='description_long'
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder='     Decrivez votre evenement en detail...'
                                        className='bg-[#C2611F]/20 h-90 cursor-pointer rounded-md'
                                    >
                                    </input>
                                </div>
                            </div>
                        </div>
                        {/* DETAILS DE L'EVENEMENT */}
                        <div className='w-full flex flex-col justify-center items-center gap-4 w-[70%] h-[70vh] bg-[#C2611F]/10 rounded-xl px-10'>
                            {/* MOT DE REFERENCE */}
                            <div className='w-full flex justify-start items-center gap-2 font-[500]'>
                                <img className='h-6 w-6' src={tags} alt="Icone des informations" />
                                <h1>Détails de l'Événement</h1>
                            </div>
                            {/* CONTENEUR DES INFORMATIONS */}
                            <div className='w-full flex flex-col gap-8'>
                                {/* Type d'événement & Prix (FCFA) */}
                                <div className='w-full flex gap-4'>
                                    <div className='w-full flex flex-col px-4'>
                                        <div className='w-full flex gap-2'>
                                            <img className='h-5 w-5' src={tag} alt="Icone des informations" />
                                            <label htmlFor="name">Type d'événement</label>
                                        </div>
                                        <input
                                            type='text'
                                            id='name'
                                            onChange={(e) => setTypeEven(e.target.value)}
                                            placeholder='     Ex:OtakuFest 2026'
                                            className='bg-[#C2611F]/20 h-10 cursor-pointer rounded-md'
                                        >
                                        </input>
                                    </div>
                                </div>
                                {/* Date de l'événement & Heure de début */}
                                <div className='w-full flex gap-4'>
                                    <div className='w-full flex flex-col px-4'>
                                        <div className='w-full flex gap-2'>
                                            <img className='h-5 w-5' src={calendrier} alt="Icone des informations" />
                                            <label htmlFor="date">Date de l'événement</label>
                                        </div>
                                        <input
                                            type='date'
                                            id='date'
                                            onChange={(e) => setDate(e.target.value)}
                                            placeholder='     Ex:OtakuFest 2026'
                                            className='bg-[#C2611F]/20 h-10 cursor-pointer rounded-md px-4'
                                        >
                                        </input>
                                    </div>
                                    <div className='w-full flex flex-col px-4'>
                                        <div className='w-full flex gap-2'>
                                            <img className='h-5 w-5' src={clock} alt="Icone des informations" />
                                            <label htmlFor="time">Heure de début</label>
                                        </div>
                                        <input
                                            type='time'
                                            id='time'
                                            onChange={(e) => setHeure(e.target.value)}
                                            placeholder='     Ex:OtakuFest 2026'
                                            className='bg-[#C2611F]/20 h-10 cursor-pointer rounded-md px-4'
                                        >
                                        </input>
                                    </div>
                                </div>
                                {/* Ville & Lieu précis */}
                                <div className='w-full flex gap-4'>
                                    <div className='w-full flex flex-col px-4'>
                                        <div className='w-full flex gap-2'>
                                            <img className='h-5 w-5' src={map} alt="Icone des informations" />
                                            <label htmlFor="name">Ville</label>
                                        </div>
                                        <input
                                            type='text'
                                            id='name'
                                            onChange={(e) => setVille(e.target.value)}
                                            placeholder='     Ex:OtakuFest 2026'
                                            className='bg-[#C2611F]/20 h-10 cursor-pointer rounded-md'
                                        >
                                        </input>
                                    </div>
                                    <div className='w-full flex flex-col px-4'>
                                        <div className='w-full flex gap-2'>
                                            <img className='h-5 w-5' src={map} alt="Icone des informations" />    
                                            <label htmlFor="name">Lieu précis</label>
                                        </div>
                                        <input
                                            type='text'
                                            id='name'
                                            onChange={(e) => setLieu(e.target.value)}
                                            placeholder='     Ex:OtakuFest 2026'
                                            className='bg-[#C2611F]/20 h-10 cursor-pointer rounded-md'
                                        >
                                        </input>
                                    </div>
                                </div>
                                {/* Statut de l'événement */}
                                <div className='flex flex-col px-4'>
                                    <div className='w-full'>
                                        <h1 htmlFor="description_long">Statut de l'événement</h1>
                                    </div>
                                    <div className='w-full'>
                                        <div className='w-full flex gap-4'>
                                            <div className='w-full flex flex-col'>
                                                <select
                                                    type='text'
                                                    id='name'
                                                    onChange={(e) => setStatut(e.target.value)}
                                                    placeholder='     Ex:OtakuFest 2026'
                                                    className='bg-[#C2611F]/20 h-10 cursor-pointer rounded-md'
                                                >
                                                    <option value="en_preparation">En préparation</option>
                                                    <option value="annule">Annulé</option>
                                                    <option value="en_cours">En cours</option>
                                                    <option value="termine">Terminé</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* BUTTON DE PUBLICATION */}
                        <div className='w-full flex justify-center items-center gap-4 md:pb-8'>
                            <button 
                                type="submit" 
                                disabled={enAttente}
                                className='text-black bg-[#C2611F] px-4 h-6 w-2/3 md:h-10 rounded-sm font-bold md:text-lg cursor-pointer transition-all duration-300 hover:shadow-sm shadow-indigo-500/50 hover:bg-[#C2611F]/80'
                            >
                                {enAttente ? 'Création en cours...' : 'Publier l\'événement'}
                            </button>
                            <button 
                                type="button" 
                                disabled={enAttente}
                                className='text-black border-1 border-[#C2611F] px-4 h-6 w-1/3 md:h-10 rounded-sm font-bold md:text-lg cursor-pointer transition-all duration-300 hover:shadow-sm shadow-indigo-500/50 hover:bg-[#C2611F]/90 hover:text-white'
                            >
                                {enAttente ? 'Création en cours...' : 'Enregistrer comme brouillon'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    )
}