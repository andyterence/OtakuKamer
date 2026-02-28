# OtakuKamer — Routes Protégées & Écran de Chargement

> Septième partie de la documentation technique du projet  
> Couvre : Composant PrivateRoute · Protection des routes · Écran de chargement · export default

---

## 📋 Table des matières

1. [Objectif](#objectif)
2. [Écran de chargement](#chargement)
3. [Le composant PrivateRoute](#privateroute)
4. [Intégration dans App.jsx](#app)
5. [Concepts clés retenus](#concepts)
6. [Bugs rencontrés et corrections](#bugs)
7. [Prochaines étapes](#prochaines-étapes)

---

## 🎯 Objectif <a name="objectif"></a>

Deux améliorations réalisées dans cette partie :

- **Écran de chargement** — afficher une image de Goku pendant que la requête de connexion est en cours
- **Routes protégées** — empêcher un utilisateur non connecté d'accéder aux pages réservées aux membres

---

## ⏳ Écran de chargement <a name="chargement"></a>

### Principe

Un nouvel état `enAttente` est ajouté au composant Login. Il passe à `true` au début de la requête et revient à `false` à la fin, qu'elle réussisse ou échoue.

```jsx
const [enAttente, setEnAttente] = useState(false)
```

### Placement dans handleSubmit

Le bloc `finally` est la clé — il s'exécute **toujours**, que la requête réussisse ou échoue :

```jsx
const handleSubmit = async (e) => {
    e.preventDefault()
    setEnAttente(true)  // ← début de la requête

    try {
        const reponse = await axios.post(...)
        localStorage.setItem('access', reponse.data.access)
        localStorage.setItem('refresh', reponse.data.refresh)
        navigate('/')
    } catch (_err) {
        setErreur("Email ou mot de passe incorrect")
    } finally {
        setEnAttente(false)  // ← toujours exécuté, succès ou erreur
    }
}
```

> 💡 `finally` est un bloc qui s'exécute **dans tous les cas** après un `try/catch`. C'est l'endroit idéal pour réinitialiser un état de chargement.

### Affichage de l'overlay

L'écran de chargement est un **overlay** qui recouvre toute la page grâce à `fixed inset-0` :

```jsx
{enAttente && (
    <div className='fixed inset-0 bg-[#0D0D0D] flex items-center justify-center z-50'>
        <img className='w-80 h-auto anime-flotter' src={goku_attend} />
    </div>
)}
```

| Classe Tailwind | Rôle |
|---|---|
| `fixed` | Sort l'élément du flux normal et le positionne par rapport à la fenêtre |
| `inset-0` | Étire l'élément sur toute la fenêtre (top/right/bottom/left = 0) |
| `z-50` | Place l'overlay par-dessus tous les autres éléments |

---

## 🔒 Le composant PrivateRoute <a name="privateroute"></a>

### Pourquoi un composant dédié ?

Plutôt que de répéter la vérification du token dans chaque page protégée, on crée un composant réutilisable `PrivateRoute` qui s'occupe de cette logique une seule fois.

### Code complet — `src/components/PrivateRoute.jsx`

```jsx
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children }) {
    const token = localStorage.getItem('access')
    return token ? children : <Navigate to="/login" />
}
```

### Fonctionnement ligne par ligne

- `{ children }` — prop spéciale React qui représente tout ce qui est placé entre les balises du composant
- `localStorage.getItem('access')` — lit le token d'accès stocké lors de la connexion
- `token ? children : <Navigate to="/login" />` — opérateur ternaire : si token existe → affiche la page, sinon → redirige

### La prop `children`

`children` est une prop spéciale en React. Quand on écrit :

```jsx
<PrivateRoute>
    <PageAccueil />
</PrivateRoute>
```

`<PageAccueil />` est automatiquement disponible dans `PrivateRoute` via `props.children` ou `{ children }`.

---

## 🗺️ Intégration dans App.jsx <a name="app"></a>

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
            <h1>Page Accueil</h1>
          </PrivateRoute>
        } />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

### Flux complet de navigation

```
Utilisateur non connecté → tente d'accéder à /
        ↓
PrivateRoute vérifie le localStorage → pas de token
        ↓
Redirige automatiquement vers /login
        ↓
L'utilisateur entre ses identifiants → Django retourne les tokens
        ↓
Tokens stockés dans localStorage → redirige vers /
        ↓
PrivateRoute vérifie → token présent → affiche la page
```

---

## 🔑 Concepts clés retenus <a name="concepts"></a>

### export default vs export nommé

Un fichier JavaScript est une boîte fermée par défaut. `export` permet de rendre son contenu accessible depuis d'autres fichiers.

| Type | Syntaxe | Import |
|---|---|---|
| `export default` | `export default function MonComposant()` | `import MonComposant from './MonComposant'` |
| Export nommé | `export function MonComposant()` | `import { MonComposant } from './MonComposant'` |

En React, la convention est d'utiliser `export default` pour les composants — un composant par fichier.

### Sécurité : React vs Django

La protection des routes côté React est une **protection visuelle uniquement** :

- Un utilisateur peut modifier le `localStorage` manuellement depuis les outils développeur
- React tourne dans le navigateur — son code est visible et modifiable

La **vraie sécurité** est assurée par Django : chaque requête vers l'API est vérifiée avec le token JWT. Si le token est absent, faux ou expiré, Django retourne `401 Unauthorized` et refuse les données.

```
React  → protège l'affichage  (expérience utilisateur)
Django → protège les données  (sécurité réelle)
```

Les deux niveaux sont complémentaires et nécessaires.

### finally

```jsx
try {
    // code qui peut échouer
} catch (err) {
    // exécuté si erreur
} finally {
    // exécuté TOUJOURS, succès ou erreur
}
```

---

## 🐛 Bugs rencontrés et corrections <a name="bugs"></a>

### Bug — `export default` manquant

```jsx
// ❌ Avant — composant déclaré mais inutilisable depuis d'autres fichiers
function PrivateRoute({ children }) { ... }

// ✅ Après
export default function PrivateRoute({ children }) { ... }
```

Sans `export default`, ESLint signale : *'PrivateRoute' is declared but its value is never read*.

---

## 🚀 Prochaines étapes <a name="prochaines-étapes"></a>

- [ ] **Page d'accueil** — créer le composant `Accueil.jsx` avec la liste des événements depuis `/api/evenements/`
- [ ] **Navbar** — créer une barre de navigation avec un bouton de déconnexion
- [ ] **Déconnexion** — fonction logout qui supprime les tokens du localStorage et redirige vers `/login`
- [ ] **Rafraîchissement du token** — gérer le renouvellement automatique de l'access token expiré
- [ ] **Vérification côté Django** — s'assurer que les endpoints sensibles retournent bien `401` sans token valide

---

*Documentation rédigée dans le cadre du projet OtakuKamer — Février 2026*
