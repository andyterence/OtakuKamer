import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '../../utils/api'

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState([])
    const [enAttente, setEnAttente] = useState(true)
    const [filtreStatut, setFiltreStatut] = useState('tous')
    const [recherche, setRecherche] = useState('')
    const token = localStorage.getItem('access')
    const [txSelectionnee, setTxSelectionnee] = useState(null)
    const [detailTx, setDetailTx] = useState(null)
    const [chargementDetail, setChargementDetail] = useState(false)

    useEffect(() => {
        const charger = async () => {
            try {
                const url = filtreStatut === 'tous'
                    ? `${API_URL}/api/utilisateurs/admin/transactions/`
                    : `${API_URL}/api/utilisateurs/admin/transactions/?status=${filtreStatut}`
                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setTransactions(res.data)
            } catch (err) {
                console.error(err)
            } finally {
                setEnAttente(false)
            }
        }
        charger()
    }, [filtreStatut])

    const voirDetail = async (reference) => {
        setChargementDetail(true)
        setTxSelectionnee(reference)
        try {
            const res = await axios.get(
                `${API_URL}/api/payments/${reference}/`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setDetailTx(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setChargementDetail(false)
        }
    }

    const transactionsFiltrees = transactions.filter(tx =>
        tx.reference?.toLowerCase().includes(recherche.toLowerCase()) ||
        tx.acheteur?.toLowerCase().includes(recherche.toLowerCase()) ||
        tx.evenement?.toLowerCase().includes(recherche.toLowerCase())
    )

    const couleurStatut = {
        success: 'bg-green-100 text-green-700',
        pending: 'bg-yellow-100 text-yellow-700',
        failed: 'bg-red-100 text-red-600',
    }

    const rembourser = async (reference) => {
        try {
            await axios.post(
                `${API_URL}/api/payments/${reference}/rembourser/`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )
            // Met à jour localement
            setTransactions(transactions.map(tx =>
                tx.reference === reference ? { ...tx, status: 'failed' } : tx
            ))
            setTxSelectionnee(null)
            setDetailTx(null)
            alert('Remboursement effectué avec succès')
        } catch (err) {
            alert('Erreur lors du remboursement')
            console.error(err)
        }
    }

    const totalFiltré = transactionsFiltrees
        .filter(tx => tx.status === 'success')
        .reduce((sum, tx) => sum + tx.amount, 0)

    if (enAttente) return <p className='text-gray-500'>Chargement...</p>

    return (
        <div className='flex flex-col gap-6'>
            {/* TITRE */}
            <div>
                <h1 className='text-3xl font-bold text-[#1A1A2E]'>Transactions</h1>
                <p className='text-gray-500 text-sm'>{transactions.length} transactions au total</p>
            </div>

            {/* KPI RAPIDE */}
            <div className='grid grid-cols-3 gap-4'>
                {['success', 'pending', 'failed'].map(statut => {
                    const count = transactions.filter(tx => tx.status === statut).length
                    return (
                        <div key={statut} className={`p-4 rounded-2xl border text-center ${couleurStatut[statut]}`}>
                            <p className='text-2xl font-bold'>{count}</p>
                            <p className='text-xs capitalize'>{statut}</p>
                        </div>
                    )
                })}
            </div>

            {/* Revenus confirmés */}
            <div className='bg-white rounded-2xl p-5 shadow-sm flex justify-between items-center'>
                <p className='text-gray-500 text-sm'>Revenus confirmés (success)</p>
                <p className='text-2xl font-bold text-green-700'>
                    {totalFiltré.toLocaleString('fr-FR')} XOF
                </p>
            </div>

            {/* FILTRES */}
            <div className='flex flex-col md:flex-row gap-3'>
                <input
                    type='text'
                    placeholder='Rechercher par référence, acheteur, événement...'
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    className='w-full max-w-sm px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C2611F]/50'
                />
                <select
                    value={filtreStatut}
                    onChange={(e) => setFiltreStatut(e.target.value)}
                    className='px-4 py-2 border border-gray-300 rounded-xl cursor-pointer'
                >
                    <option value="tous">Tous les statuts</option>
                    <option value="success">Success</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                </select>
            </div>

            {/* TABLEAU */}
            <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
                <table className='w-full text-sm'>
                    <thead className='bg-[#1A1A2E] text-white'>
                        <tr>
                            <th className='text-left px-6 py-4'>Actions</th>
                            <th className='text-left px-6 py-4'>Référence</th>
                            <th className='text-left px-6 py-4'>Acheteur</th>
                            <th className='text-left px-6 py-4'>Événement</th>
                            <th className='text-left px-6 py-4'>Montant</th>
                            <th className='text-left px-6 py-4'>Statut</th>
                            <th className='text-left px-6 py-4'>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactionsFiltrees.map((tx, i) => (
                            <tr key={tx.id} className={i % 2 === 0 ? 'bg-white hover:bg-[#C2611F]/10 transition-all duration-100' : 'bg-gray-50 hover:bg-[#C2611F]/10 transition-all duration-100'}>
                                
                                {/* Bouton Détail — colonne Actions uniquement */}
                                <td className='px-6 py-4'>
                                    <button
                                        onClick={() => voirDetail(tx.reference)}
                                        className='text-xs px-3 py-1 bg-[#1A1A2E] text-white rounded-lg hover:bg-[#C2611F] transition-all'
                                    >
                                        Détail
                                    </button>
                                </td>

                                {/* Référence */}
                                <td className='px-6 py-4 font-mono text-xs text-gray-500 max-w-[150px] truncate'>
                                    {tx.reference}
                                </td>

                                {/* Acheteur */}
                                <td className='px-6 py-4'>{tx.acheteur}</td>

                                {/* Événement */}
                                <td className='px-6 py-4 text-gray-500 max-w-[150px] truncate'>
                                    {tx.evenement}
                                </td>

                                {/* Montant */}
                                <td className='px-6 py-4 font-bold'>
                                    {tx.amount?.toLocaleString('fr-FR')} XOF
                                </td>

                                {/* Statut */}
                                <td className='px-6 py-4'>
                                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${couleurStatut[tx.status] || 'bg-gray-100'}`}>
                                        {tx.status}
                                    </span>
                                </td>

                                {/* Date */}
                                <td className='px-6 py-4 text-gray-500 text-xs'>
                                    {tx.created_at}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {transactionsFiltrees.length === 0 && (
                    <p className='text-center text-gray-400 py-8'>Aucune transaction trouvée</p>
                )}
            </div>
            {/* MODALE DÉTAIL TRANSACTION */}
            {txSelectionnee && (
                <div className='fixed inset-0 bg-black/60 z-50 flex justify-center items-center px-4'>
                    <div className='bg-white rounded-2xl p-6 w-full max-w-lg flex flex-col gap-4 max-h-[90vh] overflow-y-auto'>
                        
                        {/* Header */}
                        <div className='flex justify-between items-center'>
                            <h2 className='text-xl font-bold'>Détail de la transaction</h2>
                            <button
                                onClick={() => { setTxSelectionnee(null); setDetailTx(null) }}
                                className='text-gray-400 hover:text-gray-600 text-2xl'
                            >
                                ×
                            </button>
                        </div>

                        {chargementDetail ? (
                            <p className='text-center text-gray-400 py-8'>Chargement...</p>
                        ) : detailTx ? (
                            <>
                                {/* Données locales */}
                                <div className='bg-gray-50 rounded-xl p-4 flex flex-col gap-2'>
                                    <h3 className='font-bold text-sm text-gray-500 uppercase'>Données OtakuKamer</h3>
                                    <div className='grid grid-cols-2 gap-2 text-sm'>
                                        <div>
                                            <p className='text-gray-400 text-xs'>Référence</p>
                                            <p className='font-mono font-bold text-xs'>{detailTx.local?.reference}</p>
                                        </div>
                                        <div>
                                            <p className='text-gray-400 text-xs'>Statut local</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                                detailTx.local?.status === 'success' ? 'bg-green-100 text-green-700' :
                                                detailTx.local?.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-600'
                                            }`}>
                                                {detailTx.local?.status}
                                            </span>
                                        </div>
                                        <div>
                                            <p className='text-gray-400 text-xs'>Acheteur</p>
                                            <p className='font-bold'>{detailTx.local?.acheteur}</p>
                                        </div>
                                        <div>
                                            <p className='text-gray-400 text-xs'>Événement</p>
                                            <p className='font-bold'>{detailTx.local?.evenement}</p>
                                        </div>
                                        <div>
                                            <p className='text-gray-400 text-xs'>Montant</p>
                                            <p className='font-bold text-[#C2611F]'>{detailTx.local?.amount?.toLocaleString('fr-FR')} XOF</p>
                                        </div>
                                        <div>
                                            <p className='text-gray-400 text-xs'>Quantité</p>
                                            <p className='font-bold'>{detailTx.local?.quantite} billet(s)</p>
                                        </div>
                                    </div>
                                </div>

                                {/* REMBOURSEMENT — visible seulement si transaction success */}
                                {detailTx.local?.status === 'success' && (
                                    <div className='bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col gap-3'>
                                        <h3 className='font-bold text-sm text-red-600 uppercase'>Zone de remboursement</h3>
                                        <p className='text-xs text-gray-500'>
                                            Le remboursement annulera la transaction et contactera GeniusPay. 
                                            Cette action est irréversible.
                                        </p>
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`Confirmer le remboursement de ${detailTx.local?.amount?.toLocaleString('fr-FR')} XOF ?`)) {
                                                    rembourser(detailTx.local?.reference)
                                                }
                                            }}
                                            className='w-full py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-all text-sm'
                                        >
                                            Rembourser — {detailTx.local?.amount?.toLocaleString('fr-FR')} XOF
                                        </button>
                                    </div>
                                )}

                                {/* Données GeniusPay */}
                                {detailTx.geniuspay?.success && (
                                    <div className='bg-blue-50 rounded-xl p-4 flex flex-col gap-2'>
                                        <h3 className='font-bold text-sm text-gray-500 uppercase'>Données GeniusPay</h3>
                                        <div className='grid grid-cols-2 gap-2 text-sm'>
                                            <div>
                                                <p className='text-gray-400 text-xs'>Statut GeniusPay</p>
                                                <p className='font-bold'>{detailTx.geniuspay?.data?.status}</p>
                                            </div>
                                            <div>
                                                <p className='text-gray-400 text-xs'>Moyen de paiement</p>
                                                <p className='font-bold capitalize'>{detailTx.geniuspay?.data?.payment_method || '—'}</p>
                                            </div>
                                            <div>
                                                <p className='text-gray-400 text-xs'>Frais</p>
                                                <p className='font-bold'>{detailTx.geniuspay?.data?.fees} XOF</p>
                                            </div>
                                            <div>
                                                <p className='text-gray-400 text-xs'>Montant net</p>
                                                <p className='font-bold text-green-600'>{detailTx.geniuspay?.data?.net_amount} XOF</p>
                                            </div>
                                            {detailTx.geniuspay?.data?.customer && (
                                                <>
                                                    <div>
                                                        <p className='text-gray-400 text-xs'>Client</p>
                                                        <p className='font-bold'>{detailTx.geniuspay.data.customer.name || '—'}</p>
                                                    </div>
                                                    <div>
                                                        <p className='text-gray-400 text-xs'>Téléphone</p>
                                                        <p className='font-bold'>{detailTx.geniuspay.data.customer.phone || '—'}</p>
                                                    </div>
                                                </>
                                            )}
                                            <div>
                                                <p className='text-gray-400 text-xs'>Complété le</p>
                                                <p className='font-bold text-xs'>{detailTx.geniuspay?.data?.completed_at || 'En cours'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Erreur GeniusPay */}
                                {detailTx.geniuspay?.error && (
                                <div className='bg-red-50 rounded-xl p-4'>
                                    <p className='text-red-600 text-sm'>
                                        {typeof detailTx.geniuspay.error === 'string'
                                            ? detailTx.geniuspay.error
                                            : detailTx.geniuspay.error?.message || 'Erreur GeniusPay'
                                        }
                                    </p>
                                </div>
                            )}
                            </>
                        ) : (
                            <p className='text-center text-gray-400 py-8'>Aucune donnée</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}