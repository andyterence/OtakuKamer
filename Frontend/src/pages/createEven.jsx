import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../utils/api'
import Sidebar from "../components/shared/sidebar";
import Toast from '../components/shared/Toast'
import axios from 'axios'
import imageIcon from '../assets/icons/image.svg'
import calendrier from "../assets/icons/calendar-days-svgrepo-com.svg";
import map from '../assets/icons/map-check.svg'
import note from '../assets/icons/note.svg'
import tags from '../assets/icons/tags.svg'
import tag from '../assets/icons/tag.svg'
import clock from '../assets/icons/clock.svg'
import x from '../assets/icons/x.svg'
import categorie from '../assets/icons/chart-column-stacked.svg'
import menu from '../assets/icons/menu.svg'

export default function CreateEven() {

    const [categories, setCategories] = useState([
        { nom: '', prix: '', nombreteTotale: '' }
    ])
    const [titre, setTitre] = useState('')
    const [description, setDescription] = useState('')
    const [typeEven, setTypeEven] = useState('Tous')
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
    const [modalOuvert, setModalOuvert] = useState(false)
    const [menuOuvert, setMenuOuvert] = useState(false)
    // Pour afficher les messages de succes ou d'erreur après la création de l'événement avec la fonction Toast.jsx dans le dossier shared
    const [toastMessage, setToastMessage] = useState('')
    const [toastType, setToastType] = useState('succes')
    const [photos, setPhotos] = useState([])
    
    // Fonctions pour gérer les catégories
    const ajouterCategorie = () => {
        setCategories([...categories, { nom: '', prix: '', nombreteTotale: '' }])
    }

    const supprimerCategorie = (index) => {
        setCategories(categories.filter((_, i) => i !== index))
    }

    const modifierCategorie = (index, champ, valeur) => {
        const nouvellesCategories = [...categories]
        nouvellesCategories[index][champ] = valeur
        setCategories(nouvellesCategories)
    }

    // Pour formater la date et l'heure au format ISO avant de les envoyer au backend, qui attend ce format pour les champs DateTime
    const formaterDateISO = (dateStr) => {
        if (!dateStr.includes('/')) return dateStr; // Déjà au bon format (tirets)
        const [jour, mois, annee] = dateStr.split('/');
        return `${annee}-${mois}-${jour}`; // Inverse pour avoir AAAA-MM-JJ
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('titre', titre);
        formData.append('description', description);
        formData.append('typeEven', typeEven);
        formData.append('ville', ville);
        formData.append('lieu', lieu);
        formData.append('prix', 0); 
        formData.append('statut', statut);
        
        if (date && heure) {
            try {
                // 1. On prépare la date (gestion des slashs si nécessaire)
                const datePrete = formaterDateISO(date.trim());
                const heureNettoyee = heure.trim();

                // 2. On crée l'objet Date (YYYY-MM-DDTHH:mm:00)
                const dateObj = new Date(`${datePrete}T${heureNettoyee}:00`);

                // 3. Vérification de la validité
                if (isNaN(dateObj.getTime())) {
                    setToastMessage("Le format de la date ou de l'heure est incorrect.");
                    setToastType('erreur');
                    return;
                }

                // 4. Ajout au FormData au format ISO
                formData.append('dateLancement', dateObj.toISOString());
                
            } catch (e) {
                console.error("Erreur de formatage date :", e);
                setToastMessage("Erreur lors de la préparation de la date.");
                setToastType('erreur');
                return;
            }
            } else {
                setToastMessage("Veuillez remplir la date et l'heure.");
                setToastType('erreur');
                return;
            }

            if (image) {
                formData.append('image', image);
            }

            try {
                setEnAttente(true);
                const token = localStorage.getItem('access')
                // ETAPE 1 — Créer l'événement
                const response = await axios.post(`${API_URL}/api/evenements/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
            
            const evenementId = response.data.id  // ← récupère l'ID du nouvel événement
            // Envoyer les photos si présentes
            if (photos.length > 0) {
                const photosFormData = new FormData()
                photos.forEach(photo => {
                    photosFormData.append('photos', photo)  // ← même clé pour toutes
                })
                await axios.post(
                    `${API_URL}/api/evenements/${evenementId}/ajouter-photos/`,
                    photosFormData,
                    { headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }}
                )
            }


            // ETAPE 2 — Créer chaque catégorie liée à cet événement
            for (const categorie of categories) {
                if (categorie.nom && categorie.prix && categorie.nombreteTotale) {
                    await axios.post(`${API_URL}/api/categorie/`, {
                        evenement_id: parseInt(evenementId),
                        nom: categorie.nom,
                        prix: parseFloat(categorie.prix),
                        nombreteTotale: parseInt(categorie.nombreteTotale),
                        nombreRestant: parseInt(categorie.nombreteTotale)  // au départ = total
                    }, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                }
            }
            // Succès
            setToastMessage('Événement créé avec succès !')
            setToastType('succes')
            setTimeout(() => navigate('/accueil'), 2000)
        } catch (error) {
            setToastMessage('Une erreur est survenue, vérifie les champs.')
            setToastType('erreur')
            console.error("Erreur détaillée :", error.response?.data);
        } finally {
            setEnAttente(false);
        }
    };


    return (
        <div className='flex'>
            {/* SIDEBAR */}
            {menuOuvert && (
                <div 
                    className='md:hidden fixed inset-0 bg-black/50 z-50'
                    onClick={() => setMenuOuvert(false)}
                />
            )}
            <button 
                className='md:hidden fixed top-4 left-4 z-50'
                onClick={() => setMenuOuvert(!menuOuvert)}
            >
                <div className='flex justify-center items-center h-9 w-9 bg-black/70 rounded-md z-50'>
                    <img className='h-6 w-6' src={menu} alt="Menu" />
                </div>
            </button>
            <aside className="md:w-1/7 w-0 md:sticky md:top-0 md:h-screen z-50">
                <Sidebar menuOuvert={menuOuvert} setMenuOuvert={setMenuOuvert} />
            </aside>
            {/* SECTION PRINCIPALE */}
            <section className="md:w-6/7 w-full flex flex-col justify-center items-center gap-10">
                {/* TITRE ET SOUS TITRE */}
                <div className='md:w-full flex flex-col justify-center items-start font-bold py-8 md:p-10 pr-0'>
                    <h1 className='text-2xl md:text-4xl'>Créer un Événement</h1>
                    <p className='w-[80%] md:w-full text-sm md:text-md text-[#C2611F]'>Remplissez les informations pour créer votre événement</p>
                </div>
                {/* INFROMATION A REMPLIRE POUR LA CREATION DE L'EVNEMENT */}
                <div className='w-[90%] flex flex-col justify-center items-cente'>
                    {/* FORMULAIRE DE REMPLISSAGE */}
                    <form 
                        onSubmit={handleSubmit}
                        action=""
                         className='flex flex-col gap-8'
                        >
                        {/* PHOTO DE COUVERTURE */}
                        <div className='w-full flex flex-col gap-4 bg-[#C2611F]/10 rounded-xl p-6'>
                            <div className='w-full flex justify-start items-center gap-2 font-[500]'>
                                <img className='h-6 w-6' src={imageIcon} alt="Icone photo" />
                                <h1>Photo de couverture</h1>
                            </div>
                            {/* ZONE DE DROP / APERÇU */}
                            {!image ? (
                                // ÉTAT VIDE — zone de clic stylisée
                                <label
                                    htmlFor="photo-couverture"
                                    className='w-full h-60 flex flex-col justify-center items-center gap-3 bg-[#C2611F]/10 border-2 border-dashed border-[#C2611F]/40 rounded-xl cursor-pointer hover:bg-[#C2611F]/20 hover:border-[#C2611F] transition-all'
                                >
                                    <img className='h-12 w-12 opacity-40' src={imageIcon} alt="Ajouter une image" />
                                    <div className='text-center'>
                                        <p className='font-bold text-[#C2611F]'>Cliquez pour choisir une image</p>
                                        <p className='text-sm text-gray-500'>PNG, JPG, WEBP — Max 5 Mo</p>
                                    </div>
                                </label>
                            ) : (
                                // ÉTAT AVEC IMAGE — aperçu + boutons
                                <div className='w-full flex flex-col gap-3'>
                                    <div className='relative w-full h-60 rounded-xl overflow-hidden'>
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt="Aperçu de la couverture"
                                            className='w-full h-full object-cover'
                                        />
                                        {/* OVERLAY AU SURVOL */}
                                        <div className='absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex justify-center items-center gap-3'>
                                            {/* Bouton changer */}
                                            <label
                                                htmlFor="photo-couverture"
                                                className='bg-white text-[#C2611F] px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-[#C2611F] hover:text-white transition-all'
                                            >
                                                Changer
                                            </label>
                                            {/* Bouton supprimer */}
                                            <button
                                                type="button"
                                                onClick={() => setImage(null)}
                                                className='bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600 transition-all'
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                    {/* NOM DU FICHIER */}
                                    <p className='text-sm text-gray-500 px-1'>
                                         {image.name} — {(image.size / 1024 / 1024).toFixed(2)} Mo
                                    </p>
                                </div>
                            )}

                            {/* INPUT CACHÉ — déclenché par les deux labels */}
                            <input
                                type='file'
                                id='photo-couverture'
                                accept='image/*'
                                onChange={(e) => setImage(e.target.files[0] || null)}
                                className='hidden'
                            />
                        </div>
                        {/* INFORMATION DE BASES */}
                        <div className='w-full h-full flex flex-col justify-center items-center gap-4 bg-[#C2611F]/10 rounded-xl p-6'>
                            {/* MOT DE REFERENCE */}
                            <div className='w-full flex justify-start items-center gap-2 font-[500] px-2'>
                                <img className='h-6 w-6' src={note} alt="Icone des informations" />
                                <h1>Informations de Base</h1>
                            </div>
                            {/* CONTENEUR DES INFORMATIONS */}
                            <div className='w-full flex flex-col gap-4'>
                                {/* Nom de l'evenement */}
                                <div className='flex flex-col'>
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
                                <div className='flex flex-col'>
                                    <label htmlFor="description_long">Description complète</label>
                                    <textarea
                                        id='description_long'
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder='Décrivez votre événement en détail...'
                                        rows={6}
                                        className='bg-[#C2611F]/20 cursor-pointer rounded-md p-3 resize-y text-sm focus:outline-none focus:ring-2 focus:ring-[#C2611F]/50'
                                    />
                                </div>
                            </div>
                        </div>
                        {/* DETAILS DE L'EVENEMENT */}
                        <div className='w-full h-full flex flex-col justify-center items-center gap-4 w-[70%] h-[70vh] bg-[#C2611F]/10 rounded-xl p-6'>
                            {/* MOT DE REFERENCE */}
                            <div className='w-full flex justify-start items-center gap-2 font-[500]'>
                                <img className='h-6 w-6' src={tags} alt="Icone des informations" />
                                <h1>Détails de l'Événement</h1>
                            </div>
                            {/* CONTENEUR DES INFORMATIONS */}
                            <div className='w-full flex flex-col gap-8'>
                                {/* Type d'événement & Prix (FCFA) */}
                                <div className='flex flex-col text-sm md:text-md'>
                                    <div className='w-full flex flex-col md:px-3'>
                                        <div className='w-full flex gap-2'>
                                            <img className='h-5 w-5' src={tag} alt="Icone des informations" />
                                            <label htmlFor="typeEven">Type d'événement</label>
                                        </div>
                                        <select
                                            type='text'
                                            id='typeEven'
                                            onChange={(e) => setTypeEven(e.target.value)}
                                            placeholder='     Ex:OtakuFest 2026'
                                            className='bg-[#C2611F]/20 h-10 cursor-pointer rounded-md px-4'
                                        >
                                            <option value="Tous">Mixte</option>
                                            <option value="Anime">Anime</option>
                                            <option value="Manga">Manga</option>
                                            <option value="Gaming">Gaming</option>
                                        </select>
                                    </div>
                                </div>
                                {/* Date de l'événement & Heure de début */}
                                <div className='w-full flex md:justify-center items-center md:gap-4'>
                                    <div className='w-1/2 md:w-full flex flex-col px-1 md:px-4'>
                                        <div className='w-full flex sm:justify-center md:justify-start items-center gap-1 md:gap-2 text-[12px] md:text-md'>
                                            <img className='h-4 w-4 md:h-5 md:w-5' src={calendrier} alt="Icone des informations" />
                                            <label htmlFor="date">Date de l'événement</label>
                                        </div>
                                        <input
                                            type='date'
                                            id='date'
                                            onChange={(e) => setDate(e.target.value)}
                                            placeholder='     Ex:OtakuFest 2026'
                                            className='bg-[#C2611F]/20 h-10 cursor-pointer rounded-md text-sm md:text-md px-2'
                                        >
                                        </input>
                                    </div>
                                    <div className='w-1/2 md:w-full flex flex-col px-1 md:px-4'>
                                        <div className='w-full flex items-center gap-1 md:gap-2 text-sm md:text-md'>
                                            <img className='h-4 w-4 md:h-5 md:w-5' src={clock} alt="Icone des informations" />
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
                                <div className='w-full flex justify-center items-center md:gap-4'>
                                    <div className='w-1/2 md:w-full flex flex-col px-1 md:px-2'>
                                        <div className='w-full flex items-center gap-1 md:gap-2 text-sm md:text-md'>
                                            <img className='h-4 w-4 md:h-5 md:w-5' src={map} alt="Icone des informations" />
                                            <label htmlFor="name">Ville</label>
                                        </div>
                                        <input
                                            type='text'
                                            id='name'
                                            onChange={(e) => setVille(e.target.value)}
                                            placeholder='     Ex:OtakuFest 2026'
                                            className='bg-[#C2611F]/20 h-10 cursor-pointer rounded-md text-sm md:text-md'
                                        >
                                        </input>
                                    </div>
                                    <div className='w-1/2 md:w-full flex flex-col px-1 md:px-4'>
                                        <div className='w-full flex items-center gap-1 md:gap-2 text-sm md:text-md'>
                                            <img className='h-4 w-4 md:h-5 md:w-5' src={map} alt="Icone des informations" />    
                                            <label htmlFor="name">Lieu précis</label>
                                        </div>
                                        <input
                                            type='text'
                                            id='name'
                                            onChange={(e) => setLieu(e.target.value)}
                                            placeholder='     Ex:OtakuFest 2026'
                                            className='bg-[#C2611F]/20 h-10 cursor-pointer rounded-md text-sm md:text-md'
                                        >
                                        </input>
                                    </div>
                                </div>
                                {/* Statut de l'événement */}
                                <div className='flex flex-col md:px-4 text-sm md:text-md'>
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
                                                    className='bg-[#C2611F]/20 h-10 cursor-pointer rounded-md px-4'
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
                        {/* CATEGORIES DE BILLETS */}
                        <div className='w-full flex flex-col justify-center items-center gap-4 bg-[#C2611F]/10 rounded-xl px-6 py-6'>
                            {/* TITRE */}
                            <div className='w-full flex justify-between items-center text-sm md:text-md font-[500]'>
                                <div className='flex items-center gap-2'>
                                    <img className='h-5 w-5 md:h-6 md:w-6' src={categorie} alt="Icone des catégories" />
                                    <h1>Catégories de billets</h1>
                                </div>
                                <button
                                    type="button"
                                    onClick={ajouterCategorie}
                                    className='bg-[#C2611F] text-white py-2 px-2 md:px-4 rounded-lg text-[13px] md:text-sm font-bold hover:bg-[#a14f19] transition-all cursor-pointer'
                                >
                                    + Ajouter une catégorie
                                </button>
                            </div>

                            {/* LISTE DES CATEGORIES */}
                            <div className='w-full flex flex-col gap-4'>
                                {categories.map((categorie, index) => (
                                    <div key={index} className='w-full flex flex-col md:flex-row gap-4 md:items-end bg-[#C2611F]/10 rounded-xl p-4'>
                                                
                                        {/* Nom de la catégorie */}
                                        <div className='flex-1 flex flex-col'>
                                            <label className='text-sm font-[500] mb-1'>
                                                Nom de la catégorie
                                            </label>
                                            <input
                                                type='text'
                                                value={categorie.nom}
                                                onChange={(e) => modifierCategorie(index, 'nom', e.target.value)}
                                                placeholder='Ex: Standard, VIP...'
                                                className='bg-[#C2611F]/20 h-10 rounded-md px-3 text-sm'
                                            />
                                        </div>
                                        {/* Prix */}
                                        <div className='flex-1 flex flex-col'>
                                            <label className='text-sm font-[500] mb-1'>
                                                Prix (FCFA)
                                            </label>
                                            <input
                                                type='number'
                                                value={categorie.prix}
                                                onChange={(e) => modifierCategorie(index, 'prix', e.target.value)}
                                                placeholder='Ex: 5000'
                                                min='0'
                                                className='bg-[#C2611F]/20 h-10 rounded-md px-3 text-sm'
                                            />
                                        </div>
                                        {/* Nombre de places */}
                                        <div className='flex-1 flex flex-col'>
                                            <label className='text-sm font-[500] mb-1'>
                                                Nombre de places
                                            </label>
                                            <input
                                                type='number'
                                                value={categorie.nombreteTotale}
                                                onChange={(e) => modifierCategorie(index, 'nombreteTotale', e.target.value)}
                                                placeholder='Ex: 100'
                                                min='1'
                                                className='bg-[#C2611F]/20 h-10 rounded-md px-3 text-sm'
                                             />
                                        </div>
                                        {/* Bouton supprimer — masqué si une seule catégorie */}
                                        {categories.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => supprimerCategorie(index)}
                                                className='h-10 flex justify-center items-center px-3 bg-red-400/30 text-red-600 rounded-md hover:bg-red-400/50 transition-all text-sm font-bold'
                                            >
                                                <img className='h-6 w-6' src={x} alt="Icone de suppression" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* GALERIE PHOTOS */}
                        <div className='w-full flex flex-col gap-4 bg-[#C2611F]/10 rounded-xl p-6'>
                            <div className='w-full flex justify-start items-center gap-2 font-[500]'>
                                <img className='h-6 w-6' src={imageIcon} alt="Icone photo" />
                                <h1>Photos de galerie</h1>
                            </div>
                            <label
                                htmlFor="photos-galerie"
                                className='w-full h-24 flex flex-col justify-center items-center gap-2 bg-[#C2611F]/10 border-2 border-dashed border-[#C2611F]/40 rounded-xl cursor-pointer hover:bg-[#C2611F]/20 transition-all'
                            >
                                <p className='font-bold text-[#C2611F] text-sm'>Ajouter des photos à la galerie</p>
                                <p className='text-xs text-gray-500'>{photos.length} photo(s) sélectionnée(s)</p>
                            </label>
                            <input
                                type='file'
                                id='photos-galerie'
                                accept='image/*'
                                multiple
                                onChange={(e) => setPhotos(Array.from(e.target.files))}
                                className='hidden'
                            />
                            {/* Aperçu des photos sélectionnées */}
                            {photos.length > 0 && (
                                <div className='flex gap-2 flex-wrap'>
                                    {photos.map((photo, i) => (
                                        <img
                                            key={i}
                                            src={URL.createObjectURL(photo)}
                                            className='h-20 w-20 object-cover rounded-lg'
                                            alt={`Photo ${i + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* BUTTON DE PUBLICATION */}
                        <div className='w-full flex justify-center items-center gap-4 pb-8'>
                            <button 
                                type="submit" 
                                disabled={enAttente}
                                className='w-1/2 md:w-2/3 text-black bg-[#C2611F] px-4 h-10 md:h-6  md:h-10 rounded-sm font-bold text-[14px] md:text-lg cursor-pointer transition-all duration-300 hover:shadow-sm shadow-indigo-500/50 hover:bg-[#C2611F]/80'
                            >
                                {enAttente ? 'Création en cours...' : 'Publier l\'événement'}
                            </button>
                            <button 
                                type="button" 
                                disabled={enAttente}
                                onClick={() => {
                                    setModalOuvert(true)
                                }}
                                className='w-1/2 md:w-1/3 text-black border-1 border-[#C2611F] md:px-4 h-10 md:h-6 md:h-10 rounded-sm font-bold text-[14px] md:text-lg cursor-pointer transition-all duration-300 hover:shadow-sm shadow-indigo-500/50 hover:bg-[#C2611F]/90 hover:text-white'
                            >
                                {enAttente ? 'Création en cours...' : 'Enregistrer comme brouillon'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
            {/* TOAST DE SUCCES OU D'ERREUR */}
            {toastMessage && (
                <Toast 
                    message={toastMessage} 
                    setMessage={setToastMessage} 
                    type={toastType} 
                />
            )}
            {/* MODAL DE CONFIRMATION */}
            {modalOuvert && (
                <div className='fixed inset-0 bg-black/60 z-50 flex justify-center items-center'>
                    <div className='bg-white rounded-xl p-8 w-96 flex flex-col gap-6'>
                        <h2 className='text-xl font-bold'>Cette action n'est pas encore permise</h2>
                        <p className='text-gray-600'>Bientot disponible.</p>
                        <div className='flex justify-center items-center'>
                            <button 
                                onClick={() => setModalOuvert(false)}
                                className='w-1/2 py-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition-all font-bold'
                            >
                                Retour
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}