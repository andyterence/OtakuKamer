import { useState, useEffect } from 'react'
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import Sidebar from "../components/shared/sidebar";
import Toast from '../components/shared/Toast';
import menu from '../assets/icons/menu.svg'
import user_icon from "../assets/icons/user_black.svg";
import mail from "../assets/icons/mail.svg";
import phone from "../assets/icons/phone.svg";
import lock from "../assets/icons/lock.svg";
import calendar_clock from "../assets/icons/calendar-clock.svg";
import bell from "../assets/icons/bell-ring.svg";
import money from "../assets/icons/money.svg";
import landmark from "../assets/icons/landmark.svg";

export default function Setting() {
    const navigate = useNavigate()
    const [utilisateur, setUtilisateur] = useState(null)
    // État pour indiquer si la connexion est en cours d'attente, utilisé pour afficher une image différente pendant le processus de connexion
    // const [enAttente, setEnAttente] = useState(false)
    // Etat pour refuser l'autorisation du sidebar aux personnes qui ne sont pas connecter
    const token = localStorage.getItem('access')
    // Menu ouvert ou pas
    const [menuOuvert, setMenuOuvert] = useState(false)
    const [ancienMotDePasse, setAncienMotDePasse] = useState('')
    const [nouveauMotDePasse, setNouveauMotDePasse] = useState('')
    const [confirmMotDePasse, setConfirmMotDePasse] = useState('')
    const [toastMessage, setToastMessage] = useState('')
    const [toastType, setToastType] = useState('succes')
    const [nouvellePhoto, setNouvellePhoto] = useState(null)
    
    // USEEFFECT POUR CHARGER LES INFORMATIONS DE L'UTILISATEUR CONNECTER ET LES AFFICHER DANS LE FORMULAIRE DE PARAMETRE
    useEffect(() => {
        const seConnecter = async() => {
            try {
                const token = localStorage.getItem('access')
                const reponse = await axios.get('http://localhost:8000/api/utilisateurs/me/', {
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
                    seConnecter()
            },[])

    // FONCTION POUR CHANGER LE MOT DE PASSE DE L'UTILISATEUR
    const changerMotDePasse = async (e) => {
        e.preventDefault()
        if (nouveauMotDePasse !== confirmMotDePasse) {
            setToastMessage('Les mots de passe ne correspondent pas')
            setToastType('erreur')
            return
        }
        try {
            await axios.post(
                'http://localhost:8000/api/utilisateurs/changer-mot-de-passe/',
                {
                    ancien_mot_de_passe: ancienMotDePasse,
                    nouveau_mot_de_passe: nouveauMotDePasse,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setAncienMotDePasse('')
            setNouveauMotDePasse('')
            setConfirmMotDePasse('')
            setToastMessage('Mot de passe changé avec succès !')
            setToastType('succes')
        } catch (_err) {
            console.error(_err.response?.data)
            setToastMessage('Une erreur est survenue')
            setToastType('erreur')
        }
    }

    // FONCTION POUR CHANGER LA PHOTO DE PROFIL DE L'UTILISATEUR
    const changerPhoto = async () => {
        if (!nouvellePhoto) return
        
        const formData = new FormData()
        formData.append('photoProfil', nouvellePhoto)
        
        try {
            const reponse = await axios.patch(
                `http://localhost:8000/api/utilisateurs/${utilisateur.id}/`,
                formData,
                { headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }}
            )
            setUtilisateur(reponse.data)  // ← met à jour le state avec la nouvelle photo
            window.dispatchEvent(new Event('profilMisAJour'))
            setNouvellePhoto(null)
            setToastMessage('Photo mise à jour !')
            setToastType('succes')
        } catch (_err) {
            console.error(_err)
            setToastMessage('Erreur lors de la mise à jour de la photo')
            setToastType('erreur')
        }
    }

    // FONCTION POUR ENREGISTRER LES MODIFICATIONS APPORTER AUX INFORMATIONS DE L'UTILISATEUR
    const sauvegarderProfil = async (e) => {
        e.preventDefault()
        try {
            await axios.patch(
                `http://localhost:8000/api/utilisateurs/${utilisateur.id}/`,
                {
                    first_name: utilisateur.first_name,
                    email: utilisateur.email,
                    dateNaiss: utilisateur.dateNaiss,
                    phone: utilisateur.phone,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setToastMessage('Profil mis à jour avec succès !')
            setToastType('succes')
        } catch (_err) {
            console.error(_err)
            setToastMessage('Une erreur est survenue')
            setToastType('erreur')
        }
}

    return (
        <div className='flex'>
        {menuOuvert && (
            <div 
                className='md:hidden fixed inset-0 bg-black/50 z-30'
                onClick={() => setMenuOuvert(false)}
                />
            )}
        {token && (
            <>
                {/* BOUTON HAMBURGER */}
                <button 
                    className='md:hidden fixed top-4 left-4 z-50'
                    onClick={() => setMenuOuvert(!menuOuvert)}
                >
                    <img className='h-5 w-5' src={menu} alt="Menu" />
                </button>
                        
                {/* SIDEBAR */}
                <aside className="md:w-1/7 w-0 md:sticky md:top-0 md:h-screen z-50">
                    <Sidebar menuOuvert={menuOuvert} setMenuOuvert={setMenuOuvert} />
                </aside>
            </>
        )}
        <main className={token ? 'md:w-6/7 w-full' : 'w-full'}>
        
            {/* SECTION PRINCIPALE */}
            <section className="w-full h- bg-gray-200 flex flex-col justify-center items-center gap-10">
                {/* TITRE ET SOUS TITRE */}
                <div className='w-full flex flex-col justify-center items-start font-bold md:p-10 md:pb-0'>
                    <h1 className='text-4xl'>Paramètres</h1>
                    <p className='text-md text-[#C2611F]'>Gérez vos informations personnelles et préférences</p>
                </div>
                {/* INFROMATION A REMPLIRE POUR LA CREATION DE L'EVNEMENT */}
                <div className='w-[80%] px-10'>
                    {/* FORMULAIRE DE REMPLISSAGE */}
                    <div  className='flex flex-col gap-8'>
                        {/* INFORMATION SUR LA PERSONNE */}
                        <div className='w-full flex flex-col gap-4 bg-[#C2611F]/10 rounded-xl p-6'>
                            {/* PRESENTATION DE LA PHOTO DE PROFILE */}
                            <div className='flex justify-start items-center gap-1'>
                                <div className='bg-[#C2611F]/50 flex justify-center items-center h-20 w-20 rounded-full overflow-hidden'>
                                    {utilisateur?.photoProfil ? (
                                        // Si photo existe — affiche la vraie photo
                                        <img 
                                            src={utilisateur.photoProfil} 
                                            className='h-full w-full object-cover'
                                            alt="Photo de profil"
                                        />
                                    ) : nouvellePhoto ? (
                                        // Si nouvelle photo sélectionnée — aperçu local
                                        <img 
                                            src={URL.createObjectURL(nouvellePhoto)} 
                                            className='h-full w-full object-cover'
                                            alt="Aperçu"
                                        />
                                    ) : (
                                        // Sinon — icône par défaut
                                        <img className='h-10 w-10' src={user_icon} alt="Utilisateur" />
                                    )}
                                </div>
                                {/* INFOS DE L'UTILISATEUR */}
                                <div className='flex flex-col justify-center items-start'>
                                    {/* NOM */}
                                    <div className='flex flex-col items-start justify-center'>
                                        <div className='font-bold pl-2'>{utilisateur?.first_name}</div>
                                    </div>
                                    <div className='flex justify-center items-center gap-2'>
                                        {/* Bouton pour changer la photo */}
                                        <label htmlFor="photo-profil" className='w-35 h-8 bg-[#C2611F]/80 text-[14px] font-[600] rounded-xl cursor-pointer hover:bg-[#C2611F] transition-all duration-200 flex justify-center items-center'>
                                            Changer la photo
                                        </label>
                                        {/* Input caché déclenché par le bouton */}
                                        <input
                                            type="file"
                                            id="photo-profil"
                                            accept="image/*"
                                            className='hidden'
                                            onChange={(e) => setNouvellePhoto(e.target.files[0] || null)}
                                        />
                                        {/* Bouton de confirmation */}
                                        {nouvellePhoto && (
                                            <button
                                                type="button"
                                                onClick={changerPhoto}
                                                className='w-35 h-8 bg-green-600 text-white text-[14px] font-[600] rounded-xl cursor-pointer hover:bg-green-700 transition-all'
                                            >
                                                Confirmer
                                            </button>
                                        )}
                                        {nouvellePhoto && (
                                            <button
                                                type="button"
                                                onClick={() => setNouvellePhoto(null)}
                                                className='w-35 h-8 bg-red-600 text-white text-[14px] font-[600] rounded-xl cursor-pointer hover:bg-green-700 transition-all'
                                            >
                                                Annuler
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-10'>
                                {/* NOM ET EMAIL */}
                                <div className='w-flex flex gap-4'>
                                    {/* NOM */}
                                    <div className='flex flex-col w-1/2'>
                                        {/* information */}
                                        <div className='flex justify-start items-center gap-2'>
                                            <img className='h-4 w-4' src={user_icon} alt="Logo d'utilisateur" />
                                            <p className='text-[14px] font-[500]'>Nom Complet</p>
                                        </div>
                                        {/* champs de saisie */}
                                        <div>
                                            <input 
                                                type="text"
                                                value={utilisateur?.first_name ?? ''}
                                                placeholder='Votre nom complet'
                                                onChange={(e) => setUtilisateur({...utilisateur, first_name: e.target.value})}
                                                className='bg-white w-full h-8 rounded-md px-4 focus:outline-none focus:ring-1 focus:ring-[#C2611F]/50'
                                            />
                                        </div>
                                    </div>
                                    {/* EMAIL */}
                                    <div className='flex flex-col w-1/2'>
                                        {/* information */}
                                        <div className='flex justify-start items-center gap-2'>
                                            <img className='h-4 w-4' src={mail} alt="Logo de l'Email" />
                                            <p className='text-[14px] font-[500]'>Email</p>
                                        </div>
                                        {/* champs de saisie */}
                                        <div>
                                            <input 
                                                type="text"
                                               value={utilisateur?.email ?? ''}
                                                placeholder='Exemple@email.com'
                                                onChange={(e) => setUtilisateur({...utilisateur, email: e.target.value})}
                                                className='bg-white w-full h-8 rounded-md px-4 focus:outline-none focus:ring-1 focus:ring-[#C2611F]/50'
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* NUMERO DE TELEPHONE ET date de naissance< */}
                                <div className='w-flex flex gap-4'>
                                    {/* NUMERO DE TELEPHONE */}
                                    <div className='flex flex-col w-1/2'>
                                        {/* information */}
                                        <div className='flex justify-start items-center gap-2'>
                                            <img className='h-4 w-4' src={phone} alt="Logo d'utilisateur" />
                                            <p className='text-[14px] font-[500]'>Téléphone</p>
                                        </div>
                                        {/* champs de saisie */}
                                        <div>
                                            <input 
                                                type="number"
                                                value={utilisateur?.phone ?? ''}
                                                placeholder='Votre numéro de téléphone'
                                                onChange={(e) => setUtilisateur({...utilisateur, phone: e.target.value})}
                                                className='bg-white w-full h-8 rounded-md px-4 focus:outline-none focus:ring-1 focus:ring-[#C2611F]/50'
                                            />
                                        </div>
                                    </div>
                                    {/* date de naissance< */}
                                    <div className='flex flex-col w-1/2'>
                                        {/* information */}
                                        <div className='flex justify-start items-center gap-2'>
                                            <img className='h-4 w-4' src={calendar_clock} alt="Logo de la datNaiss" />
                                            <p className='text-[14px] font-[500]'>date de naissance</p>
                                        </div>
                                        {/* champs de saisie */}
                                        <div>
                                            <input 
                                                type="date"
                                                value={utilisateur?.dateNaiss ?? ''}
                                                onChange={(e) => setUtilisateur({...utilisateur, dateNaiss: e.target.value})}
                                                className='bg-white w-full h-8 rounded-md px-4 focus:outline-none focus:ring-1 focus:ring-[#C2611F]/50'
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* BOUTON DE MISE A JOUR DES INFORMATIONS */}
                                <button
                                    type="button" 
                                    onClick={sauvegarderProfil}
                                    className='w-60 h-10 bg-[#C2611F]/90 text-md font-[600] rounded-xl cursor-pointer hover:bg-[#C2611F] transition-all duration-200'
                                >
                                    Enregistrer les modifications
                                </button>
                            </div>
                        </div>
                        {/* SECURITE */}
                        <div className='w-full h-full flex flex-col justify-center items-start gap-4 bg-[#C2611F]/10 rounded-xl p-10'>
                            {/* MOT DE SECURITE */}
                            <div className='w-full flex justify-start items-center gap-2'>
                                <img className='h-6 w-6' src={lock} alt="Logo de Sécurité" />
                                <h2 className='font-bold text-xl'>Sécurité</h2>
                            </div>
                            {/* MOT DE PASSE ACTUEL */}
                            <div className='w-full'>
                                <label className='text-[14px] font-[500]' htmlFor="currentPassword">Mot de passe actuel</label>
                                <input 
                                    value={ancienMotDePasse} 
                                    onChange={(e) => setAncienMotDePasse(e.target.value)}
                                    type="password"
                                    id="currentPassword"
                                    placeholder='Entrez votre mot de passe actuel'
                                    className='bg-white w-full h-8 rounded-md px-4 focus:outline-none focus:ring-1 focus:ring-[#C2611F]/50'
                                />
                            </div>
                            {/* NOUVEAU MOT DE PASSE */}
                            <div className='w-full'>
                                <label className='text-[14px] font-[500]' htmlFor="newPassword">Nouveau mot de passe</label>
                                <input 
                                    type="password"
                                    id="newPassword"
                                    value={nouveauMotDePasse} 
                                    onChange={(e) => setNouveauMotDePasse(e.target.value)}
                                    placeholder='Entrez votre nouveau mot de passe'
                                    className='bg-white w-full h-8 rounded-md px-4 focus:outline-none focus:ring-1 focus:ring-[#C2611F]/50'
                                />
                            </div>
                            {/* CONFIRMER LE NOUVEAU MOT DE PASSE */}
                            <div className='w-full'>
                                <label className='text-[14px] font-[500]' htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
                                <input 
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmMotDePasse} 
                                    onChange={(e) => setConfirmMotDePasse(e.target.value)}
                                    placeholder='Entrez à nouveau votre nouveau mot de passe'
                                    className='bg-white w-full h-8 rounded-md px-4 focus:outline-none focus:ring-1 focus:ring-[#C2611F]/50'
                                />
                            </div>
                            {/* BOUTON DE MISE A JOUR DU MOT DE PASSE */}
                            <button
                                type="button" 
                                onClick={changerMotDePasse}
                                className='w-60 h-10 bg-[#C2611F]/90 text-md font-[600] rounded-xl cursor-pointer hover:bg-[#C2611F] transition-all duration-200 mt-5'
                            >
                                Changer le mot de passe
                            </button>
                        </div>
                        {/* NOTIFICATION */}
                        <div className='w-full h-full flex flex-col justify-center items-center gap-4 w-[70%] h-[70vh] bg-[#C2611F]/10 rounded-xl p-10'>
                            {/* MOT DE Notifications */}
                            <div className='w-full flex justify-start items-center gap-2'>
                                <img className='h-6 w-6' src={bell} alt="Logo de Notifications" />
                                <h2 className='font-bold text-xl'>Notifications</h2>
                            </div>
                            {/* OPTIONS DE NOTIFICATION */}
                            <div className='w-full h-full flex flex-col gap-5 justify-center items-center'>
                                {/* NOUVEAUX EVENEMENTS */}
                                <div className='w-full h-10 flex justify-between items-center bg-[#C2611F]/10 rounded-xl px-10'>
                                    <p>Nouveaux événements</p>
                                    <input 
                                        type="checkbox" 
                                        name="" 
                                        id="" 
                                        className='w-5 h-full'
                                    />
                                </div>
                                {/* RAPPELS D'EVENEMENTS */}
                                <div className='w-full h-10 flex justify-between items-center bg-[#C2611F]/10 rounded-xl px-10'>
                                    <p>Rappels d'événements</p>
                                    <input 
                                        type="checkbox" 
                                        name="" 
                                        id="" 
                                        className='w-5 h-full'
                                    />
                                </div>
                                {/* ACTUALITES OTAKU */}
                                <div className='w-full h-10 flex justify-between items-center bg-[#C2611F]/10 rounded-xl px-10'>
                                    <p>Actualités</p>
                                    <input 
                                        type="checkbox" 
                                        name="" 
                                        id="" 
                                        className='w-5 h-full'
                                    />
                                </div>
                                {/* OFFRE SPECIALE */}
                                <div className='w-full h-10 flex justify-between items-center bg-[#C2611F]/10 rounded-xl px-10'>
                                    <p>Offre spéciales</p>
                                    <input 
                                        type="checkbox" 
                                        name="" 
                                        id="" 
                                        className='w-5 h-full'
                                    />
                                </div>
                            </div>
                        </div>
                        {/* MOYEN DE PAIEMENT */}
                        <div className='w-full flex flex-col justify-center items-center gap-4 bg-[#C2611F]/10 rounded-xl px-10 py-6'>
                            {/* MOT DE PAIEMENT */}
                            <div className='w-full flex justify-start items-center gap-2'>
                                <img className='h-6 w-6' src={landmark} alt="Logo de Notifications" />
                                <h2 className='font-bold text-xl'>Option de paiement</h2>
                            </div>
                            {/* OPTIONS DE PAIEMENT */}
                            <div className='w-full h-full flex flex-col gap-5 justify-center items-start'>
                                <div className='w-full h-15 flex justify-between items-center bg-[#C2611F]/10 rounded-xl px-10'>
                                    <div className='flex justify-center items-center gap-2'>
                                        <div className='w-15 h-10 bg-[#C2611F]/60 flex justify-center items-center rounded-md'>
                                            <img className='h-7 w-7' src={money} alt="Logo de Notifications" />
                                        </div>
                                        <div className='flex flex-col justify-center items-start'>
                                            <p className='font-bold'>+237 {utilisateur?.phone}</p>
                                            <p className='text-[12px] text-red-900'>Numero de paiement</p>
                                        </div>
                                    </div>
                                    <div className='h-[50%] w-30 bg-[#C2611F]/20 flex justify-center items-center rounded-full sha'>
                                        <p className='text-[12px] text-green-900 font-[700]'>Defaut</p>
                                    </div>
                                </div>
                                {/* BOUTON DE MISE A JOUR DU MOT DE PASSE */}
                                <button
                                    className='w-65 h-10 bg-[#C2611F]/90 text-md font-[600] rounded-xl cursor-pointer hover:bg-[#C2611F] transition-all duration-200 mt-5'
                                >
                                    Ajouter un moyen de payement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        {toastMessage && (
            <Toast message={toastMessage} setMessage={setToastMessage} type={toastType} />
        )}
        </div>
    )
}