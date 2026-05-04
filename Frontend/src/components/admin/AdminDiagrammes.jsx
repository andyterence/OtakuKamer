import {
    LineChart, Line,
    BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const COULEURS = ['#C2611F', '#1A1A2E', '#3B82F6', '#10B981', '#F59E0B', '#EF4444']

export default function AdminDiagrammes({ stats }) {

    if (!stats) return <p className='text-gray-500'>Chargement des données...</p>

    // Données billets par statut pour le camembert
    const billetsPieData = stats.billets_par_statut?.map(item => ({
        name: item.statut,
        value: item.total
    })) || []

    // Données types événements pour le camembert
    const typesPieData = stats.types_evenements?.map(item => ({
        name: item.typeEven,
        value: item.total
    })) || []

    // Transactions par statut pour le bar chart
    const transactionsBarData = stats.transactions_par_statut?.map(item => ({
        name: item.status,
        total: item.total
    })) || []

    return (
        <div className='flex flex-col gap-8'>
            {/* TITRE */}
            <div>
                <h1 className='text-3xl font-bold text-[#1A1A2E]'>Diagrammes</h1>
                <p className='text-gray-500 text-sm'>Visualisation dynamique des données</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

                {/* COURBE — Inscriptions par mois */}
                <div className='bg-white rounded-2xl p-6 shadow-sm'>
                    <h2 className='font-bold text-lg mb-6'>Inscriptions par mois</h2>
                    <ResponsiveContainer width='100%' height={250}>
                        <LineChart data={stats.inscriptions_par_mois}>
                            <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                            <XAxis dataKey='mois' tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Line
                                type='monotone'
                                dataKey='total'
                                stroke='#C2611F'
                                strokeWidth={2}
                                dot={{ fill: '#C2611F', r: 5 }}
                                name='Inscriptions'
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* BARRES — Événements par mois */}
                <div className='bg-white rounded-2xl p-6 shadow-sm'>
                    <h2 className='font-bold text-lg mb-6'>Événements par mois</h2>
                    <ResponsiveContainer width='100%' height={250}>
                        <BarChart data={stats.evenements_par_mois}>
                            <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                            <XAxis dataKey='mois' tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey='total' fill='#1A1A2E' radius={[4, 4, 0, 0]} name='Événements' />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* CAMEMBERT — Types d'événements */}
                <div className='bg-white rounded-2xl p-6 shadow-sm'>
                    <h2 className='font-bold text-lg mb-6'>Types d'événements</h2>
                    <ResponsiveContainer width='100%' height={250}>
                        <PieChart>
                            <Pie
                                data={typesPieData}
                                cx='50%'
                                cy='50%'
                                outerRadius={90}
                                dataKey='value'
                                label={({ name, percent }) =>
                                    `${name} ${(percent * 100).toFixed(0)}%`
                                }
                            >
                                {typesPieData.map((_, index) => (
                                    <Cell key={index} fill={COULEURS[index % COULEURS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* CAMEMBERT — Billets par statut */}
                <div className='bg-white rounded-2xl p-6 shadow-sm'>
                    <h2 className='font-bold text-lg mb-6'>Billets par statut</h2>
                    <ResponsiveContainer width='100%' height={250}>
                        <PieChart>
                            <Pie
                                data={billetsPieData}
                                cx='50%'
                                cy='50%'
                                outerRadius={90}
                                dataKey='value'
                                label={({ name, percent }) =>
                                    `${name} ${(percent * 100).toFixed(0)}%`
                                }
                            >
                                {billetsPieData.map((_, index) => (
                                    <Cell key={index} fill={COULEURS[index % COULEURS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* BARRES — Transactions par statut */}
                <div className='bg-white rounded-2xl p-6 shadow-sm md:col-span-2'>
                    <h2 className='font-bold text-lg mb-6'>Transactions par statut</h2>
                    <ResponsiveContainer width='100%' height={250}>
                        <BarChart data={transactionsBarData}>
                            <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                            <XAxis dataKey='name' tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey='total' radius={[4, 4, 0, 0]} name='Transactions'>
                                {transactionsBarData.map((entry, index) => {
                                    const couleur = {
                                        success: '#10B981',
                                        pending: '#F59E0B',
                                        failed: '#EF4444'
                                    }
                                    return <Cell key={index} fill={couleur[entry.name] || '#C2611F'} />
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}