import { useState } from 'react'
import logo from '../assets/logos/OtakuKamer_logo.png'
import goku from '../assets/imgs/goku_bienvenue.png'
import goku_hover from '../assets/imgs/goku_hover.png'
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

//   Fonction pour gérer la soumission du formulaire de connexion etant une fonction asynchrone pour permettre l'utilisation de await lors de l'appel à l'API
const handleSubmit = async (e) => {
    // Empêcher le comportement par défaut du formulaire de soumission pour éviter le rechargement de la page
    e.preventDefault()
    console.log(email, motDePasse)
    // Envoyer une requête POST à l'API pour obtenir les tokens d'accès et de rafraîchissement en utilisant les informations d'identification de l'utilisateur
    const reponse = await axios.post('http://localhost:8000/api/token/', { email: email, password: motDePasse })
    // Afficher la réponse de l'API dans la console pour vérifier les tokens reçus
    console.log(reponse.data)
    // Stocker les tokens d'accès et de rafraîchissement dans le localStorage pour une utilisation ultérieure
    localStorage.setItem('access', reponse.data.access)
    localStorage.setItem('refresh', reponse.data.refresh)
    // Rediriger l'utilisateur vers la page d'accueil après une connexion réussie
    navigate('/')
}

  return (
    // Structure de la page de connexion avec deux sections : une pour l'accueil et une pour le formulaire de connexion
    <div className='bg-[#0D0D0D] min-h-screen flex items-center justify-center'>

        {/* SECTION DE GAUCHE - ACCUEIL */}
        <section className='w-1/2 h-screen flex flex-col items-center justify-center gap-2'>
            <div className='flex items-center justify-center text-[#F1F1F1] gap-2 p-4'>
                <img className='h-10 h-10' src={logo} alt="Logo d'OtakuKamer" />
                <h1 className='md:text-2xl font-bold'>OtakuKamer</h1>
            </div>
            <div className='flex items-center justify-center'>
                {!estSurvole && <img className='w-70 h-auto anime-flotter' src={goku} />}
                {estSurvole && <img className='w-80 h-auto anime-flotter' src={goku_hover} />}
            </div>
            <div className='flex flex-col items-center justify-center gap-2'>
                <div className='w-70'>
                    <h2 className='text-2xl text-center text-[#F1F1F1] mb-4'>Vivez votre passion Otaku au Cameroun</h2>
                </div>
                <div className='w-100'>
                    <p className='text-center text-[#9CA3AF]'>Vivez l’expérience Otaku à 100 % : suivez les news de la communauté et réservez vos places pour les plus grands festivals du pays.</p>
                </div>
            </div>
        </section>

        {/* SECTION DE DROITE - FORMULAIRE DE CONNEXION */}
        <section className='w-1/2 bg-[#1A1A2E] h-screen flex flex-col items-center justify-center gap-2'>

            {/* MOT DE BIENVENUE */}
            <div className='w-80 py-4'>
                <h1 className='text-3xl text-center text-[#F1F1F1] font-bold'>Bon retour ! Prêt à continuer l'aventure ?</h1>
            </div>
            {/* BOUTONS DE CONNEXION AVEC GOOGLE OU GITHUB */}
            <div className='flex items-center justify-center gap-4 text-[12px]'>
                <button className='w-41 bg-[#9CA3AF] text-[#0D0D0D] p-3 rounded-md border-[1px solid #2D2D2D]'>Se connecter avec Google</button>
                <button className='w-41 bg-[#9CA3AF] text-[#0D0D0D] p-3 rounded-md border-[1px solid #2D2D2D]'>Se connecter avec GitHub</button>
            </div>
            <div className='w-88 rounded-[10px]'>
                <form action="" method="post" className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm text-[#9CA3AF] mb-1"
                        >Email</label
                        >
                        <input
                        value={email}                              
                        onChange={(e) => setEmail(e.target.value)} 
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm text-[#9CA3AF] mb-1"
                        >Password</label
                        >
                        <input
                        value={motDePasse}                               
                        onChange={(e) => setMotDePasse(e.target.value)} 
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
                            <label htmlFor="check" className="block text-sm text-[#9CA3AF] mb-1">
                                Se souvenir de moi
                            </label>
                            <input
                                type="checkbox"
                                id="check"
                                name="check"
                                className=" px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <a href='#' className='text-[#9CA3AF] text-sm'>Mot de passe oublié ?</a>
                        </div>
                    </div>

                    <button
                        onMouseEnter={() => setEstSurvole(true)}
                        onMouseLeave={() => setEstSurvole(false)}
                        onClick={handleSubmit}
                        type="submit"
                        className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        SE CONNECTER
                    </button>
                </form>
            </div>
            <div>
                <p>Pas encore de compte ? <a href="#" className="text-blue-500 hover:underline">S'inscrire</a></p>
            </div>
            <div></div>
        </section>
    </div>
  )
}

export default Login