# OtakuKamer — Authentification JWT & Tests API

> Quatrieme partie de la documentation technique du projet  
> Couvre : Configuration JWT · Sécurisation des endpoints · Tests avec Thunder Client

---

## 📋 Table des matières

1. [Qu'est-ce que JWT ?](#jwt)
2. [Configuration dans settings.py](#settings)
3. [Endpoints JWT dans urls.py](#urls)
4. [Test avec Thunder Client](#tests)
5. [Sécurisation du projet (.env)](#env)
6. [Gestion du dépôt GitHub](#github)
7. [Prochaines étapes](#prochaines-étapes)

---

## 🔐 Qu'est-ce que JWT ? <a name="jwt"></a>

JWT (JSON Web Token) est un système d'authentification adapté aux architectures découplées Frontend/Backend. Contrairement aux sessions classiques, Django ne stocke rien en base de données — tout est contenu dans le token lui-même.

### Fonctionnement

```
1. React envoie username + password à /api/token/
        ↓
2. Django vérifie les identifiants en base de données
        ↓
3. Si correct, Django encode les infos (user id, expiration...)
   avec la SECRET_KEY → produit un token chiffré
        ↓
4. Django retourne deux tokens :
   - access token  (valable ~5 minutes)
   - refresh token (valable ~1 jour)
        ↓
5. React envoie l'access token dans chaque requête protégée
6. Quand l'access token expire → React utilise le refresh token
   pour en obtenir un nouveau silencieusement
```

### Structure d'un token JWT

Un token est composé de **3 parties** séparées par des points :

```
eyJhbG...   ← Header  : algorithme de chiffrement utilisé
eyJ0eX...   ← Payload : données (user id, expiration, type...)
SflKxw...   ← Signature : garantit que le token n'a pas été modifié
```

> 💡 Tu peux décoder n'importe quel token JWT sur **jwt.io** pour voir ce qu'il contient.

### Pourquoi deux tokens ?

| Token | Durée | Rôle |
|---|---|---|
| `access` | ~5 minutes | Envoyé à chaque requête pour s'identifier |
| `refresh` | ~1 jour | Permet d'obtenir un nouvel access token sans se reconnecter |

L'access token expire vite pour limiter les risques en cas de vol. Le refresh token évite de demander à l'utilisateur de se reconnecter toutes les 5 minutes.

---

## ⚙️ Configuration dans settings.py <a name="settings"></a>

On ajoute la variable `REST_FRAMEWORK` pour dire à DRF d'utiliser JWT par défaut :

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}
```

- `DEFAULT_AUTHENTICATION_CLASSES` — comment DRF vérifie l'identité de l'utilisateur
- `DEFAULT_PERMISSION_CLASSES: IsAuthenticated` — tous les endpoints nécessitent d'être connecté par défaut

---

## 🔗 Endpoints JWT dans urls.py <a name="urls"></a>

`simplejwt` fournit deux vues prêtes à l'emploi qu'on branche dans `otaku_backend/urls.py` :

```python
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
```

| Endpoint | Méthode | Rôle |
|---|---|---|
| `/api/token/` | POST | Envoie username + password → reçoit access + refresh tokens |
| `/api/token/refresh/` | POST | Envoie refresh token → reçoit un nouvel access token |

---

## 🧪 Test avec Thunder Client <a name="tests"></a>

Thunder Client est un **client HTTP** intégré à VS Code qui permet de tester l'API sans écrire de code React. Il simule exactement ce que le Frontend fera plus tard.

> 💡 Installation : `Ctrl + Shift + X` → chercher **Thunder Client** → Install. Un redémarrage de VS Code peut être nécessaire pour voir l'icône ⚡ apparaître.

### Test 1 — Obtenir les tokens (login)

**Requête :**
- Méthode : `POST`
- URL : `http://127.0.0.1:8000/api/token/`
- Body → JSON :

```json
{
    "username": "Ndoubi",
    "password": "ton_password"
}
```

**Réponse attendue (`200 OK`) :**

```json
{
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Test 2 — Accéder à un endpoint protégé

**Requête :**
- Méthode : `GET`
- URL : `http://127.0.0.1:8000/api/evenements/`
- Auth → **Bearer** → coller l'`access` token

**Réponse attendue (`200 OK`) :**

```json
[]
```

> 💡 Le `[]` est normal — la table est vide. L'important c'est le `200 OK` qui confirme que le token est reconnu.

**Sans token (`401 Unauthorized`) :**

```json
{
    "detail": "Authentication credentials were not provided."
}
```

> ⚠️ L'access token expire en **5 minutes**. Si tu reçois un `401`, refais d'abord le Test 1 pour obtenir un nouveau token.

### Superutilisateur

Pour tester le login, on crée d'abord un superutilisateur :

```bash
# Toujours depuis Backend/ avec le venv activé
python manage.py createsuperuser
```

---

## 🔒 Sécurisation du projet (.env) <a name="env"></a>

Les informations sensibles ne doivent jamais être pushées sur GitHub. On utilise `python-dotenv` pour les stocker dans un fichier `.env` local.

### Installation

```bash
pip install python-dotenv
pip freeze > requirements.txt
```

### Fichier `.env` (jamais pushé)

```env
SECRET_KEY=django-insecure-ta_cle_secrete
DB_NAME=otaku_kamer_db
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
```

### Fichier `.env.example` (pushé sur GitHub)

```env
SECRET_KEY=
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
```

### Modification de settings.py

```python
from dotenv import load_dotenv
import os
load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}
```

> ⚠️ Ne pas mettre de guillemets autour des valeurs dans le `.env` — `os.getenv()` les inclurait dans la valeur lue.

---

## 🐙 Gestion du dépôt GitHub <a name="github"></a>

### Leçons apprises

- Toujours initialiser Git depuis la **racine du projet**, pas depuis un sous-dossier
- Le `.gitignore` doit être à la **racine** avant le premier commit
- Un dossier vide n'est pas suivi par Git → ajouter un fichier `.gitkeep`

### Structure du dépôt

```
OtakuKamer/
  ├── .gitignore          ← à la racine
  ├── Backend/
  │     ├── .env          ← jamais pushé
  │     ├── .env.example  ← pushé (valeurs vides)
  │     └── ...
  ├── Frontend/
  │     └── .gitkeep      ← pour que Git suive le dossier vide
  └── docs/               ← documentation et diagrammes
```

### Commandes Git utilisées

```bash
# Retirer un fichier du suivi Git sans le supprimer
git rm --cached .env

# Supprimer un dossier .git parasite (PowerShell)
Remove-Item -Recurse -Force Backend/.git

# Renommer un dossier (PowerShell)
Rename-Item -Path others -NewName docs

# Créer un fichier vide (PowerShell)
New-Item -ItemType File -Path Frontend/.gitkeep

# Récupérer les commits distants avant de pusher
git pull origin main --rebase

# Pusher et lier la branche locale à origin
git push -u origin main
```

### Générer une nouvelle SECRET_KEY

Si l'ancienne clé a été exposée publiquement :

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

---

## 🚀 Prochaines étapes <a name="prochaines-étapes"></a>

- [ ] Configurer l'interface **Admin Django** — enregistrer les modèles dans `admin.py`
- [ ] Initialiser le **Frontend React** avec Vite + Tailwind CSS
- [ ] Créer les pages React (Login, Liste des événements, Détail...)
- [ ] Connecter React à l'API Django avec les tokens JWT
- [ ] Implémenter le système d'achat de billets
- [ ] Déploiement en production

---

*Documentation rédigée dans le cadre du projet OtakuKamer — Février 2026*
