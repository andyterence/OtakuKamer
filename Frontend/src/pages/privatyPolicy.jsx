import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import Sidebar from "../components/shared/sidebar";
import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";
// import kurama_attend from '../assets/imgs/goku_attend.png'
import menu from '../assets/icons/menu.svg'
import left from '../assets/icons/left.svg'
import logo_2 from '../assets/logos/logo-orange.png'

function PrivatyPolicy() {

    // Etat pour refuser l'autorisation du sidebar aux personnes qui ne sont pas connecter
    const token = localStorage.getItem('access')
    // Menu ouvert ou pas
    const [menuOuvert, setMenuOuvert] = useState(false)
    // Pour pouvoir naviguer entre les pages
    const navigate = useNavigate()
    
    return(

        <div className="flex items-start">
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
            <main className={token ? 'md:w-6/7 w-full bg-gray-100 flex flex-col' : 'bg-gray-100 w-full flex flex-col'}>
                <Navbar />
                {/* TITRE ET SOUS TITRE DE BIENVENUE */}
                <div className='flex justify-between items-center md:mt-30'>
                    <div className='w-full flex flex-col justify-center items-start font-bold md:p-10'>
                        <h1 className='text-4xl'>Politique de Confidentialité</h1>
                        <p className='text-md text-[#C2611F]'>La première plateforme dédiée aux événements Otaku au Cameroun</p>
                    </div>
                    <div className='pr-10 flex justify-center items-center'>
                        <button onClick={() => navigate('/accueil')} className='flex justify-center items-center text-md bg-[#C2611F]/80 w-45 h-10 rounded-md hover:bg-[#C2611F] cursor-pointer transition-all duration-300'>
                            <img className='h-6 w-6' src={left} alt="Logo du calendrier" />
                            <p className='text-white text-[14px] px-1'>Retour</p>
                        </button>
                    </div>
                </div>
                {/* 1. Acceptation des Conditions */}
                <div className="h-full relative flex justify-center items-start md:p-10">
                    {/* CONTENEUR DU TEXT */}
                    <div className="max-w-3xl mx-auto flex flex-col gap-10 px-6 py-10">
                        {/* CONDITION 1 */}
                        <div className="flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">1. Introduction</h1>
                            <p className="text-justify text-[12px] w-[80%]">Bienvenue sur OtakuKamer. Nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles. Cette politique de confidentialité vous informe sur la manière dont nous traitons vos données personnelles lorsque vous utilisez notre plateforme.</p>
                        </div>
                        {/* CONDITION 2 */}
                        <div className="w-full flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">2. Données Collectées</h1>
                            <p className="text-justify text-[12px] w-[80%]">Nous collectons les types de données suivants :</p>
                            <ol className="list-decimal list-inside flex flex-col gap-2 text-[13px] text-gray-700 w-full">
                                <li>Informations d'identification : nom, prénom, adresse e-mail</li>
                                <li>Informations de compte : nom d'utilisateur, mot de passe crypté</li>
                                <li>Données de navigation : pages visitées, temps passé, interactions</li>
                                <li>Données de transaction : achats de billets, historique des paiements</li>
                                <li>Informations techniques : adresse IP, type de navigateur, système d'exploitation</li>
                            </ol>
                        </div>
                        {/* CONDITION 3 */}
                        <div className="w-full flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">3. Utilisation des Données</h1>
                            <p className="text-justify text-[12px] w-[80%]">Les données collectées sont utilisées pour :</p>
                            <ol className="list-decimal list-inside flex flex-col gap-2 text-[13px] text-gray-700 w-full">
                                <li>Gérer votre compte et vos réservations</li>
                                <li>Traiter vos paiements de manière sécurisée</li>
                                <li>Vous envoyer des notifications importantes sur vos événements</li>
                                <li>Améliorer nos services et votre expérience utilisateur</li>
                                <li>Prévenir la fraude et assurer la sécurité de la plateforme</li>
                                <li>Respecter nos obligations légales</li>
                            </ol>
                        </div>
                        {/* CONDITION 4 */}
                        <div className="w-full flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">4. Partage des Données</h1>
                            <p className="text-justify text-[12px] w-[80%]">Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos données uniquement avec :</p>
                            <ol className="list-decimal list-inside flex flex-col gap-2 text-[13px] text-gray-700 w-full">
                                <li>Les organisateurs d'événements auxquels vous participez</li>
                                <li>Nos prestataires de services de paiement sécurisé</li>
                                <li>Les autorités légales si requis par la loi</li>
                            </ol>
                        </div>
                        {/* CONDITION 5 */}
                        <div className="flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">5. Sécurité des Données</h1>
                            <p className="text-justify text-[12px] w-[80%]">Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre tout accès, modification, divulgation ou destruction non autorisés. Cela inclut le cryptage, le stockage sécurisé et l'accès limité aux données.</p>
                        </div>
                        {/* CONDITION 6 */}
                        <div className="w-full flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">6. Vos Droits</h1>
                            <p className="text-justify text-[12px] w-[80%]">Conformément à la législation applicable, vous disposez des droits suivants :</p>
                            <ol className="list-decimal list-inside flex flex-col gap-2 text-[13px] text-gray-700 w-full">
                                <li>Accéder à vos données personnelles</li>
                                <li>Modifier vos données personnelles</li>
                                <li>Supprimer vos données personnelles</li>
                                <li>Porter plainte auprès de l'autorité compétente</li>
                                <li>Droit à la limitation du traitement</li>
                                <li>Droit à la portabilité de vos données</li>
                                <li>Droit d'opposition au traitement</li>
                            </ol>
                        </div>
                        {/* CONDITION 7 */}
                        <div className="flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">7. Cookies</h1>
                            <p className="text-justify text-[12px] w-[80%]">Nous utilisons des cookies pour améliorer votre expérience sur notre site. Vous pouvez contrôler et gérer les cookies dans les paramètres de votre navigateur. Le refus de cookies peut limiter certaines fonctionnalités du site.</p>
                        </div>
                        {/* CONDITION 8 */}
                        <div className="flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">8. Conservation des Données</h1>
                            <p className="text-justify text-[12px] w-[80%]">Nous conservons vos données personnelles aussi longtemps que nécessaire pour remplir les finalités pour lesquelles elles ont été collectées, conformément à nos obligations légales et réglementaires.</p>
                        </div>
                        {/* CONDITION 9*/}
                        <div className="flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">9. Contact</h1>
                            <p className="text-justify text-[12px] w-[80%]">Pour toute question concernant ces conditions d'utilisation : <span className="font-bold text-[#C2611F]">contact@otakukamer.com</span></p>
                        </div>
                        {/* CONDITION 10 */}
                        <div className="flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">10. Modifications</h1>
                            <p className="text-justify text-[12px] w-[80%]">Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications entreront en vigueur dès leur publication sur cette page. Nous vous encourageons à consulter régulièrement cette page pour rester informé.</p>
                        </div>
                    </div>
                    {/* ZONE IMAGE */}
                    {/* Bannière hero au lieu de l'image sticky */}
                    <div className="w-full sticky top-70 h-40 bg-[#C2611F]/10 flex justify-center items-center gap-4">
                        <img className='h-30 w-30' src={logo_2} />
                        <div>
                            <h1 className="text-2xl font-bold">Politique de Confidentialité</h1>
                            <p className="text-[#C2611F]">Dernière mise à jour : <span className="font-bold">08 Avril 2026</span></p>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        </div>
    )
}

export default PrivatyPolicy