# OtakuKamer — Implémentation de la page d'inscription (Register)

> Huitième partie de la documentation technique du projet  
> Couvre : Page Register · Validation des mots de passe · Indicateur de force · Images dynamiques · Appel API inscription · Corrections Django

---

## 📋 Table des matières

1. [Objectif](#objectif)
2. [Dépendances utilisées](#dépendances)
3. [Les états (useState)](#etats)
4. [La fonction handleSubmit](#handlesubmit)
5. [Indicateur de force du mot de passe](#force)
6. [Images dynamiques](#images)
7. [Corrections Django](#django)
8. [Bugs rencontrés et corrections](#bugs)
9. [Prochaines étapes](#prochaines-étapes)

---

## 🎯 Objectif <a name="objectif"></a>

Créer une page d'inscription fonctionnelle qui :

- Collecte les informations de l'utilisateur (nom, prénom, email, date de naissance, rôle, mot de passe)
- Valide que les mots de passe correspondent avant d'envoyer la requête
- Affiche un indicateur visuel de force du mot de passe (barre + images Goku progressives)
- Envoie les données à l'API Django (`/api/utilisateurs/`)
- Redirige vers la page de connexion après une inscription réussie
- Affiche un message d'erreur en cas d'échec

---

## 📦 Dépendances utilisées <a name="dépendances"></a>

```jsx
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import forcePassword, { getNiveauPassword } from '../utils/forcePassword'
```

| Import | Rôle |
|---|---|
| `useState` | Hook React pour gérer les états locaux |
| `axios` | Client HTTP pour envoyer les données à l'API Django |
| `useNavigate` | Hook React Router pour rediriger après inscription |
| `forcePassword` | Retourne le JSX de la barre de progression du mot de passe |
| `getNiveauPassword` | Retourne le niveau textuel du mot de passe pour les images |

---

## 🧠 Les états (useState) <a name="etats"></a>

```jsx
const [nom, setNom] = useState('')
const [prenom, setPrenom] = useState('')
const [email, setEmail] = useState('')
const [dateNaissance, setDateNaissance] = useState('')
const [motDePasse, setMotDePasse] = useState('')
const [motDePasseConfirmation, setMotDePasseConfirmation] = useState('')
const [role, setRole] = useState('membre')
const [estSurvole, setEstSurvole] = useState(false)
const [passwordForce, setPasswordForce] = useState("")
const [erreur, setErreur] = useState('')
const [enAttente, setEnAttente] = useState(false)
```

| État | Type | Rôle |
|---|---|---|
| `nom` | string | Valeur du champ nom (`first_name` côté Django) |
| `prenom` | string | Valeur du champ prénom (`last_name` côté Django) |
| `email` | string | Adresse email de l'utilisateur |
| `dateNaissance` | string | Date de naissance (`dateNaiss` côté Django) |
| `motDePasse` | string | Mot de passe saisi |
| `motDePasseConfirmation` | string | Confirmation du mot de passe |
| `role` | string | Rôle choisi : `"membre"` ou `"organisateur"` |
| `estSurvole` | boolean | Survol du bouton — change l'image affichée |
| `passwordForce` | string | Niveau de force : "Très faible" à "Très fort" |
| `erreur` | string | Message d'erreur à afficher |
| `enAttente` | boolean | Affiche l'overlay de chargement pendant la requête |

---

## ⚙️ La fonction handleSubmit <a name="handlesubmit"></a>

```jsx
const handleSubmit = async (e) => {
    e.preventDefault()
    setEnAttente(true)

    // Validation côté frontend avant d'envoyer la requête
    if (motDePasse !== motDePasseConfirmation) {
        setErreur("Les mots de passe ne correspondent pas")
        setEnAttente(false)
        return
    }

    try {
        const reponse = await axios.post('http://localhost:8000/api/utilisateurs/', {
            first_name: nom,
            last_name: prenom,
            email: email,
            dateNaiss: dateNaissance,
            role: role,
            password: motDePasse,
            motDePasseConfirmation: motDePasseConfirmation
        })
        console.log(reponse.data)
        navigate('/login')
    } catch (_err) {
        setErreur("Information incorrect")
        console.error(_err)
        console.error(_err.response.data)
    } finally {
        setEnAttente(false)
    }
}
```

### Points importants

- La validation des mots de passe se fait **avant** le `try` pour éviter une requête inutile
- `setEnAttente(false)` est appelé **avant** le `return` pour éviter que l'overlay reste bloqué
- Les noms des champs envoyés (`first_name`, `last_name`, `dateNaiss`) correspondent aux champs réels du modèle Django
- Contrairement à la page Login, **aucun token n'est stocké** — l'inscription ne connecte pas l'utilisateur automatiquement
- Après succès, redirection vers `/login` pour que l'utilisateur se connecte avec son nouveau compte

---

## 📊 Indicateur de force du mot de passe <a name="force"></a>

La force est calculée dans `src/utils/forcePassword.js` qui exporte deux fonctions :

### `forcePassword(password)` — export default
Retourne un composant JSX (barre de progression colorée) affiché sous le champ mot de passe :
```jsx
{forcePassword(motDePasse)}
```

### `getNiveauPassword(password)` — export nommé
Retourne une chaîne de caractères représentant le niveau :

| Condition | Niveau retourné |
|---|---|
| Longueur = 0 | `"Très faible"` |
| Longueur < 8 | `"Faible"` |
| Longueur < 12 ou manque maj/min/chiffre | `"Moyen"` |
| ≥ 12 + maj + min + chiffre + spécial | `"Fort"` |
| Combinaison avancée | `"Très fort"` |

Utilisé dans le `onChange` du champ mot de passe :
```jsx
onChange={(e) => {
    setMotDePasse(e.target.value)
    setPasswordForce(getNiveauPassword(e.target.value))
}}
```

---

## 🎨 Images dynamiques <a name="images"></a>

L'image affichée à gauche change selon l'état du formulaire, selon une priorité stricte :

```jsx
{/* 1. Défaut — aucun état actif */}
{!erreur && !estSurvole && !passwordForce && <img src={goku_hover} />}

{/* 2. Erreur — priorité sur tout */}
{erreur && <img src={goku_erreur} />}

{/* 3. Survol du bouton */}
{!erreur && estSurvole && !passwordForce && <img src={inscription_etat_final} />}

{/* 4. Force du mot de passe — 5 niveaux */}
{!erreur && passwordForce && (
    passwordForce == "Très faible" ? <img src={goku_hover} /> :
    passwordForce == "Faible"      ? <img src={goku_chargement_1} /> :
    passwordForce == "Moyen"       ? <img src={goku_chargement_2} /> :
    passwordForce == "Fort"        ? <img src={inscription_etat_final} /> :
    <img src={goku_chargement_3} />  // Très fort
)}
```

> 💡 La condition `!erreur` sur le bloc `passwordForce` est cruciale — elle empêche l'image de force de s'afficher en même temps que `goku_erreur` lors d'une erreur API.

---

## 🔧 Corrections Django <a name="django"></a>

### 1 — Permissions dans le ViewSet (`users/views.py`)

Le endpoint `/api/utilisateurs/` refusait les requêtes non authentifiées (`401`). La méthode `get_permissions` permet de différencier les actions :

```python
from rest_framework import viewsets, permissions

class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]   # Inscription ouverte à tous
        return [permissions.IsAuthenticated()]  # Reste protégé
```

### 2 — Méthode `create` dans le Serializer (`users/serializers.py`)

Le champ `username` était requis par Django (`REQUIRED_FIELDS = ['username']`) mais non envoyé par le frontend. La méthode `create` le génère automatiquement à partir de l'email :

```python
class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'dateNaiss', 'photoProfil', 'role']

    def create(self, validated_data):
        validated_data['username'] = validated_data['email']
        user = Utilisateur.objects.create_user(**validated_data)
        return user
```

> ⚠️ `create_user` (et non `create`) est indispensable — il **hache le mot de passe** avant de le sauvegarder. Utiliser `create` stockerait le mot de passe en clair dans la base de données.

---

## 🐛 Bugs rencontrés et corrections <a name="bugs"></a>

### Bug 1 — Erreur 401 Unauthorized
Django refusait la création d'utilisateur sans token. Corrigé en ajoutant `get_permissions` dans le ViewSet avec `AllowAny` pour l'action `create`.

### Bug 2 — Erreur 400 Bad Request (champ `nom` invalide)
Le frontend envoyait `nom` et `prenom`, mais le modèle Django utilise `first_name` et `last_name`. Corrigé en renommant les clés dans l'appel `axios.post`.

### Bug 3 — Erreur 500 (champ `username` manquant)
Django exigeait `username` même si `USERNAME_FIELD = 'email'`. Corrigé dans le serializer avec `validated_data['username'] = validated_data['email']`.

### Bug 4 — Faute de frappe dans le `<select>`
```jsx
<option value="memnbre">  // ❌ double 'm'
<option value="membre">   // ✅
```

### Bug 5 — Validation des mots de passe placée après `navigate`
La vérification `motDePasse !== motDePasseConfirmation` était après `navigate('/login')` — elle n'était jamais atteinte. Déplacée **avant** le `try`.

### Bug 6 — `setEnAttente(false)` manquant avant `return`
Sans ce `setEnAttente(false)`, l'overlay de chargement restait affiché indéfiniment quand les mots de passe ne correspondaient pas, car le `finally` n'est pas exécuté après un `return`.

### Bug 7 — Tokens stockés inutilement
```jsx
// ❌ Supprimé — l'endpoint d'inscription ne retourne pas de tokens
localStorage.setItem('access', reponse.data.access)
localStorage.setItem('refresh', reponse.data.refresh)
```

### Bug 8 — Méthode `create` mal indentée dans `Meta`
```python
# ❌ Avant — dans Meta (ignorée silencieusement)
class Meta:
    fields = [...]
    def create(self, validated_data): ...

# ✅ Après — dans le corps du serializer
class Meta:
    fields = [...]
def create(self, validated_data): ...
```

---

## 🔑 Concepts clés retenus

| Concept | Explication |
|---|---|
| `create_user` vs `create` | `create_user` hache le mot de passe ; `create` le stocke en clair |
| `get_permissions` | Permet de définir des permissions différentes selon l'action HTTP |
| Validation frontend | Vérifier les données **avant** d'envoyer la requête évite les appels inutiles |
| `setEnAttente(false)` avant `return` | `finally` n'est pas exécuté après `return` — il faut réinitialiser manuellement |
| Correspondance des noms de champs | Les clés envoyées par axios doivent correspondre exactement aux champs du serializer Django |

---

## 🚀 Prochaines étapes <a name="prochaines-étapes"></a>

- [ ] **Page d'accueil** — créer le composant `Accueil.jsx` avec la liste des événements
- [ ] **Navbar** — barre de navigation avec bouton de déconnexion
- [ ] **Déconnexion** — fonction logout qui supprime les tokens du localStorage
- [ ] **Rafraîchissement du token** — renouvellement automatique de l'access token expiré
- [ ] **Validation avancée** — vérifier le format de l'email, la longueur minimale du mot de passe côté frontend

---

*Documentation rédigée dans le cadre du projet OtakuKamer — Février 2026*
