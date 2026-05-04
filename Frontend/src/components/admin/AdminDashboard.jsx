import logo from '../../assets/logos/OtakuKamer_logo.png'

export default function AdminDashboard({ stats, enAttente }) {

    if (enAttente) return (
        <div className='flex flex-col items-center justify-center h-full gap-4'>
            <img className='w-40 animate-bounce' src={logo} alt="Chargement" />
            <p className='text-gray-500'>Chargement des données...</p>
        </div>
    )

    const kpis = [
        {
            label: 'Utilisateurs',
            valeur: stats?.kpis?.total_utilisateurs ?? 0,
            couleur: 'bg-blue-100 text-blue-700',
            bordure: 'border-blue-300',
        },
        {
            label: 'Événements',
            valeur: stats?.kpis?.total_evenements ?? 0,
            couleur: 'bg-orange-100 text-orange-700',
            bordure: 'border-orange-300',
        },
        {
            label: 'Billets vendus',
            valeur: stats?.kpis?.total_billets ?? 0,
            couleur: 'bg-green-100 text-green-700',
            bordure: 'border-green-300',
        },
        {
            label: 'Transactions',
            valeur: stats?.kpis?.total_transactions ?? 0,
            couleur: 'bg-purple-100 text-purple-700',
            bordure: 'border-purple-300',
        },
        {
            label: 'Revenus totaux',
            valeur: `${stats?.kpis?.revenus_totaux?.toLocaleString('fr-FR') ?? 0} FCFA`,
            couleur: 'bg-yellow-100 text-yellow-700',
            bordure: 'border-yellow-300',
        },
    ]

    return (
        <div className='flex flex-col gap-8'>
            {/* TITRE */}
            <div>
                <h1 className='text-3xl font-bold text-[#1A1A2E]'>Dashboard</h1>
                <p className='text-gray-500 text-sm'>Vue d'ensemble de la plateforme</p>
            </div>

            {/* KPI CARDS */}
            <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4'>
                {kpis.map((kpi, i) => (
                    <div
                        key={i}
                        className={`flex flex-col gap-2 p-5 bg-white rounded-2xl border ${kpi.bordure} shadow-sm hover:bg-gray-50 transition-all duration-100`}
                    >
                        <p className='text-sm text-gray-500'>{kpi.label}</p>
                        <p className={`text-2xl font-bold ${kpi.couleur.split(' ')[1]}`}>
                            {kpi.valeur}
                        </p>
                    </div>
                ))}
            </div>

            {/* RÉSUMÉ ACTIVITÉ RÉCENTE */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Inscriptions par mois */}
                <div className='bg-white rounded-2xl p-6 shadow-sm hover:bg-gray-50 transition-all duration-100'>
                    <h2 className='font-bold text-lg mb-4'>Inscriptions par mois</h2>
                    {stats?.inscriptions_par_mois?.length === 0
                        ? <p className='text-gray-400 text-sm'>Aucune donnée</p>
                        : stats?.inscriptions_par_mois?.map((item, i) => (
                            <div key={i} className='flex justify-between items-center py-2 border-b border-gray-100'>
                                <span className='text-sm text-gray-600 capitalize'>{item.mois}</span>
                                <span className='font-bold text-blue-600'>{item.total} utilisateurs</span>
                            </div>
                        ))
                    }
                </div>

                {/* Événements par mois */}
                <div className='bg-white rounded-2xl p-6 shadow-sm hover:bg-gray-100 transition-all duration-50'>
                    <h2 className='font-bold text-lg mb-4'>Événements par mois</h2>
                    {stats?.evenements_par_mois?.length === 0
                        ? <p className='text-gray-400 text-sm'>Aucune donnée</p>
                        : stats?.evenements_par_mois?.map((item, i) => (
                            <div key={i} className='flex justify-between items-center py-2 border-b border-gray-100'>
                                <span className='text-sm text-gray-600 capitalize'>{item.mois}</span>
                                <span className='font-bold text-[#C2611F]'>{item.total} événements</span>
                            </div>
                        ))
                    }
                </div>

                {/* Billets par statut */}
                <div className='bg-white rounded-2xl p-6 shadow-sm hover:bg-gray-100 transition-all duration-50'>
                    <h2 className='font-bold text-lg mb-4'>Billets par statut</h2>
                    {stats?.billets_par_statut?.map((item, i) => {
                        const couleurs = {
                            valide: 'bg-green-100 text-green-700',
                            utilise: 'bg-gray-100 text-gray-600',
                            annule: 'bg-red-100 text-red-600',
                        }
                        return (
                            <div key={i} className='flex justify-between items-center py-2 border-b border-gray-100'>
                                <span className={`text-xs px-3 py-1 rounded-full font-bold ${couleurs[item.statut] || 'bg-gray-100'}`}>
                                    {item.statut}
                                </span>
                                <span className='font-bold'>{item.total}</span>
                            </div>
                        )
                    })}
                </div>

                {/* Transactions par statut */}
                <div className='bg-white rounded-2xl p-6 shadow-sm hover:bg-gray-100 transition-all duration-50'>
                    <h2 className='font-bold text-lg mb-4'>Transactions par statut</h2>
                    {stats?.transactions_par_statut?.map((item, i) => {
                        const couleurs = {
                            success: 'bg-green-100 text-green-700',
                            pending: 'bg-yellow-100 text-yellow-700',
                            failed: 'bg-red-100 text-red-600',
                        }
                        return (
                            <div key={i} className='flex justify-between items-center py-2 border-b border-gray-100'>
                                <span className={`text-xs px-3 py-1 rounded-full font-bold ${couleurs[item.status] || 'bg-gray-100'}`}>
                                    {item.status}
                                </span>
                                <span className='font-bold'>{item.total}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}