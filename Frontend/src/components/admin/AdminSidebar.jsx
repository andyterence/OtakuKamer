import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../../utils/api'
import logo from '../../assets/logos/OtakuKamer_logo.png'
import iconDashboard from '../../assets/icons/dashboard.svg'
import iconUtilisateurs from '../../assets/icons/users.svg'
import iconEvenements from '../../assets/icons/calendars.svg'
import iconTransactions from '../../assets/icons/arrow.svg'
import iconDiagrammes from '../../assets/icons/chart.svg'
import bell from '../../assets/icons/bell-ring.svg'
import x from '../../assets/icons/x.svg'

export default function AdminSidebar({ sectionActive, setSectionActive }) {

    const liens = [
        { id: 'dashboard', label: 'Dashboard', icone: iconDashboard },
        { id: 'utilisateurs', label: 'Utilisateurs', icone: iconUtilisateurs },
        { id: 'evenements', label: 'Événements', icone: iconEvenements },
        { id: 'transactions', label: 'Transactions', icone: iconTransactions },
        { id: 'diagrammes', label: 'Diagrammes', icone: iconDiagrammes },
    ]

    const [notifications, setNotifications] = useState([])
    const [nonLues, setNonLues] = useState(0)
    const [clocheOuverte, setClocheOuverte] = useState(false)
    const token = localStorage.getItem('access')

    // Charge les notifications toutes les 30 secondes
    useEffect(() => {
        const charger = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/utilisateurs/admin/notifications/`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setNotifications(res.data.notifications)
                setNonLues(res.data.non_lues)
            } catch (err) {
                console.error(err)
            }
        }
        charger()
        const interval = setInterval(charger, 30000)  // ← rafraîchit toutes les 30s
        return () => clearInterval(interval)
    }, [])

    const toutMarquerLu = async () => {
        try {
            await axios.patch(
                `${API_URL}/api/utilisateurs/admin/notifications/lire/`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setNotifications(notifications.map(n => ({ ...n, lu: true })))
            setNonLues(0)
        } catch (err) {
            console.error(err)
        }
    }

    const iconeType = {
        inscription: iconDashboard,
        evenement: iconEvenements,
        paiement: iconTransactions,
        annulation: x,
    }

    const couleurType = {
        inscription: 'border-l-blue-500',
        evenement: 'border-l-orange-500',
        paiement: 'border-l-green-500',
        annulation: 'border-l-red-500',
    }

    return (
        <aside className='h-screen w-64 bg-[#1A1A2E] text-white flex flex-col sticky top-0'>
            {/* LOGO */}
            <div className='flex items-center gap-3 p-6 border-b border-white/10'>
                <img className='h-10 w-10' src={logo} alt="Logo" />
                <div>
                    <p className='font-bold text-[#C2611F]'>OtakuKamer</p>
                    <p className='text-xs text-gray-400'>Tour de contrôle</p>
                </div>
            </div>

            {/* CLOCHE NOTIFICATIONS */}
            <div className='relative px-4 pt-4'>
                <button
                    onClick={() => {
                        setClocheOuverte(!clocheOuverte)
                        if (!clocheOuverte && nonLues > 0) toutMarquerLu()
                    }}
                    className='w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all'
                >
                    <div className='flex items-center gap-3'>
                        <img className='h-5 w-5' src={bell} alt="cloche" />
                        <span className='text-sm font-medium'>Notifications</span>
                    </div>
                    {nonLues > 0 && (
                        <span className='bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full'>
                            {nonLues}
                        </span>
                    )}
                </button>

                {/* DROPDOWN NOTIFICATIONS */}
                {clocheOuverte && (
                    <div className='absolute left-4 right-4 top-16 bg-white text-gray-800 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto'>
                        {/* Header */}
                        <div className='flex justify-between items-center px-4 py-3 border-b border-gray-100'>
                            <p className='font-bold text-sm'>Notifications</p>
                            <button
                                onClick={toutMarquerLu}
                                className='text-xs text-[#C2611F] hover:underline'
                            >
                                Tout marquer lu
                            </button>
                        </div>

                        {/* Liste */}
                        {notifications.length === 0 ? (
                            <p className='text-center text-gray-400 text-sm py-6'>
                                Aucune notification
                            </p>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    className={`flex gap-3 px-4 py-3 border-b border-gray-50 border-l-4 ${couleurType[n.type] || 'border-l-gray-300'} ${!n.lu ? 'bg-orange-50' : 'bg-white'}`}
                                >
                                    <span className='text-lg flex-shrink-0'>{iconeType[n.type]}</span>
                                    <div className='flex flex-col gap-0.5'>
                                        <p className='text-xs leading-relaxed'>{n.message}</p>
                                        <p className='text-[10px] text-gray-400'>{n.created_at}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* NAVIGATION */}
            <nav className='flex flex-col gap-1 p-4 flex-1'>
                {liens.map(lien => (
                    <button
                        key={lien.id}
                        onClick={() => setSectionActive(lien.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all text-left
                            ${sectionActive === lien.id
                                ? 'bg-[#C2611F] text-white'
                                : 'text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <img className='h-5 w-5 md:h-6 md:w-6' src={lien.icone} alt={lien.label} />
                        {lien.label}
                    </button>
                ))}
            </nav>

            {/* RETOUR SITE */}
            <div className='p-4 border-t border-white/10'>
                <NavLink
                    to="/accueil"
                    className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-all'
                >
                    <span>←</span>
                    Retour au site
                </NavLink>
            </div>
        </aside>
    )
}