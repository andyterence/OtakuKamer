// Importer les plugins nécessaires pour Vite, React et Tailwind CSS
// Importation de la fonction defineConfig pour définir la configuration de Vite
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Exporter la configuration de Vite en utilisant la fonction defineConfig
export default defineConfig({
  // Définir les plugins utilisés par Vite, ici React et Tailwind CSS
  plugins: [
    react(),
    tailwindcss(),
  ],
})