import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '../../utils/api'
import formaterStatut from '../../utils/formaterStatut'

export default function AdminEvenements() {
    const [evenements, setEvenements] = useState([])
    const [enAttente, setEnAttente] = useState(true)
    const [recherche, setRecherche] = useState('')
    const [filtreStatut, setFiltreStatut] = useState('tous')
    const token = localStorage.getItem('access')

    useEffect(() => {
        const charger = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/utilisateurs/admin/evenements/`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setEvenements(res.data)
            } catch (err) {
                console.error(err)
            } finally {
                setEnAttente(false)
            }
        }
        charger()
    }, [])

    const toggleVedette = async (evenementId, estVedette) => {
        try {
            await axios.patch(
                `${API_URL}/api/utilisateurs/admin/evenements/${evenementId}/`,
                { estVedette: !estVedette },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setEvenements(evenements.map(e =>
                e.id === evenementId ? { ...e, estVedette: !estVedette } : e
            ))
        } catch (err) {
            console.error(err)
        }
    }

    const changerStatut = async (evenementId, statut) => {
        try {
            await axios.patch(
                `${API_URL}/api/utilisateurs/admin/evenements/${evenementId}/`,
                { statut },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setEvenements(evenements.map(e =>
                e.id === evenementId ? { ...e, statut } : e
            ))
        } catch (err) {
            console.error(err)
        }
    }

    const evenementsFiltres = evenements.filter(e => {
        const matchRecherche = e.titre?.toLowerCase().includes(recherche.toLowerCase()) ||
            e.ville?.toLowerCase().includes(recherche.toLowerCase())
        const matchStatut = filtreStatut === 'tous' || e.statut === filtreStatut
        return matchRecherche && matchStatut
    })

    const couleurStatut = {
        en_preparation: 'bg-yellow-100 text-yellow-700',
        en_cours: 'bg-green-100 text-green-700',
        termine: 'bg-gray-100 text-gray-600',
        annule: 'bg-red-100 text-red-600',
    }

    if (enAttente) return <p className='text-gray-500'>Chargement...</p>

    return (
        <div className='flex flex-col gap-6'>
            {/* TITRE */}
            <div>
                <h1 className='text-3xl font-bold text-[#1A1A2E]'>Événements</h1>
                <p className='text-gray-500 text-sm'>{evenements.length} événements enregistrés</p>
            </div>

            {/* FILTRES */}
            <div className='flex flex-col md:flex-row gap-3'>
                <input
                    type='text'
                    placeholder='Rechercher par titre ou ville...'
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    className='w-full max-w-sm px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C2611F]/50'
                />
                <select
                    value={filtreStatut}
                    onChange={(e) => setFiltreStatut(e.target.value)}
                    className='px-4 py-2 border border-gray-300 rounded-xl focus:outline-none cursor-pointer'
                >
                    <option value="tous">Tous les statuts</option>
                    <option value="en_preparation">En préparation</option>
                    <option value="en_cours">En cours</option>
                    <option value="termine">Terminé</option>
                    <option value="annule">Annulé</option>
                </select>
            </div>

            {/* TABLEAU */}
            <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
                <table className='w-full text-sm'>
                    <thead className='bg-[#1A1A2E] text-white'>
                        <tr>
                            <th className='text-left px-6 py-4'>Événement</th>
                            <th className='text-left px-6 py-4'>Organisateur</th>
                            <th className='text-left px-6 py-4'>Ville</th>
                            <th className='text-left px-6 py-4'>Statut</th>
                            <th className='text-left px-6 py-4'>Vedette</th>
                            <th className='text-left px-6 py-4'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {evenementsFiltres.map((e, i) => (
                            <tr key={e.id} className={i % 2 === 0 ? 'bg-white hover:bg-[#C2611F]/10 transition-all duration-100' : 'bg-gray-50 hover:bg-[#C2611F]/10 transition-all duration-100'}>
                                {/* Titre */}
                                <td className='px-6 py-4 font-medium max-w-[200px] truncate'>
                                    {e.titre}
                                </td>
                                {/* Organisateur */}
                                <td className='px-6 py-4 text-gray-500'>
                                    {e.organisateur?.first_name} {e.organisateur?.last_name}
                                </td>
                                {/* Ville */}
                                <td className='px-6 py-4 text-gray-500'>
                                    {e.estVirtuel ? '🌐 En ligne' : e.ville}
                                </td>
                                {/* Statut */}
                                <td className='px-6 py-4'>
                                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${couleurStatut[e.statut] || 'bg-gray-100'}`}>
                                        {formaterStatut(e.statut)}
                                    </span>
                                </td>
                                {/* Vedette */}
                                <td className='px-6 py-4'>
                                    <button
                                        onClick={() => toggleVedette(e.id, e.estVedette)}
                                        className={`text-xs px-3 py-1 rounded-lg font-bold transition-all ${e.estVedette
                                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                    >
                                        {e.estVedette ? '⭐ Vedette' : 'Non vedette'}
                                    </button>
                                </td>
                                {/* Changer statut */}
                                <td className='px-6 py-4'>
                                    <select
                                        value={e.statut}
                                        onChange={(ev) => changerStatut(e.id, ev.target.value)}
                                        className='text-xs border border-gray-300 rounded-lg px-2 py-1 cursor-pointer'
                                    >
                                        <option value="en_preparation">En préparation</option>
                                        <option value="en_cours">En cours</option>
                                        <option value="termine">Terminé</option>
                                        <option value="annule">Annulé</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {evenementsFiltres.length === 0 && (
                    <p className='text-center text-gray-400 py-8'>Aucun événement trouvé</p>
                )}
            </div>
        </div>
    )
}