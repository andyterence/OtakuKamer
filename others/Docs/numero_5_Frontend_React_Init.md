# OtakuKamer — Initialisation du Frontend React

> Cinquième partie de la documentation technique du projet  
> Couvre : Comprendre React · Initialisation avec Vite · Configuration Tailwind CSS · Structure du projet · Connexion à l'API Django

---

## 📋 Table des matières

1. [Qu'est-ce que React ?](#react)
2. [Pourquoi Vite ?](#vite)
3. [Initialisation du projet](#init)
4. [Structure du projet React](#structure)
5. [Concepts fondamentaux de React](#concepts)
6. [Configuration de Tailwind CSS](#tailwind)
7. [Vérification finale](#verification)
8. [Prochaines étapes](#prochaines-étapes)

---

## ⚛️ Qu'est-ce que React ? <a name="react"></a>

React est une **bibliothèque JavaScript** créée par Meta pour construire des interfaces utilisateur. Avant d'écrire la moindre ligne de code, il faut comprendre comment React pense.

### La philosophie : des composants

En React, toute interface est découpée en **composants** — des blocs réutilisables qui ont chacun leur propre logique et leur propre affichage.

Imagine une page d'accueil de ton application :

```
<PageAccueil>
  ├── <Navbar />
  ├── <BanniereHero />
  ├── <ListeEvenements>
  │     ├── <CarteEvenement />
  │     ├── <CarteEvenement />
  │     └── <CarteEvenement />
  └── <Footer />
```

Chaque boîte est un composant React — un fichier `.jsx` qui retourne du HTML-like appelé **JSX**.

### React vs Django : deux philosophies différentes

| | Django (Backend) | React (Frontend) |
|---|---|---|
| Langage | Python | JavaScript |
| Rôle | API REST, logique métier | Interface utilisateur |
| Ce qu'il produit | Du JSON | Du HTML visible |
| Rendu | Côté serveur | Côté client (navigateur) |

> 💡 Django ne "sait" pas que React existe. React ne "sait" pas comment Django fonctionne. Les deux communiquent uniquement via des **requêtes HTTP** qui s'échangent du JSON — exactement comme tu l'as testé avec Thunder Client.

### SPA — Single Page Application

Contrairement à un site classique où chaque clic charge une nouvelle page HTML depuis le serveur, React crée une **SPA** : une seule page HTML est chargée au démarrage, et React manipule le contenu dynamiquement sans jamais recharger la page. C'est pourquoi la navigation est si fluide.

---

## ⚡ Pourquoi Vite ? <a name="vite"></a>

**Vite** est l'outil qui initialise et fait tourner ton projet React en développement. C'est l'équivalent du serveur de développement Django (`python manage.py runserver`), mais pour le frontend.

| Outil | Rôle | Équivalent Django |
|---|---|---|
| Vite | Démarre le serveur de dev React | `manage.py runserver` |
| npm | Gestionnaire de packages JS | pip |
| `package.json` | Liste des dépendances JS | `requirements.txt` |
| `node_modules/` | Dossier des packages installés | `venv/` |

> 💡 Vite est beaucoup plus rapide que l'ancien outil standard (Create React App). C'est aujourd'hui la méthode recommandée pour démarrer un projet React.

---

## 🚀 Initialisation du projet <a name="init"></a>

### Étape 1 — Se positionner dans le bon dossier

Depuis la racine de ton projet (`otaku-events-cameroun/`), navigue dans le dossier Frontend :

```bash
cd Frontend
```

> ⚠️ Ne pas être dans `Backend/`. Les deux projets sont totalement séparés.

### Étape 2 — Créer le projet React avec Vite

```bash
npm create vite@latest . -- --template react
```

**Décryptage de la commande :**

- `npm create vite@latest` — utilise Vite pour créer le projet
- `.` — crée le projet **dans le dossier actuel** (Frontend/) sans créer de sous-dossier supplémentaire
- `-- --template react` — utilise le template React (et non Vue, Svelte, etc.)

> 💡 Si npm te demande confirmation pour installer Vite, tape `y` et valide.

### Étape 3 — Installer les dépendances

```bash
npm install
```

Cette commande lit le `package.json` et télécharge tous les packages nécessaires dans `node_modules/`. C'est l'équivalent de `pip install -r requirements.txt`.

> ⚠️ Le dossier `node_modules/` peut peser plusieurs centaines de Mo. Il ne doit **jamais** être pushé sur GitHub. Vérifie que ton `.gitignore` à la racine contient bien `node_modules/`.

### Étape 4 — Démarrer le serveur de développement

```bash
npm run dev
```

**Résultat attendu dans le terminal :**

```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Ouvre `http://localhost:5173/` dans ton navigateur — tu dois voir la page d'accueil Vite + React avec le logo React qui tourne.

> 💡 Vite tourne sur le port **5173** par défaut (et non 3000). Il faudra mettre à jour la variable `CORS_ALLOWED_ORIGINS` dans ton `settings.py` Django en conséquence.

---

## 📁 Structure du projet React <a name="structure"></a>

Après l'initialisation, voici ce que Vite a créé :

```
Frontend/
  ├── public/               ← Fichiers statiques servis tels quels (favicon, images...)
  ├── src/                  ← Tout ton code React — c'est ici que tu travailleras
  │     ├── assets/         ← Images, icônes importées dans le code
  │     ├── App.jsx         ← Composant racine — point d'entrée de ton app
  │     ├── App.css         ← Styles spécifiques à App (on va le remplacer par Tailwind)
  │     ├── main.jsx        ← Fichier de démarrage — monte React dans le HTML
  │     └── index.css       ← Styles globaux
  ├── index.html            ← L'unique page HTML — React s'y injecte
  ├── package.json          ← Dépendances et scripts npm
  ├── package-lock.json     ← Version exacte de chaque package (à versionner)
  └── vite.config.js        ← Configuration de Vite
```

### Comprendre le flux de démarrage

```
index.html
    ↓ charge
main.jsx
    ↓ monte le composant racine dans <div id="root">
App.jsx
    ↓ affiche
Tes composants (pages, boutons, cartes...)
```

### Nettoyer le projet généré

Vite crée du contenu de démonstration qu'on va supprimer. **Ne le fais pas encore** — comprends d'abord la structure. On le fera ensemble à l'étape suivante.

---

## 🧠 Concepts fondamentaux de React <a name="concepts"></a>

Avant de toucher au code, voici les 3 piliers que tu vas utiliser en permanence.

### 1. JSX — écrire du HTML dans JavaScript

JSX est la syntaxe de React. C'est du HTML qui vit à l'intérieur de fichiers JavaScript :

```jsx
// Un composant React simple
function CarteEvenement() {
  return (
    <div className="carte">
      <h2>Otaku Fest 2026</h2>
      <p>Yaoundé — 15 Mars 2026</p>
    </div>
  );
}
```

**Différences JSX vs HTML classique :**

| HTML | JSX | Raison |
|---|---|---|
| `class="..."` | `className="..."` | `class` est un mot réservé en JS |
| `<input>` | `<input />` | Toute balise doit être fermée |
| `onclick="..."` | `onClick={...}` | Les événements sont en camelCase |

### 2. Props — passer des données à un composant

Les props (propriétés) permettent de rendre un composant réutilisable en lui passant des données depuis son parent :

```jsx
// Définition du composant — reçoit des props
function CarteEvenement({ titre, ville, date }) {
  return (
    <div>
      <h2>{titre}</h2>
      <p>{ville} — {date}</p>
    </div>
  );
}

// Utilisation — on passe les données comme des attributs HTML
function App() {
  return (
    <CarteEvenement 
      titre="Otaku Fest 2026"
      ville="Yaoundé"
      date="15 Mars 2026"
    />
  );
}
```

### 3. State — la mémoire d'un composant

Le **state** (état) est la mémoire locale d'un composant. Quand le state change, React re-affiche automatiquement le composant. On utilise le hook `useState` :

```jsx
import { useState } from 'react';

function Compteur() {
  const [compte, setCompte] = useState(0);  // valeur initiale = 0

  return (
    <div>
      <p>Participants inscrits : {compte}</p>
      <button onClick={() => setCompte(compte + 1)}>
        S'inscrire
      </button>
    </div>
  );
}
```

> 💡 `useState(0)` retourne un tableau de deux éléments : la valeur actuelle (`compte`) et la fonction pour la modifier (`setCompte`). **On ne modifie jamais le state directement** — toujours passer par la fonction setter.

---

## 🎨 Configuration de Tailwind CSS <a name="tailwind"></a>

Tailwind est un framework CSS "utility-first" : au lieu d'écrire du CSS, tu appliques directement des classes sur tes éléments HTML.

**Exemple concret :**

```jsx
// Sans Tailwind — tu écris du CSS séparé
<button className="mon-bouton">Acheter</button>

// Avec Tailwind — tout est dans les classes
<button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
  Acheter
</button>
```

### Installation

```bash
npm install tailwindcss @tailwindcss/vite
```

### Configuration de Vite

Ouvre `vite.config.js` et modifie-le ainsi :

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### Activer Tailwind dans les styles globaux

Dans `src/index.css`, **remplace tout le contenu existant** par cette seule ligne :

```css
@import "tailwindcss";
```

### Vérification

Redémarre le serveur (`Ctrl+C` puis `npm run dev`), puis ajoute une classe Tailwind dans `App.jsx` pour tester :

```jsx
function App() {
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold text-purple-400">
        OtakuKamer 🎌
      </h1>
    </div>
  );
}
```

Si le fond est sombre et le titre en violet — Tailwind fonctionne. ✅

---

## 🔗 Mettre à jour CORS dans Django <a name="cors"></a>

Vite tourne sur le port **5173** et non 3000 comme prévu initialement. Il faut mettre à jour `settings.py` dans ton Backend :

```python
# Backend/otaku_backend/settings.py
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',  # ← Remplacer 3000 par 5173
]
```

---

## ✅ Vérification finale <a name="verification"></a>

À ce stade, voici ce que tu dois avoir fonctionnel :

| Élément | Statut | Vérification |
|---|---|---|
| Projet React créé avec Vite | ✅ | `npm run dev` démarre sans erreur |
| Page visible dans le navigateur | ✅ | `http://localhost:5173/` accessible |
| Tailwind CSS installé | ✅ | Les classes utilitaires s'appliquent |
| CORS Django mis à jour | ✅ | Port 5173 autorisé dans `settings.py` |
| `node_modules/` dans `.gitignore` | ✅ | Dossier non suivi par Git |

### Deux serveurs tournent maintenant en parallèle

```
Terminal 1 (Backend/)  → python manage.py runserver  → http://localhost:8000
Terminal 2 (Frontend/) → npm run dev                 → http://localhost:5173
```

> ⚠️ Il faut **deux terminaux ouverts** en permanence pendant le développement. Django et React tournent indépendamment.

---

## 🚀 Prochaines étapes <a name="prochaines-étapes"></a>

- [ ] **Réorganiser `src/`** — créer les dossiers `components/`, `pages/`, `services/`
- [ ] **Créer le routeur React** — installer `react-router-dom` pour naviguer entre les pages
- [ ] **Créer la page Login** — formulaire + appel à `/api/token/` de Django
- [ ] **Stocker le token JWT** — dans `localStorage` ou un Context React
- [ ] **Créer la page d'accueil** — liste des événements depuis `/api/evenements/`
- [ ] **Créer `axios`** — installer et configurer le client HTTP pour les appels API

---

## 🔑 Commandes de référence

```bash
# Installer les dépendances (après un git clone)
npm install

# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Installer un nouveau package
npm install nom-du-package
```

---

*Documentation rédigée dans le cadre du projet OtakuKamer — Février 2026*
