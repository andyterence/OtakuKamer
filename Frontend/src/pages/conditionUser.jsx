import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import Sidebar from "../components/shared/sidebar";
import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";
// import kurama_attend from '../assets/imgs/goku_attend.png'
import menu from '../assets/icons/menu.svg'
import left from '../assets/icons/left.svg'
import logo_2 from '../assets/logos/logo-orange.png'

function conditionUser() {

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
                        <h1 className='text-4xl'>À Propos d'OtakuKamer</h1>
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
                    <div className="w-1/2 h-full flex flex-col justify-center items-center gap-10">
                        {/* CONDITION 1 */}
                        <div className="flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">1. Acceptation des Conditions</h1>
                            <p className="text-justify text-[12px] w-[80%]">En accédant et en utilisant OtakuKamer, vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.</p>
                        </div>
                        {/* CONDITION 2 */}
                        <div className="flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">2. Description du Service</h1>
                            <p className="text-justify text-[12px] w-[80%]">OtakuKamer est une plateforme de gestion et de découverte d'événements liés à la culture Otaku (Manga, Anime, Gaming) au Cameroun. Nous permettons aux utilisateurs d'acheter des billets pour des événements et aux organisateurs de créer et gérer leurs événements.</p>
                        </div>
                        {/* CONDITION 3 */}
                        <div className="w-full flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">3. Inscription et Compte</h1>
                            <p className="text-justify text-[12px] w-[80%]">Pour utiliser certaines fonctionnalités, vous devez créer un compte :</p>
                            <ol className="text-justify text-[12px] w-[80%]">
                                <li>Vous devez fournir des informations exactes et à jour</li>
                                <li>Vous êtes responsable de la confidentialité de votre mot de passe</li>
                                <li>Vous devez avoir au moins 18 ans pour créer un compte</li>
                                <li>Vous êtes responsable de toutes les activités sur votre compte</li>
                                <li>Vous devez nous informer immédiatement de toute utilisation non autorisée</li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ol>
                        </div>
                        {/* CONDITION 4 */}
                        <div className="w-full flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">4. Achat de Billets</h1>
                            <p className="text-justify text-[12px] w-[80%]">Concernant l'achat de billets :</p>
                            <ol className="text-justify text-[12px] w-[80%]">
                                <li>Tous les achats sont définitifs sauf indication contraire de l'organisateur</li>
                                <li>Les prix sont indiqués en FCFA et incluent toutes les taxes applicables</li>
                                <li>Les billets ne peuvent être revendus qu'avec l'autorisation de l'organisateur</li>
                                <li>OtakuKamer n'est pas responsable de l'annulation d'événements par les organisateurs</li>
                                <li>Les remboursements sont gérés selon la politique de chaque organisateur</li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ol>
                        </div>
                        {/* CONDITION 5 */}
                        <div className="w-full flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">5. Règles pour les Organisateurs</h1>
                            <p className="text-justify text-[12px] w-[80%]">Les organisateurs d'événements doivent :</p>
                            <ol className="text-justify text-[12px] w-[80%]">
                                <li>Fournir des informations exactes sur leurs événements</li>
                                <li>Respecter toutes les lois et réglementations applicables</li>
                                <li>Honorer tous les billets vendus via la plateforme</li>
                                <li>Informer rapidement les participants en cas de modification ou d'annulation</li>
                                <li>Respecter une politique de remboursement claire et équitable</li>
                                <li>Ne pas organiser d'événements illégaux, dangereux ou discriminatoires</li>
                                <li></li>
                                <li></li>
                            </ol>
                        </div>
                        {/* CONDITION 6 */}
                        <div className="w-full flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">6. Conduite Interdite</h1>
                            <p className="text-justify text-[12px] w-[80%]">Il est strictement interdit de :</p>
                            <ol className="text-justify text-[12px] w-[80%]">
                                <li>Utiliser la plateforme à des fins illégales</li>
                                <li>Publier du contenu offensant, discriminatoire ou inapproprié</li>
                                <li>Usurper l'identité d'une autre personne ou entité</li>
                                <li>Transmettre des virus, malwares ou codes malveillants</li>
                                <li>Collecter des données d'autres utilisateurs sans autorisation</li>
                                <li>Tenter d'accéder aux systèmes de manière non autorisée</li>
                                <li>Créer de faux comptes ou de faux événements</li>
                                <li></li>
                            </ol>
                        </div>
                        {/* CONDITION 7 */}
                        <div className="flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">7. Propriété Intellectuelle</h1>
                            <p className="text-justify text-[12px] w-[80%]">Tout le contenu présent sur OtakuKamer (logo, design, textes, images) est protégé par des droits de propriété intellectuelle. Vous ne pouvez pas reproduire, distribuer ou modifier ce contenu sans notre autorisation écrite préalable.</p>
                        </div>
                        {/* CONDITION 8 */}
                        <div className="flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">8. Limitation de Responsabilité</h1>
                            <p className="text-justify text-[12px] w-[80%]">OtakuKamer agit comme une plateforme de mise en relation entre organisateurs et participants. Nous ne sommes pas responsables de la qualité, de la sécurité ou de la légalité des événements organisés. Les organisateurs sont seuls responsables de leurs événements.</p>
                        </div>
                        {/* CONDITION 9 */}
                        <div className="flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">9. Modifications du Service</h1>
                            <p className="text-justify text-[12px] w-[80%]">Nous nous réservons le droit de modifier, suspendre ou interrompre tout ou partie du service à tout moment, avec ou sans préavis. Nous ne serons pas responsables envers vous ou tout tiers pour toute modification, suspension ou interruption du service.</p>
                        </div>
                        {/* CONDITION 10 */}
                        <div className="flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">10. Modifications des Conditions</h1>
                            <p className="text-justify text-[12px] w-[80%]">Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet immédiatement après leur publication sur la plateforme.</p>
                        </div>
                        {/* CONDITION 12*/}
                        <div className="flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">10. Résiliation</h1>
                            <p className="text-justify text-[12px] w-[80%]">Nous pouvons suspendre ou résilier votre compte à tout moment si vous violez ces conditions d'utilisation. Vous pouvez également fermer votre compte à tout moment depuis les paramètres.</p>
                        </div>
                        {/* CONDITION 13*/}
                        <div className="flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">11. Loi Applicable</h1>
                            <p className="text-justify text-[12px] w-[80%]">Ces conditions sont régies par la loi camerounaise. Tout litige relatif à l'utilisation de la plateforme sera soumis à la compétence des tribunaux camerounais.</p>
                        </div>
                        {/* CONDITION 14*/}
                        <div className="flex flex-col justify-center items-start gap-4 md:px-20">
                            <h1 className="font-bold text-xl">12. Contact</h1>
                            <p className="text-justify text-[12px] w-[80%]">Pour toute question concernant ces conditions d'utilisation : contact@otakukamer.com</p>
                        </div>
                    </div>
                    {/* ZONE IMAGE */}
                    <div className="w-1/2 h-full sticky top-60 flex justify-center items-start">
                            <img className='h-100 w-100 anime-flotter' src={logo_2} alt="Logo du calendrier" />
                    </div>
                </div>
                <Footer />
            </main>
        </div>
    )
}

export default conditionUser