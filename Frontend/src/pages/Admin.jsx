import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '../utils/api'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminDashboard from '../components/admin/AdminDashboard'
import AdminUtilisateurs from '../components/admin/AdminUtilisateurs'
import AdminEvenements from '../components/admin/AdminEvenements'
import AdminTransactions from '../components/admin/AdminTransactions'
import AdminDiagrammes from '../components/admin/AdminDiagrammes'

export default function Admin() {
    const [sectionActive, setSectionActive] = useState('dashboard')
    const [stats, setStats] = useState(null)
    const [enAttente, setEnAttente] = useState(true)
    const [menuOuvert, setMenuOuvert] = useState(false)
    const token = localStorage.getItem('access')

    useEffect(() => {
        const chargerStats = async () => {
            setEnAttente(true)
            try {
                const res = await axios.get(`${API_URL}/api/utilisateurs/admin/stats/`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setStats(res.data)
            } catch (err) {
                console.error(err)
            } finally {
                setEnAttente(false)
            }
        }
        chargerStats()
    }, [])

    // Ferme le menu quand on change de section sur mobile
    const changerSection = (section) => {
        setSectionActive(section)
        setMenuOuvert(false)
    }

    const sections = {
        dashboard: <AdminDashboard stats={stats} enAttente={enAttente} />,
        utilisateurs: <AdminUtilisateurs />,
        evenements: <AdminEvenements />,
        transactions: <AdminTransactions />,
        diagrammes: <AdminDiagrammes stats={stats} />,
    }

    return (
        <div className='flex h-screen bg-gray-100 overflow-hidden'>

            {/* OVERLAY MOBILE — clic pour fermer */}
            {menuOuvert && (
                <div
                    className='md:hidden fixed inset-0 bg-black/50 z-40'
                    onClick={() => setMenuOuvert(false)}
                />
            )}

            {/* SIDEBAR — cachée sur mobile sauf si menuOuvert */}
            <div className={`
                fixed md:relative z-50 h-full transition-transform duration-300
                ${menuOuvert ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}>
                <AdminSidebar
                    sectionActive={sectionActive}
                    setSectionActive={changerSection}
                />
            </div>

            {/* CONTENU PRINCIPAL */}
            <div className='flex-1 flex flex-col overflow-hidden'>

                {/* TOPBAR MOBILE */}
                <div className='md:hidden flex items-center justify-between px-4 py-3 bg-[#1A1A2E] text-white'>
                    <button
                        onClick={() => setMenuOuvert(!menuOuvert)}
                        className='flex flex-col gap-1.5 p-2'
                    >
                        <span className='w-6 h-0.5 bg-white rounded'></span>
                        <span className='w-6 h-0.5 bg-white rounded'></span>
                        <span className='w-6 h-0.5 bg-white rounded'></span>
                    </button>
                    <p className='font-bold text-[#C2611F]'>OtakuKamer Admin</p>
                    <div className='w-10' /> {/* Spacer pour centrer le titre */}
                </div>

                {/* CONTENU SCROLLABLE */}
                <main className='flex-1 overflow-y-auto p-4 md:p-8'>
                    {sections[sectionActive]}
                </main>
            </div>
        </div>
    )
}