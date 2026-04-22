import { useNavigate } from 'react-router-dom'
import facebook from '../../assets/logos/facebook.svg'
import twitter from '../../assets/logos/twitter.svg'
import instagram from '../../assets/logos/instagram.svg'
import youtube from '../../assets/logos/youtube.svg'
import send from '../../assets/icons/send.svg'


function Footer() {

    const navigate = useNavigate()

    return(
        <div className="w-full border-t border-[#C2611F] flex flex-col justify-center items-center gap-10 md:pt-10 my-10">
            {/* PREMIERE LIGNE */}
            <div className="w-full flex flex-col md:flex-row gap-5 md:gap-0 justify-evenly items-center">
                {/* Presentation */}
                <div className="flex flex-col gap-4">
                    {/* titre */}
                    <div className="text-[#C2611F] text-2xl font-bold">
                        <h1>OtakuKamer</h1>
                    </div>
                    {/* phrase courte */}
                    <div className="text-[12px] w-70 text-justify">
                        <p>La plateforme de référence pour tous les événements Otaku au Cameroun. Manga, Anime, Gaming.</p>
                    </div>
                    {/* Reseaux sociaux */}
                    <div className="flex justify-evenly items-center">
                        {/* Facebook */}
                        <div className="h-8 w-8 bg-[#C2611F]/40 flex justify-center items-center rounded-xl hover:bg-[#C2611F]/70">
                            <img className='h-5 w-5' src={facebook} alt="Logo de l'information" />
                        </div>
                        {/* twitter */}
                        <div className="h-8 w-8 bg-[#C2611F]/40 flex justify-center items-center rounded-xl hover:bg-[#C2611F]/70">
                            <img className='h-5 w-5' src={twitter} alt="Logo de l'information" />
                        </div>
                        {/* instagram */}
                        <div className="h-8 w-8 bg-[#C2611F]/40 flex justify-center items-center rounded-xl hover:bg-[#C2611F]/70">
                            <img className='h-5 w-5' src={instagram} alt="Logo de l'information" />
                        </div>
                        {/* youtube */}
                        <div className="h-8 w-8 bg-[#C2611F]/40 flex justify-center items-center rounded-xl hover:bg-[#C2611F]/70">
                            <img className='h-5 w-5' src={youtube} alt="Logo de l'information" />
                        </div>
                    </div>
                </div>
                {/* Navigation */}
                <div className="w-full md:w-[10%] flex flex-col gap-4 px-12 md:px-0">
                    {/* titre */}
                    <div className="text-xl font-bold">
                        <h1>Navigation</h1>
                    </div>
                    {/* Lien */}
                    <div className="text-[10px] flex flex-col justify-center items-start gap-4">
                        <a onClick={() => navigate(`/accueil`)} className="hover:text-[#C2611F] transition-all duration-300" href="">Accueil</a>
                        <a onClick={() => navigate(`/accueil`)} className="hover:text-[#C2611F] transition-all duration-300" href="">Événements</a>
                        <a onClick={() => navigate(`/ListeNews`)} className="hover:text-[#C2611F] transition-all duration-300" href="">Actualités</a>
                        <a onClick={() => navigate(`/about`)} className="hover:text-[#C2611F] transition-all duration-300" href="">À propos</a>
                    </div>
                </div>
                {/* Support */}
                <div className="w-full md:w-[10%] flex flex-col gap-4 px-12 md:px-0">
                    {/* titre */}
                    <div className="text-xl font-bold">
                        <h1>Support</h1>
                    </div>
                    {/* Lien */}
                    <div className="text-[10px] flex flex-col justify-center items-start gap-4">
                        <a className="hover:text-[#C2611F] transition-all duration-300" href="">Contact</a>
                        <a onClick={() => navigate(`/privatyPolicy`)} className="hover:text-[#C2611F] transition-all duration-300" href="">Confidentialité</a>
                        <a onClick={() => navigate(`/conditionUser`)} className="hover:text-[#C2611F] transition-all duration-300" href="">Conditions</a>
                        <a className="hover:text-[#C2611F] transition-all duration-300" href="">FAQ</a>
                    </div>
                </div>
                {/* Newsletter */}
                <div className="flex flex-col gap-4">
                    {/* titre */}
                    <div className="text-xl font-bold">
                        <h1>Newsletter</h1>
                    </div>
                    {/* phrase courte */}
                    <div className="text-[12px] w-70 text-justify">
                        <p>Recevez les dernières nouvelles et événements.</p>
                    </div>
                    {/* Lien */}
                    <div className="text-[10px] flex flex-col justify-center items-start gap-4">
                        <form 
                            action=""
                            className="flex justify-center items-center gap-4"
                        >
                            <input type="text" placeholder="  Votre email" className="border-1 rounded-md h-8 w-30"/>

                            <button className="bg-[#C2611F] h-10 w-10 flex justify-center items-center rounded-xl hover:scale-102 transition-all duration-300">
                                <img className='h-5 w-5' src={send} alt="Logo de l'information" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            {/* DEUXIEME LIGNE */}
            <div className="w-full flex justify-between items-center px-8">
                <div>
                    <p className="text-[10px]">© 2026 OtakuKamer. Tous droits réservés.</p>
                </div>
                <div className="text-[10px] flex justify-center items-start gap-4">
                    <a className="hover:text-[#C2611F] transition-all duration-300" href="">Politique de confidentialité</a>
                    <a className="hover:text-[#C2611F] transition-all duration-300" href="">Conditions d'utilisation</a>
                    <a className="hover:text-[#C2611F] transition-all duration-300" href="">Contact</a>
                </div>
            </div>
        </div>
    )
}

export default Footer