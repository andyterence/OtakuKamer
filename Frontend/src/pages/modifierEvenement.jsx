import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../utils/api'
import Sidebar from "../components/shared/sidebar"
import menu from '../assets/icons/menu.svg'
import imageIcon from '../assets/icons/image.svg'
import calendrier from "../assets/icons/calendar-days-svgrepo-com.svg";
import map from '../assets/icons/map-check.svg'
import note from '../assets/icons/note.svg'
import tags from '../assets/icons/tags.svg'
import tag from '../assets/icons/tag.svg'
import clock from '../assets/icons/clock.svg'
import x from '../assets/icons/x.svg'
import categorie from '../assets/icons/chart-column-stacked.svg'

export default function ModifierEvenement() {
    const { id } = useParams()
    const navigate = useNavigate()
    // État pour indiquer si la connexion est en cours d'attente, utilisé pour afficher une image différente pendant le processus de connexion
    const [enAttente, setEnAttente] = useState(false)
    const [modifierEven, setModifierEven] = useState(null)
    // Etat pour refuser l'autorisation du sidebar aux personnes qui ne sont pas connecter
    const token = localStorage.getItem('access')
    // Menu ouvert ou pas
    const [menuOuvert, setMenuOuvert] = useState(false)
    const [titre, setTitre] = useState('')
    const [description, setDescription] = useState('')
    const [typeEven, setTypeEven] = useState('Mixte')
    const [date, setDate] = useState('')
    const [heure, setHeure] = useState('')
    const [ville, setVille] = useState('')
    const [lieu, setLieu] = useState('')
    const [image, setImage] = useState(null)
    const [statut, setStatut] = useState('en_preparation')
    const [categories, setCategories] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnAttente(true)
        
        const formData = new FormData();
        formData.append('titre', titre);
        formData.append('description', description);
        formData.append('typeEven', typeEven);
        formData.append('ville', ville);
        formData.append('lieu', lieu);
        formData.append('prix', 0); 
        formData.append('statut', statut)
        
        if (date && heure) {
            formData.append('dateLancement', `${date}T${heure}:00+00:00`);
        }
        if (image) {
            formData.append('image', image);
        }

        try {
            // mettre à jour l'événement
            await axios.patch(`${API_URL}/api/evenements/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            })

            // catégories (essaie de compléter cette partie)
            for (const categorie of categories) {
                if (!categorie.nom || !categorie.prix || !categorie.nombreteTotale) continue
                
                if (categorie.id) {
                    await axios.patch(`${API_URL}/api/categorie/${categorie.id}/`, {
                        evenement_id: parseInt(id),
                        nom: categorie.nom,
                        prix: parseFloat(categorie.prix),
                        nombreteTotale: parseInt(categorie.nombreteTotale),
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                } else {
                   await axios.post(`${API_URL}/api/categorie/`, {
                        evenement_id: parseInt(id),
                        nom: categorie.nom,
                        prix: parseFloat(categorie.prix),
                        nombreteTotale: parseInt(categorie.nombreteTotale),
                        nombreRestant: parseInt(categorie.nombreteTotale)
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                }
            }

            navigate(`/evenement/${id}`)  // ← ici après succès
        } catch (error) {
            console.error(error.response?.data)
        } finally {
            setEnAttente(false)
        }

    };
    
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

    useEffect(() => {
        const chargerModification = async() => {
            setEnAttente(true)
            try {
                const reponse = await axios.get(`${API_URL}/api/evenements/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setModifierEven(reponse.data)
                const e = reponse.data
                setTitre(e.titre)
                setDescription(e.description)
                setTypeEven(e.typeEven)
                setVille(e.ville)
                setLieu(e.lieu)
                setStatut(e.statut)

                if (e.dateLancement) {
                    const dt = new Date(e.dateLancement)
                    setDate(dt.toISOString().split('T')[0])   // "Ex: 2026-03-15"
                    setHeure(dt.toTimeString().slice(0, 5))   // "Ex: 14:30"
                }

                // Catégories existantes
                if (e.categories?.length > 0) {
                    setCategories(e.categories.map(c => ({
                        id: c.id,
                        nom: c.nom,
                        prix: c.prix,
                        nombreteTotale: c.nombreteTotale
                    })))
                }
            } catch (_err) {
                console.error(_err)
            } finally {
                setEnAttente(false)
            }
        }
        chargerModification()
    }, [id])

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
        <main className={token ? 'md:w-6/7 w-full' : 'w-full'}>
            {/* SECTION PRINCIPALE */}
            <section className="md:w-6/7 w-full flex flex-col justify-center items-center gap-10">
                {/* TITRE ET SOUS TITRE */}
                <div className='md:w-full flex flex-col justify-center items-start font-bold pt-10 md:p-10 pr-0'>
                    <h1 className='text-2xl md:text-4xl'>Modifier l'événement {modifierEven?.titre}</h1>
                    <p className='w-[80%] md:w-full text-sm md:text-md text-[#C2611F]'>Remplissez les informations pour modifié votre événement</p>
                </div>
                {/* INFROMATION A REMPLIRE POUR LA CREATION DE L'EVNEMENT */}
                <div className='w-[90%]'>
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
                        <div className='w-full h-full flex flex-col justify-center items-center gap-4 bg-[#C2611F]/10 rounded-xl p-10'>
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
                                        value={titre}
                                        onChange={(e) => setTitre(e.target.value)}
                                        placeholder='     Ex:OtakuFest 2026'
                                        className='bg-[#C2611F]/20 h-10 cursor-pointer rounded-md'
                                    >
                                    </input>
                                </div>
                                {/* Description complète */}
                                <div className='flex flex-col px-4'>
                                    <label htmlFor="description_long">Description complète</label>
                                    <textarea
                                        id='description_long'
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder='Décrivez votre événement en détail...'
                                        rows={6}
                                        className='bg-[#C2611F]/20 cursor-pointer rounded-md p-3 resize-y text-sm focus:outline-none focus:ring-2 focus:ring-[#C2611F]/50'
                                    />
                                </div>
                            </div>
                        </div>
                        {/* DETAILS DE L'EVENEMENT */}
                        <div className='w-full h-full flex flex-col justify-center items-center gap-4 w-[70%] h-[70vh] bg-[#C2611F]/10 rounded-xl p-10'>
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
                                            value={typeEven}
                                            onChange={(e) => setTypeEven(e.target.value)}
                                            placeholder='     Ex:OtakuFest 2026'
                                            className='bg-[#C2611F]/20 h-10 cursor-pointer rounded-md px-4 text-sm md:text-md'
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
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            placeholder='     Ex:OtakuFest 2026'
                                            className='bg-[#C2611F]/20 h-10 cursor-pointer rounded-md px-4 text-sm md:text-md'
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
                                            value={heure}
                                            onChange={(e) => setHeure(e.target.value)}
                                            placeholder='     Ex:OtakuFest 2026'
                                            className='bg-[#C2611F]/20 h-10 cursor-pointer rounded-md px-4 text-sm md:text-md'
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
                                            value={ville}
                                            onChange={(e) => setVille(e.target.value)}
                                            placeholder='     Ex:OtakuFest 2026'
                                            className='bg-[#C2611F]/20 h-10 cursor-pointer rounded-md px-4 text-sm md:text-md'
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
                                            value={lieu}
                                            onChange={(e) => setLieu(e.target.value)}
                                            placeholder='     Ex:OtakuFest 2026'
                                            className='bg-[#C2611F]/20 h-10 cursor-pointer rounded-md px-4 text-sm md:text-md'
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
                                                    value={statut}
                                                    onChange={(e) => setStatut(e.target.value)}
                                                    placeholder='     Ex:OtakuFest 2026'
                                                    className='bg-[#C2611F]/20 h-10 cursor-pointer rounded-md px-4 text-sm md:text-md'
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
                                    className='bg-[#C2611F] text-white py-1 md:px-4 md:py-2 rounded-lg text-[13px] md:text-sm font-bold hover:bg-[#a14f19] transition-all cursor-pointer'
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
                        {/* BUTTON DE PUBLICATION */}
                        <div className='w-full flex justify-center items-center gap-4 pb-8'>
                            <button
                                type="submit"
                                disabled={enAttente}
                                className='w-1/2 md:w-2/3 text-black bg-[#C2611F] px-4 h-10 md:h-6  md:h-10 rounded-sm font-bold text-[14px] md:text-lg cursor-pointer transition-all duration-300 hover:shadow-sm shadow-indigo-500/50 hover:bg-[#C2611F]/80'
                            >
                                {enAttente ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/myEvenement')}
                                className='w-1/2 md:w-1/3 text-black border-1 border-[#C2611F] md:px-4 h-10 md:h-6 md:h-10 rounded-sm font-bold text-[14px] md:text-lg cursor-pointer transition-all duration-300 hover:shadow-sm shadow-indigo-500/50 hover:bg-[#C2611F]/90 hover:text-white'
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
        </div>
    )
}