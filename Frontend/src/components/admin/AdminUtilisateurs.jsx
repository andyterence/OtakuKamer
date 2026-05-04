import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '../../utils/api'

export default function AdminUtilisateurs() {
    const [utilisateurs, setUtilisateurs] = useState([])
    const [enAttente, setEnAttente] = useState(true)
    const [recherche, setRecherche] = useState('')
    const token = localStorage.getItem('access')

    useEffect(() => {
        const charger = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/utilisateurs/admin/utilisateurs/`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setUtilisateurs(res.data)
            } catch (err) {
                console.error(err)
            } finally {
                setEnAttente(false)
            }
        }
        charger()
    }, [])

    const modifierRole = async (userId, nouveauRole) => {
        try {
            await axios.patch(
                `${API_URL}/api/utilisateurs/admin/utilisateurs/${userId}/`,
                { role: nouveauRole },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setUtilisateurs(utilisateurs.map(u =>
                u.id === userId ? { ...u, role: nouveauRole } : u
            ))
        } catch (err) {
            console.error(err)
        }
    }

    const toggleActif = async (userId, estActif) => {
        try {
            await axios.patch(
                `${API_URL}/api/utilisateurs/admin/utilisateurs/${userId}/`,
                { is_active: !estActif },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setUtilisateurs(utilisateurs.map(u =>
                u.id === userId ? { ...u, is_active: !estActif } : u
            ))
        } catch (err) {
            console.error(err)
        }
    }

    const utilisateursFiltres = utilisateurs.filter(u =>
        u.email?.toLowerCase().includes(recherche.toLowerCase()) ||
        u.first_name?.toLowerCase().includes(recherche.toLowerCase()) ||
        u.last_name?.toLowerCase().includes(recherche.toLowerCase())
    )

    const couleurRole = {
        admin: 'bg-red-100 text-red-700',
        organisateur: 'bg-orange-100 text-orange-700',
        membre: 'bg-blue-100 text-blue-700',
    }

    if (enAttente) return <p className='text-gray-500'>Chargement...</p>

    return (
        <div className='flex flex-col gap-6'>
            {/* TITRE */}
            <div>
                <h1 className='text-3xl font-bold text-[#1A1A2E]'>Utilisateurs</h1>
                <p className='text-gray-500 text-sm'>{utilisateurs.length} comptes enregistrés</p>
            </div>

            {/* RECHERCHE */}
            <input
                type='text'
                placeholder='Rechercher par nom ou email...'
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className='w-full max-w-md px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C2611F]/50'
            />

            {/* TABLEAU */}
            <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
                <table className='w-full text-sm'>
                    <thead className='bg-[#1A1A2E] text-white'>
                        <tr>
                            <th className='text-left px-6 py-4'>Utilisateur</th>
                            <th className='text-left px-6 py-4'>Email</th>
                            <th className='text-left px-6 py-4'>Rôle</th>
                            <th className='text-left px-6 py-4'>Statut</th>
                            <th className='text-left px-6 py-4'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {utilisateursFiltres.map((u, i) => (
                            <tr key={u.id} className={i % 2 === 0 ? 'bg-white hover:bg-[#C2611F]/10 transition-all duration-100' : 'bg-gray-50 hover:bg-[#C2611F]/10 transition-all duration-100'}>
                                {/* Nom */}
                                <td className='px-6 py-4 font-medium'>
                                    {u.first_name} {u.last_name}
                                </td>
                                {/* Email */}
                                <td className='px-6 py-4 text-gray-500'>{u.email}</td>
                                {/* Rôle */}
                                <td className='px-6 py-4'>
                                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${couleurRole[u.role] || 'bg-gray-100'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                {/* Statut actif */}
                                <td className='px-6 py-4'>
                                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                        {u.is_active ? 'Désactivé' : 'Actif'}
                                    </span>
                                </td>
                                {/* Actions */}
                                <td className='px-6 py-4'>
                                    <div className='flex gap-2'>
                                        {/* Changer rôle */}
                                        <select
                                            value={u.role}
                                            onChange={(e) => modifierRole(u.id, e.target.value)}
                                            className='text-xs border border-gray-300 rounded-lg px-2 py-1 cursor-pointer'
                                        >
                                            <option value="membre">Membre</option>
                                            <option value="organisateur">Organisateur</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        {/* Activer/Désactiver */}
                                        <button
                                            onClick={() => toggleActif(u.id, u.is_active)}
                                            className={`text-xs px-3 py-1 rounded-lg font-bold transition-all ${u.is_active
                                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`}
                                        >
                                            {u.is_active ? 'Activer' : 'Désactiver'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {utilisateursFiltres.length === 0 && (
                    <p className='text-center text-gray-400 py-8'>Aucun utilisateur trouvé</p>
                )}
            </div>
        </div>
    )
}