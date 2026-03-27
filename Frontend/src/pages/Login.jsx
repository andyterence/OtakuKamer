import { useState } from 'react'
import logo from '../assets/logos/logo-orange.png'
// import goku from '../assets/imgs/goku_bienvenue.png'
import naruto from '../assets/imgs/naruto_bienvenue.png'
// import goku_hover from '../assets/imgs/goku_hover.png'
import naruto_hover from '../assets/imgs/naruto_entre.png'
import sakura_erreur from '../assets/imgs/sakura_erreur.png'
import kurama_attend from '../assets/imgs/goku_attend.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

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


    //   Fonction pour gérer la soumission du formulaire de connexion etant une fonction asynchrone pour permettre l'utilisation de await lors de l'appel à l'API
    const handleSubmit = async (e) => {
    // Empêcher le comportement par défaut du formulaire de soumission pour éviter le rechargement de la page
    e.preventDefault()
    // Indiquer que la connexion est en cours d'attente pour afficher une image de chargement
    setEnAttente(true)
    try {
            const reponse = await axios.post('http://localhost:8000/api/token/', {
                email: email,
                password: motDePasse
            })
            localStorage.setItem('access', reponse.data.access)
            localStorage.setItem('refresh', reponse.data.refresh)
            navigate('/accueil')
        } catch (_err) {
            setErreur("Email ou mot de passe incorrect")
            console.error(_err)
        } finally {
            setEnAttente(false)
        }
    }


  return (
    // Structure de la page de connexion avec deux sections : une pour l'accueil et une pour le formulaire de connexion
    <div className='flex md:flex-row flex-col text-[#0D0D0D] h-full w-full flex items-center justify-center'>

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
                <button className='w-41 bg-[#C2611F] text-[#] p-3 rounded-md border-[1px solid #2D2D2D]'>Se connecter avec Google</button>
                <button className='w-41 bg-[#C2611F] text-[#0D0D0D] p-3 rounded-md border-[1px solid #2D2D2D]'>Se connecter avec GitHub</button>
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

                    <div className='flex justify-between'>
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
                    </div>
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