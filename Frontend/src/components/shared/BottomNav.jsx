import { useNavigate, useLocation } from 'react-router-dom'
import accueil from "../../assets/icons/home-1-svgrepo-com.svg"
import align_text from "../../assets/icons/align-text-left-svgrepo-com.svg"
import create_even from "../../assets/icons/plus-circle-add-new-create-cross-svgrepo-com.svg"
import setting from "../../assets/icons/setting-svgrepo-com.svg"
import calendrier from "../../assets/icons/calendar-days-svgrepo-com.svg"

function BottomNav({ role }) {
    const navigate = useNavigate()
    const location = useLocation()

    const itemsMembre = [
        { label: 'Accueil', icone: accueil, path: '/accueil' },
        { label: 'Billets', icone: align_text, path: '/billets' },
        { label: 'Calendrier', icone: calendrier, path: '/calendrier' },
        { label: 'Paramètres', icone: setting, path: '/setting' },
    ]

    const itemsOrga = [
        { label: 'Accueil', icone: accueil, path: '/accueil' },
        { label: 'Mes Events', icone: align_text, path: '/MyEvenement' },
        { label: 'Créer', icone: create_even, path: '/createEven' },
        { label: 'Calendrier', icone: calendrier, path: '/calendrier' },
        { label: 'Paramètres', icone: setting, path: '/setting' },
    ]

    const items = role === 'organisateur' ? itemsOrga : itemsMembre

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#C2611F]/20 flex justify-around items-center h-16 px-2 shadow-lg">
            {items.map(item => {
                const actif = location.pathname === item.path
                return (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all duration-200 min-w-0
                            ${actif ? 'text-[#C2611F]' : 'text-gray-400'}`}
                    >
                        <div className={`p-1.5 rounded-lg transition-all ${actif ? 'bg-[#C2611F]/15' : ''}`}>
                            <img
                                src={item.icone}
                                className={`h-5 w-5 transition-all ${actif ? 'opacity-100' : 'opacity-50'}`}
                                alt={item.label}
                                style={actif ? { filter: 'invert(42%) sepia(70%) saturate(500%) hue-rotate(355deg)' } : {}}
                            />
                        </div>
                        <span className={`text-[9px] font-bold truncate max-w-[50px] ${actif ? 'text-[#C2611F]' : 'text-gray-400'}`}>
                            {item.label}
                        </span>
                    </button>
                )
            })}
        </nav>
    )
}

export default BottomNav