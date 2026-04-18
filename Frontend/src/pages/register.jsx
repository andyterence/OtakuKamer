import { useState } from 'react'
import API_URL from '../utils/api'
import logo from '../assets/logos/OtakuKamer_logo.png'
import forcePassword, { getNiveauPassword } from '../utils/forcePassword'
import goku_chargement_1 from '../assets/imgs/inscription_etat_1.png'
import goku_chargement_2 from '../assets/imgs/inscription_etat_2.png'
import goku_chargement_3 from '../assets/imgs/inscription_etat_3.png'
import goku_hover from '../assets/imgs/goku_hover.png'
import inscription_etat_final from '../assets/imgs/inscription_etat_final.png'
import goku_erreur from '../assets/imgs/goku_erreur.png'
import goku_attend from '../assets/imgs/goku_attend.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
// Importer la fonction de calcul de la force du mot de passe pour l'utiliser dans la barre de force du mot de passe
// import { calculerForcePassword } from '../utils/calculerForcePassword'

function Register() {
    // Utiliser le hook useNavigate pour permettre de rediriger après la connexion réussie
    const navigate = useNavigate()
    // Définir les états pour stocker les champs et l'état de survol du bouton de connexion
    const [nom, setNom] = useState('')
    const [prenom, setPrenom] = useState('')
    const [email, setEmail] = useState('')
    const [dateNaissance, setDateNaissance] = useState('')
    const [motDePasse, setMotDePasse] = useState('')
    const [motDePasseConfirmation, setMotDePasseConfirmation] = useState('')
    //   État pour suivre si le bouton de connexion est survolé ou non et afficher une image différente en conséquence
    const [estSurvole, setEstSurvole] = useState(false)
    // Etat pour suivre la force du mot de passe et afficher une barre de force du mot de passe en fonction de la force calculée
    const [passwordForce, setPasswordForce] = useState("")
    // Pour stocker les messages d'erreur lors de la connexion.
    const [erreur, setErreur] = useState('')
    // État pour stocker le rôle sélectionné par l'utilisateur lors de l'inscription, avec une valeur par défaut de "utilisateur" et "organisateur"
    const [role, setRole] = useState('membre')
    // État pour indiquer si la connexion est en cours d'attente, utilisé pour afficher une image différente pendant le processus de connexion
    const [enAttente, setEnAttente] = useState(false)


    //   Fonction pour gérer la soumission du formulaire de connexion etant une fonction asynchrone pour permettre l'utilisation de await lors de l'appel à l'API
    const handleSubmit = async (e) => {
    // Empêcher le comportement par défaut du formulaire de soumission pour éviter le rechargement de la page
    e.preventDefault()
    // Indiquer que la connexion est en cours d'attente pour afficher une image de chargement
    setEnAttente(true)

    if (motDePasse !== motDePasseConfirmation) {
        setErreur("Les mots de passe ne correspondent pas")
        setEnAttente(false)
        return  // ← stoppe la fonction, n'envoie pas la requête
    }  

    // Verifier si le mot de passe entrer est le meme que le mot de passe de confirmation, si non afficher un message d'erreur et ne pas envoyer la requete
    try {
        // Envoyer une requête POST à l'API pour obtenir les tokens d'accès et de rafraîchissement en utilisant les informations d'identification de l'utilisateur
        const reponse = await axios.post(`${API_URL}/api/utilisateurs/`, { first_name: nom, last_name: prenom, email: email, dateNaiss: dateNaissance, role: role, password: motDePasse, motDePasseConfirmation: motDePasseConfirmation })
        // Rediriger l'utilisateur vers la page d'accueil après une inscription réussie
        navigate('/login')

    } catch (_err) {
        // si axios échoue
        setErreur("Information incorrect")
        console.error(_err)
        console.error(_err.response.data)
    }
        
    finally {
        // Réinitialiser l'état d'attente pour arrêter d'afficher l'image de chargement, que la connexion réussisse ou échoue
        setEnAttente(false)
        }
    }


  return (
    // Structure de la page de connexion avec deux sections : une pour l'accueil et une pour le formulaire de connexion
    <div className='flex md:flex-row flex-col h-full w-full flex items-center justify-center'>

        {/* SECTION DE GAUCHE - ACCUEIL */}
        <section className='w-full md:w-1/2 h-screen flex flex-col items-center justify-center gap-2'>
            <div className='flex items-center justify-center gap-2 p-4'>
                <img className='h-10 h-10' src={logo} alt="Logo d'OtakuKamer" />
                <h1 className='md:text-2xl font-bold'>OtakuKamer</h1>
            </div>
            <div className='flex items-center justify-center'>
                {!erreur && !estSurvole && !passwordForce && <img className='w-60 h-auto anime-flotter' src={goku_hover} />}
                {erreur && <img className='w-70 h-auto anime-flotter' src={goku_erreur} />}
                {!erreur && estSurvole && !passwordForce && <img className='w-80 h-auto anime-flotter' src={inscription_etat_final} />}
                {!erreur && passwordForce && (
                    passwordForce == "Très faible" ? <img className='w-70 h-auto anime-flotter' src={goku_hover} /> :
                    passwordForce == "Faible" ? <img className='w-70 h-auto anime-flotter' src={goku_chargement_1} /> :
                    passwordForce == "Moyen" ? <img className='w-70 h-auto anime-flotter' src={goku_chargement_2} /> :
                    passwordForce == "Fort" ? <img className='w-70 h-auto anime-flotter' src={inscription_etat_final} /> :
                    <img className='w-70 h-auto anime-flotter' src={goku_chargement_3} />
                )}
            </div>
            <div className='flex flex-col items-center justify-center'>
                <div className='w-70'>
                    <h2 className='text-2xl text-center text-[#0D0D0D] mb-2 px-3'>OtakuKamer : Actus & Billetterie.</h2>
                </div>
                <div className='w-100'>
                    <p className='text-center text-[#9CA3AF] px-5'>Vivez l’expérience Otaku à 100 % : suivez les news de la communauté et réservez vos places pour les plus grands festivals du pays.</p>
                </div>
            </div>
        </section>

        {/* SECTION DE DROITE - FORMULAIRE DE CONNEXION */}
        <section className='md:w-1/2 h-screen w-full flex flex-col items-center justify-center gap-2'>

            {/* MOT DE BIENVENUE */}
            <div className='w-80 py-4'>
                <h1 className='text-3xl text-center text-[#0D0D0D] font-bold'>Ton nindo commence ici. Bienvenue parmi nous, jeune ninja !</h1>
            </div>
            {/* BOUTONS DE CONNEXION AVEC GOOGLE OU GITHUB */}
            <div className='flex items-center justify-center gap-4 text-[12px]'>
                <button className='w-41 bg-[#C2611F] text-[#0D0D0D] p-3 rounded-md border-[1px solid #C2611F]'>Se connecter avec Google</button>
                <button className='w-41 bg-[#C2611F] text-[#0D0D0D] p-3 rounded-md border-[1px solid #C2611F]'>Se connecter avec GitHub</button>
            </div>
            <div className='w-88 rounded-[10px]'>
                <form action="" method="post" className="space-y-2">
                    {/* SECTION NOM */}
                    <div>
                        <label htmlFor="nom" className="block text-sm  mb-1"
                        >Nom</label
                        >
                        <input
                        value={nom}                              
                        onChange={(e) =>{
                            setNom(e.target.value)
                            setErreur("")
                            }
                        } 
                        type="text"
                        id="nom"
                        name="nom"
                        className="w-full px-4 py-2 border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        />
                    </div>

                    {/* SECTION PRENOM */}
                    <div>
                        <label htmlFor="nom" className="block text-sm  mb-1"
                        >Prenom</label
                        >
                        <input
                        value={prenom}                              
                        onChange={(e) =>{
                            setPrenom(e.target.value)
                            setErreur("")
                            }
                        } 
                        type="text"
                        id="prenom"
                        name="prenom"
                        className="w-full px-4 py-2 border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        />
                    </div>

                    {/* SECTION EMAIL */}
                    <div>
                        <label htmlFor="email" className="block text-sm  mb-1"
                        >Email</label
                        >
                        <input
                        value={email}                              
                        onChange={(e) =>{
                            setEmail(e.target.value)
                            setErreur("")
                            }
                        } 
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-2 border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        />
                    </div>

                    {/* DATE DE NAISSANCE ET ROLE */}
                    <div className='flex justify-between items-center gap-4'>
                        <div className=''>
                            <label htmlFor="datenaiss" className="block text-sm  mb-1"
                            >Date de naissance</label
                            >
                            <input
                            value={dateNaissance}                              
                            onChange={(e) =>{
                                setDateNaissance(e.target.value)
                                setErreur("")
                                }
                            } 
                            type="date"
                            id="datenaiss"
                            name="datenaiss"
                            className=" w-full px-4 py-2 border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            />
                        </div>
                        <div className=''>
                            <label htmlFor="role" className="block text-sm  mb-1"
                            >Vous êtes :</label
                            >
                            <select
                            onChange={(e) =>{
                            setRole(e.target.value)
                            setErreur("")
                                }
                            } 
                            id="role"
                            name="role"
                            className=" w-full px-4 py-2 border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            >
                                <option value="" className=''>Rôle</option>
                                <option value="membre" className='text-[12px]'>Utilisateur</option>
                                <option value="organisateur" className='text-[12px]'>Organisateur</option>
                            </select>
                        </div>
                    </div>

                    {/* SECTION MOT DE PASSE */}
                    <div>
                        <label htmlFor="password" className="block text-sm  mb-1"
                        >Password</label
                        >
                        <input
                        value={motDePasse}                               
                        onChange={(e) => {
                            setMotDePasse(e.target.value);
                            setErreur("");
                            setPasswordForce(getNiveauPassword(e.target.value)); // Mettre à jour la force du mot de passe en fonction de la valeur saisie
                            }
                        } 
                        type="password"
                        id="password"
                        name="password"
                        placeholder=""
                        className="w-full px-4 py-2 border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        />
                    </div>

                    {/* CONFIRMER LE MOT DE PASSE */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm  mb-1"
                        >Confirmer le mot de passe</label
                        >
                        <input
                        value={motDePasseConfirmation}                               
                        onChange={(e) => {
                            setMotDePasseConfirmation(e.target.value);
                            setErreur("");
                            }
                        } 
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder=""
                        className="w-full px-4 py-2 border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        />
                    </div>
                    {/* Barre de force du mot de passe */}
                    {forcePassword(motDePasse)}

                    <div className='flex justify-between'>
                        <div className='flex justify-start items-center gap-3'>
                            <label htmlFor="check" className="block text-sm  mb-1">
                                Se souvenir de moi
                            </label>
                            <input
                                type="checkbox"
                                id="check"
                                name="check"
                                className=" px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <a href='#' className='text-sm'>Mot de passe oublié ?</a>
                        </div>

                    </div>

                    <button
                        onMouseEnter={() => setEstSurvole(true)}
                        onMouseLeave={() => setEstSurvole(false)}
                        onClick={handleSubmit}
                        type="submit"
                        className="w-full bg-[#C2611F] text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        S'INSCRIRE
                    </button>
                </form>
                {erreur && <p className="text-red-500 text-sm">{erreur}</p>}
            </div>
            <div>
                <p className='text-[#9CA3AF]'>Déjà un compte ? <a href="/login" className="text-blue-500 hover:underline">Se connecter</a></p>
            </div>
            <div></div>
        </section>
        {/* L'IMAGE QU'ON AFFICHE SI UNE REQUETTE EST EN COURS */}
        {enAttente && (
            <div className="flex flex-col fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                <img className='w-80 h-auto anime-flotter' src={goku_attend} />
                <p className="text-[#9CA3AF] text-lg">Chargement en cours...</p>
            </div>
        )}
    </div>
  )
}

export default Register