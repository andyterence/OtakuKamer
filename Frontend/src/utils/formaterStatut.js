const formaterStatut = (statut) => {
    const traductions = {
        // Événements
        'en_preparation': 'En préparation',
        'annule': 'Annulé',
        'en_cours': 'En cours',
        'termine': 'Terminé',
        // Billets
        'valide': 'Valide',
        'utilise': 'Utilisé',
    }
    return traductions[statut] ?? statut // Retourne la traduction si elle existe, sinon retourne le statut original
}

export default formaterStatut