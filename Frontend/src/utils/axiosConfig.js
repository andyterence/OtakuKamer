import axios from 'axios'
import API_URL from './api'

// Intercepteur — rafraîchit automatiquement le token si expiré
axios.interceptors.response.use(
    response => response,
    async error => {
        const original = error.config

        // Si 401 et pas déjà en train de retry
        if (error.response?.status === 401 && !original._retry) {
            original._retry = true

            try {
                const refresh = localStorage.getItem('refresh')
                if (!refresh) throw new Error('Pas de refresh token')

                const res = await axios.post(`${API_URL}/api/token/refresh/`, {
                    refresh: refresh
                })

                const nouveauToken = res.data.access
                localStorage.setItem('access', nouveauToken)

                // Relance la requête originale avec le nouveau token
                original.headers['Authorization'] = `Bearer ${nouveauToken}`
                return axios(original)

            } catch (_err) {
                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
                // ← Stocke un message à afficher sur la page login
                localStorage.setItem('sessionExpiree', 'true')
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)