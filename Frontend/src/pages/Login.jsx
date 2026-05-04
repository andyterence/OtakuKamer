import { useState, useEffect } from 'react'
import API_URL from '../utils/api'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import logo from '../assets/logos/logo-orange.png'
import naruto from '../assets/imgs/naruto_bienvenue.png'
import naruto_hover from '../assets/imgs/naruto_entre.png'
import sakura_erreur from '../assets/imgs/sakura_erreur.png'
import bell from '../assets/icons/bell-electric.svg'

function Login() {
    // Utiliser le hook useNavigate pour permettre de rediriger après la connexion réussie
    const navigate = useNavigate()
    // Définir les états pour stocker l'email, le mot de passe et l'état de survol du bouton de connexion
    const [email, setEmail] = useState('')
    const [motDePasse, setMotDePasse] = useState('')
    //   État pour suivre si le bouton de connexion est survolé ou non et afficher une image différente en conséquence
    const [estSurvole, setEstSurvole] = useState(false)
    // Pour stocker les messages d'erreur lors de la connexion.
    const [erreur, setErreur] = useState('')
    // État pour indiquer si la connexion est en cours d'attente, utilisé pour afficher une image différente pendant le processus de connexion
    const [enAttente, setEnAttente] = useState(false)
    const [sessionExpiree, setSessionExpiree] = useState(false)
        
    useEffect(() => {
        if (localStorage.getItem('sessionExpiree')) {
            setSessionExpiree(true)
            localStorage.removeItem('sessionExpiree')
        }
    }, [])

    //   Fonction pour gérer la soumission du formulaire de connexion etant une fonction asynchrone pour permettre l'utilisation de await lors de l'appel à l'API
    const handleSubmit = async (e) => {
        e.preventDefault()
        setEnAttente(true)
        try {
            const reponse = await axios.post(`${API_URL}/api/token/`, {
                email: email,
                password: motDePasse
            })
            localStorage.setItem('access', reponse.data.access)
            localStorage.setItem('refresh', reponse.data.refresh)
            
            // ✅ Utilise reponse.data.user.role — pas le JWT décodé
            const role = reponse.data.user?.role
            localStorage.setItem('role', role)  // ← stocke le rôle !

            if (role === 'admin') {
                navigate('/admin')
            } else {
                navigate('/accueil')
            }
        } catch (_err) {
            setErreur("Email ou mot de passe incorrect")
        } finally {
            setEnAttente(false)
        }
    }

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/google/`, {
                token: credentialResponse.credential
            })
            localStorage.setItem('access', res.data.access)
            localStorage.setItem('refresh', res.data.refresh)

            // Décode le token pour lire le rôle
            const payload = JSON.parse(atob(res.data.access.split('.')[1]))
            if (payload.role === 'admin') {
                navigate('/admin')
            } else {
                navigate('/accueil')
            }
        } catch (err) {
            setErreur('Connexion Google échouée')
            console.error(err)
        }
    }

  return (
    // Structure de la page de connexion avec deux sections : une pour l'accueil et une pour le formulaire de connexion
    <div className='flex md:flex-row flex-col text-[#0D0D0D] h-full w-full flex items-center justify-center'>

        {/* MESSAGE SESSION EXPIRÉE */}
        {sessionExpiree && (
            <div className='w-80 bg-orange-50 border border-orange-300 rounded-xl px-4 py-3 text-center'>
                <div className='flex justify-center items-center gap-2'>
                    <img className='w-6 h-6' src={bell} alt="Logo d'OtakuKamer" />
                    <p className='text-orange-600 font-bold text-sm'>Votre session a expiré</p>
                </div>
                <p className='text-orange-500 text-xs mt-1'>Veuillez vous reconnecter pour continuer.</p>
            </div>
        )}

        {/* SECTION DE GAUCHE - ACCUEIL */}
        <section className='hidden md:block md:w-1/2 h-[98vh] md:h-screen flex flex-col items-center justify-center gap-2 pt-[4%]'>
            <div className='flex items-center justify-center text-[#0D0D0D] gap-2 p-4'>
                <img className='w-16 h-16' src={logo} alt="Logo d'OtakuKamer" />
                <h1 className='text-3xl md:text-2xl font-bold'>OtakuKamer</h1>
            </div>
            <div className='flex items-center justify-center'>
                {!erreur && !estSurvole && <img className='w-70 h-auto anime-flotter' src={naruto} />}
                {!erreur && estSurvole && <img className='w-80 h-auto' src={naruto_hover} />}
                {erreur && <img className='w-70 h-auto' src={sakura_erreur} />}
            </div>
            <div className='flex flex-col items-center justify-center'>
                <div className='w-70 font-[500]'>
                    <h2 className='text-2xl text-center text-[#0D0D0D] mb-2 px-3'>Vivez votre passion Otaku au Cameroun</h2>
                </div>
                <div className='w-100'>
                    <p className='text-center text-[#0D0D0D] px-5'>Vivez l’expérience Otaku à 100 % : suivez les news de la communauté et réservez vos places pour les plus grands festivals du pays.</p>
                </div>
            </div>
        </section>

        {/* SECTION DE DROITE - FORMULAIRE DE CONNEXION */}
        <section className='w-full md:w-1/2 h-screen flex flex-col items-center justify-center gap-2'>

            {/* MOT DE BIENVENUE */}
            <div className='w-80 py-4'>
                <h1 className='text-3xl text-center text-[#0D0D0D] font-bold'>Bon retour ! Prêt à continuer l'aventure ?</h1>
            </div>
            {/* BOUTONS DE CONNEXION AVEC GOOGLE OU GITHUB */}
            <div className='flex items-center justify-center gap-4 text-[12px]'>
                <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => setErreur('Connexion Google échouée')}
                    useOneTap
                    text="signin_with"
                    shape="rectangular"
                    locale="fr"
                />
            </div>
            <div className='w-88 rounded-[10px]'>
                <form action="" method="post" className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm text-[#0D0D0D] mb-1"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm text-[#0D0D0D] mb-1"
                        >Password</label
                        >
                        <input
                        value={motDePasse}                               
                        onChange={(e) => {
                            setMotDePasse(e.target.value);
                            setErreur("");
                            }
                        } 
                        type="password"
                        id="password"
                        name="password"
                        placeholder=""
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        />
                    </div>
                    {/* LIEN POUR S'INSCRIRE */}
                    <div className='text-center'>
                        <p className='text-[#9CA3AF]'>Pas de compte ? <a href="/register" className="text-blue-500 hover:underline">S'inscrire</a></p>
                    </div>
                    {/* SE SOUVENIR DE MOI */}
                    {/* <div className='flex justify-between'>
                        <div className='flex justify-start items-center gap-3'>
                            <label htmlFor="check" className="block text-sm text-[#0D0D0D] mb-1">
                                Se souvenir de moi
                            </label>
                            <input
                                type="checkbox"
                                id="check"
                                name="check"
                                className=" px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <a href='#' className='text-[#0D0D0D] text-sm'>Mot de passe oublié ?</a>
                        </div>
                    </div> */}
                    <button
                        onClick={handleSubmit}
                        onMouseEnter={() => setEstSurvole(true)}
                        onMouseLeave={() => setEstSurvole(false)}
                        type="submit"
                        className="w-full bg-[#C2611F] text-white py-3 rounded-lg font-bold hover:bg-[#a14f19] transition-colors"
                        disabled={enAttente}
                    >
                        {enAttente ? 'Connexion...' : 'Se connecter'}
                    </button>

                        
                </form>
            </div>
        </section>
    </div>
  );
}

export default Login;