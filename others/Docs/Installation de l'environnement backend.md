# OtakuKamer — Documentation d'installation et de configuration

> Application web de gestion des événements Otaku au Cameroun  
> Stack : Django (Backend) + React (Frontend) + MySQL (Base de données)
---

## 📋 Table des matières

1. [Architecture du projet](#architecture)
2. [Prérequis](#prérequis)
3. [Structure des dossiers](#structure)
4. [Installation de l'environnement Backend](#backend)
5. [Configuration de Django](#configuration)
6. [Prochaines étapes](#prochaines-étapes)

---

## 🏗️ Architecture du projet <a name="architecture"></a>

```
[React Frontend]  <--->  [Django REST API]  <--->  [Base de données MySQL]
   port 3000                 port 8000
```

React et Django sont deux applications **séparées** qui communiquent via des requêtes HTTP en échangeant du **JSON**. Cette architecture est différente d'un monolithique Laravel+Blade où le backend génère le HTML directement.

---

## ✅ Prérequis <a name="prérequis"></a>

Avant de commencer, assurez-vous d'avoir installé :

- **Python 3.10+** — vérifier avec `python --version`
- **XAMPP** avec MariaDB **10.6 ou supérieur** (requis par Django 6)
- **Node.js** — pour le frontend React (installation ultérieure)
- **VS Code** ou tout autre éditeur de code

> ⚠️ Django 6 exige MariaDB 10.6 minimum. Si vous avez une version antérieure, mettez à jour XAMPP avant de continuer.

---

## 📁 Structure des dossiers <a name="structure"></a>

```
otaku-events-cameroun/
    ├── Backend/                  ← Projet Django
    │     ├── otaku_backend/      ← Module de configuration Django
    │     │     ├── __init__.py
    │     │     ├── settings.py   ← Configuration globale (BD, apps, CORS...)
    │     │     ├── urls.py       ← Fichier de routes principal
    │     │     ├── asgi.py       ← Point d'entrée ASGI
    │     │     └── wsgi.py       ← Point d'entrée WSGI
    │     ├── venv/               ← Environnement virtuel Python (ne pas versionner)
    │     ├── manage.py           ← Outil CLI Django (équivalent d'Artisan Laravel)
    │     └── requirements.txt    ← Liste des dépendances Python
    │
    └── Frontend/                 ← Projet React (configuration ultérieure)
```

---

## 🔧 Installation de l'environnement Backend <a name="backend"></a>

### Étape 1 — Créer la structure de dossiers

Créez manuellement les dossiers `Backend/` et `Frontend/` dans votre répertoire de projet.

### Étape 2 — Créer l'environnement virtuel

Naviguez dans le dossier `Backend/` et créez l'environnement virtuel :

```bash
cd Backend
python -m venv venv
```

> 💡 L'environnement virtuel est une **bulle isolée** qui contient une copie de Python et tous les packages du projet. Cela évite les conflits entre différents projets Python sur votre machine. C'est l'équivalent du dossier `vendor/` en Laravel.

### Étape 3 — Activer l'environnement virtuel

**Windows :**
```bash
venv\Scripts\activate
```

**Mac / Linux :**
```bash
source venv/bin/activate
```

✅ L'environnement est activé quand vous voyez `(venv)` au début de votre ligne de terminal :
```
(venv) PS E:\...\Backend>
```

> ⚠️ L'environnement virtuel doit être activé à chaque nouvelle session de terminal avant de travailler sur le projet.

### Étape 4 — Installer les dépendances

```bash
pip install django djangorestframework djangorestframework-simplejwt mysqlclient django-cors-headers
```

| Package | Rôle |
|---|---|
| `django` | Framework web Python — le cœur du projet |
| `djangorestframework` | Transforme Django en API REST qui retourne du JSON |
| `djangorestframework-simplejwt` | Gestion de l'authentification par tokens JWT |
| `mysqlclient` | Pont de communication entre Django et MySQL |
| `django-cors-headers` | Autorise React (port 3000) à communiquer avec Django (port 8000) |

### Étape 5 — Créer le projet Django

```bash
django-admin startproject otaku_backend .
```

> 💡 Le `.` à la fin crée le projet dans le dossier actuel sans créer de sous-dossier supplémentaire.

### Étape 6 — Générer le fichier requirements.txt

```bash
pip freeze > requirements.txt
```

> 💡 Ce fichier liste toutes les dépendances installées avec leurs versions exactes. C'est l'équivalent du `composer.json` de Laravel. Un autre développeur peut recréer l'environnement avec `pip install -r requirements.txt`.

---

## ⚙️ Configuration de Django <a name="configuration"></a>

Toute la configuration se fait dans `Backend/otaku_backend/settings.py`.

### 1. Applications installées — `INSTALLED_APPS`

Ajoutez `rest_framework` et `corsheaders` à la liste :

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',     #  Django REST Framework
    'corsheaders',        #  Gestion du CORS
]
```

### 2. Middlewares — `MIDDLEWARE`

Ajoutez `CorsMiddleware` **en première position** de la liste :

```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',    # ← En premier obligatoirement
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

> 💡 Un **middleware** est un intercepteur qui s'exécute automatiquement sur chaque requête entrante, avant que votre code métier ne soit atteint. Django les traite dans l'ordre de la liste, de haut en bas. `CorsMiddleware` doit être en premier pour examiner les requêtes avant tout autre traitement.

### 3. Base de données — `DATABASES`

Remplacez la configuration SQLite par défaut par MySQL :

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'otaku_kamer_db',     # Nom de la base de données à créer dans MySQL
        'USER': 'root',               # Utilisateur MySQL
        'PASSWORD': '',               # Mot de passe MySQL (vide par défaut sur XAMPP)
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

> ⚠️ Vous devez créer manuellement la base de données `otaku_kamer_db` dans phpMyAdmin avant de lancer les migrations.

### 4. Configuration CORS

Ajoutez cette variable à la fin du fichier `settings.py` :

```python
# Autorise React à communiquer avec Django
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
]
```

---

## 🔑 Concepts clés à retenir

### Fichiers importants de Django

| Fichier | Équivalent Laravel | Rôle |
|---|---|---|
| `settings.py` | `config/` | Configuration globale du projet |
| `urls.py` | `routes/web.php` | Définition des routes API |
| `manage.py` | `php artisan` | Outil CLI pour les commandes Django |
| `wsgi.py` / `asgi.py` | — | Point d'entrée réel de l'application |

### Commandes essentielles

```bash
# Démarrer le serveur de développement
python manage.py runserver

# Appliquer les migrations en base de données
python manage.py migrate

# Créer un superutilisateur (admin)
python manage.py createsuperuser

# Créer les fichiers de migration après modification des modèles
python manage.py makemigrations
```

### JWT — JSON Web Token

Système d'authentification adapté aux architectures séparées Frontend/Backend. Fonctionnement :

1. React envoie email + mot de passe à Django
2. Django vérifie et retourne un **token JWT**
3. React stocke ce token et l'envoie dans toutes les requêtes suivantes
4. Django lit le token et identifie l'utilisateur sans redemander le mot de passe

---

## 🚀 Prochaines étapes <a name="prochaines-étapes"></a>

- [ ] Mettre à jour XAMPP (MariaDB 10.6+)
- [ ] Créer la base de données `otaku_kamer_db` dans phpMyAdmin
- [ ] Lancer `python manage.py migrate`
- [ ] Créer les applications Django (`events`, `users`, `news`)
- [ ] Définir les modèles selon le MLD
- [ ] Configurer les serializers et les vues DRF
- [ ] Configurer l'authentification JWT
- [ ] Setup du Frontend React avec Vite + Tailwind

---

*Documentation rédigée dans le cadre du projet OtakuKamer — Février 2026*