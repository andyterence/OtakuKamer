# OtakuKamer — Implémentation de la page de connexion (Login)

> Sixième partie de la documentation technique du projet  
> Couvre : Page Login · Gestion des états · Appel API JWT · Gestion des erreurs · Bonnes pratiques React

---

## 📋 Table des matières

1. [Objectif](#objectif)
2. [Dépendances utilisées](#dépendances)
3. [Structure du composant](#structure)
4. [Les états (useState)](#etats)
5. [La fonction handleSubmit](#handlesubmit)
6. [Gestion des erreurs](#erreurs)
7. [Le JSX — interface de la page](#jsx)
8. [Bugs rencontrés et corrections](#bugs)
9. [Prochaines étapes](#prochaines-étapes)

---

## 🎯 Objectif <a name="objectif"></a>

Créer une page de connexion fonctionnelle qui :

- Récupère l'email et le mot de passe de l'utilisateur
- Envoie ces informations à l'API Django (`/api/token/`)
- Stocke les tokens JWT reçus dans le `localStorage`
- Redirige l'utilisateur vers la page d'accueil après connexion réussie
- Affiche un message d'erreur en cas d'identifiants incorrects

---

## 📦 Dépendances utilisées <a name="dépendances"></a>

```jsx
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
```

| Import | Rôle |
|---|---|
| `useState` | Hook React pour gérer les états locaux du composant |
| `axios` | Client HTTP pour envoyer les requêtes à l'API Django |
| `useNavigate` | Hook React Router pour rediriger après connexion |

---

## 🏗️ Structure du composant <a name="structure"></a>

La page est divisée en **deux sections côte à côte** :

```
<div> ← conteneur principal (fond sombre)
  ├── <section> GAUCHE ← image de bienvenue + texte descriptif
  └── <section> DROITE ← formulaire de connexion
```

La section de gauche affiche une image de Goku qui change selon l'état de survol du bouton de connexion — un détail UX original lié à l'univers Otaku du projet.

---

## 🧠 Les états (useState) <a name="etats"></a>

```jsx
const [email, setEmail] = useState('')
const [motDePasse, setMotDePasse] = useState('')
const [estSurvole, setEstSurvole] = useState(false)
const [erreur, setErreur] = useState('')
```

| État | Type | Rôle |
|---|---|---|
| `email` | string | Valeur du champ email, synchronisée en temps réel |
| `motDePasse` | string | Valeur du champ mot de passe, synchronisée en temps réel |
| `estSurvole` | boolean | Vrai quand le bouton de connexion est survolé — change l'image affichée |
| `erreur` | string | Message d'erreur à afficher si la connexion échoue |

---

## ⚙️ La fonction handleSubmit <a name="handlesubmit"></a>

Fonction asynchrone déclenchée à la soumission du formulaire :

```jsx
const handleSubmit = async (e) => {
    e.preventDefault() // Empêche le rechargement de la page

    try {
        const reponse = await axios.post('http://localhost:8000/api/token/', {
            email: email,
            password: motDePasse
        })
        localStorage.setItem('access', reponse.data.access)
        localStorage.setItem('refresh', reponse.data.refresh)
        console.log(reponse.data)
        navigate('/')
    } catch (_err) {
        setErreur("Email ou mot de passe incorrect")
    }
}
```

### Fonctionnement étape par étape

1. `e.preventDefault()` — bloque le comportement natif du formulaire HTML (rechargement de page)
2. `axios.post(...)` — envoie une requête POST à Django avec l'email et le mot de passe
3. Si succès — Django retourne deux tokens, on les stocke dans le `localStorage`
4. `navigate('/')` — redirige vers la page d'accueil
5. Si échec — le `catch` attrape l'erreur et affiche un message à l'utilisateur

> 💡 `async/await` rend le code asynchrone lisible de manière linéaire, sans chaîner des `.then()`. Le `await` met la fonction en pause jusqu'à ce que la requête soit résolue.

---

## ⚠️ Gestion des erreurs <a name="erreurs"></a>

### Affichage conditionnel du message d'erreur

```jsx
{erreur && <p className="text-red-500 text-sm">{erreur}</p>}
```

Ce code n'affiche le paragraphe que si `erreur` est une chaîne non vide — c'est du **court-circuit logique** avec `&&`. Si `erreur = ''`, rien ne s'affiche.

### Effacement automatique lors de la frappe

Pour éviter que le message d'erreur reste affiché pendant que l'utilisateur corrige ses identifiants, on appelle `setErreur("")` dans les `onChange` des deux champs :

```jsx
// Champ email
onChange={(e) => {
    setEmail(e.target.value)
    setErreur("")
}}

// Champ mot de passe
onChange={(e) => {
    setMotDePasse(e.target.value)
    setErreur("")
}}
```

Ainsi, dès la première frappe après une erreur, le message disparaît et l'utilisateur sait qu'il peut réessayer.

---

## 🖥️ Le JSX — interface de la page <a name="jsx"></a>

### Image réactive au survol

```jsx
{!estSurvole && <img className='w-70 h-auto anime-flotter' src={goku} />}
{estSurvole && <img className='w-80 h-auto anime-flotter' src={goku_hover} />}
```

Le bouton de connexion déclenche les états de survol :

```jsx
<button
    onMouseEnter={() => setEstSurvole(true)}
    onMouseLeave={() => setEstSurvole(false)}
    onClick={handleSubmit}
    type="submit"
>
    SE CONNECTER
</button>
```

### Formulaire contrôlé

Les champs sont **contrôlés** par React — leur valeur est toujours synchronisée avec l'état :

```jsx
<input
    value={email}
    onChange={(e) => {
        setEmail(e.target.value)
        setErreur("")
    }}
    type="email"
/>
```

> 💡 Un composant **contrôlé** en React est un champ dont la valeur est dictée par le state. React est la "source de vérité" — pas le DOM. Cela permet de lire la valeur à tout moment sans interroger le DOM directement.

---

## 🐛 Bugs rencontrés et corrections <a name="bugs"></a>

### Bug 1 — Variable `reponse` hors du scope

```jsx
// ❌ Avant
try {
    const reponse = await axios.post(...)
} catch (_err) { ... }
console.log(reponse.data) // ReferenceError : reponse n'existe pas ici

// ✅ Après — console.log déplacé dans le try
try {
    const reponse = await axios.post(...)
    console.log(reponse.data) // ← ici
    navigate('/')
} catch (_err) { ... }
```

`const` déclare une variable dans le bloc `{}` où elle est définie. Elle n'existe pas en dehors de ce bloc.

### Bug 2 — Conflit de noms (shadowing)

```jsx
// ❌ Avant — deux variables nommées "erreur"
const [erreur, setErreur] = useState('')
...
catch (erreur) { // ← "erreur" écrase le state dans ce bloc
    setErreur("Email ou mot de passe incorrect")
}

// ✅ Après — renommage du paramètre catch
catch (_err) {
    setErreur("Email ou mot de passe incorrect")
}
```

Le préfixe `_` est la convention JavaScript pour indiquer à ESLint qu'une variable est intentionnellement ignorée.

### Bug 3 — `required` sur la checkbox

```jsx
// ❌ Avant — obligeait l'utilisateur à cocher la case pour se connecter
<input type="checkbox" required />

// ✅ Après — attribut supprimé
<input type="checkbox" />
```

---

## 🚀 Prochaines étapes <a name="prochaines-étapes"></a>

- [ ] **Routes protégées** — créer un composant `PrivateRoute` qui vérifie la présence du token JWT avant d'autoriser l'accès à une page
- [ ] **Page d'accueil** — créer la page `/` avec la liste des événements depuis `/api/evenements/`
- [ ] **Déconnexion** — créer une fonction logout qui supprime les tokens du `localStorage`
- [ ] **Rafraîchissement du token** — gérer automatiquement le renouvellement de l'access token avec le refresh token
- [ ] **Page d'inscription** — formulaire de création de compte relié à l'API Django

---

## 🔑 Concepts clés retenus

| Concept | Explication |
|---|---|
| Composant contrôlé | Champ dont la valeur est gérée par le state React, pas le DOM |
| Court-circuit `&&` | `{condition && <Composant />}` — affiche le composant uniquement si la condition est vraie |
| Scope de bloc | Une variable `const` déclarée dans `{}` n'existe que dans ce bloc |
| Shadowing | Une variable locale qui porte le même nom qu'une variable parente masque cette dernière |
| Convention `_` | Préfixer une variable avec `_` signale à ESLint qu'elle est intentionnellement inutilisée |

---

*Documentation rédigée dans le cadre du projet OtakuKamer — Février 2026*
