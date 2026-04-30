# OtakuKamer — Documentation de progression

> Application web de gestion des événements Otaku au Cameroun  
> Stack : Django (Backend) + React (Frontend) + MySQL (Base de données)

---

## 📋 Table des matières

1. [Vision du projet](#vision)
2. [Stack technique](#stack)
3. [Architecture du projet](#architecture)
4. [Ce qui est accompli](#accompli)
5. [Prochaines étapes](#prochaines-étapes)
6. [Commandes de référence](#commandes)

---

## 🎯 Vision du projet <a name="vision"></a>

OtakuKamer est une application web destinée aux passionnés de Manga, Anime et Gaming au Cameroun. Elle permet de recenser les événements Otaku, d'acheter des billets en ligne et de consulter des actualités de la culture Otaku.

**Acteurs du système :**

- **Visiteur** — consulte les événements et les news sans compte
- **Membre connecté** — s'inscrit à des événements, achète des billets, commente
- **Organisateur** — crée et gère ses propres événements
- **Admin** — publie les news, modère le contenu, gère les utilisateurs

---

## 🛠️ Stack technique <a name="stack"></a>

| Couche | Technologie | Rôle |
|---|---|---|
| Backend | Python / Django REST Framework | API REST — logique métier |
| Frontend | React + Tailwind CSS | Interface utilisateur — SPA |
| Base de données | MySQL (XAMPP / MariaDB 10.6+) | Persistance des données |
| Auth | JWT (SimpleJWT) | Authentification stateless |
| CORS | django-cors-headers | Communication React ↔ Django |
| Versionning | Git & GitHub | Gestion du code source |

---

## 🏗️ Architecture du projet <a name="architecture"></a>

React et Django sont deux applications **séparées** qui communiquent via des requêtes HTTP en échangeant du **JSON**. Django ne génère aucun HTML — il expose uniquement une API REST.

```
[React Frontend]  <--->  [Django REST API]  <--->  [Base de données MySQL]
   port 3000                 port 8000
```

**Structure des dossiers :**

```
otaku-events-cameroun/
  ├── Backend/
  │     ├── otaku_backend/     ← Config Django (settings, urls, wsgi...)
  │     ├── users/             ← App : gestion des utilisateurs
  │     ├── events/            ← App : gestion des événements
  │     ├── tickets/           ← App : billets & catégories
  │     ├── news/              ← App : actualités Otaku
  │     ├── venv/              ← Environnement virtuel Python
  │     ├── manage.py
  │     └── requirements.txt
  └── Frontend/                ← Projet React (configuration à venir)
```

---

## ✅ Ce qui est accompli <a name="accompli"></a>

### Environnement & configuration

- ✅ Environnement virtuel Python créé et activé (`venv`)
- ✅ Dépendances installées : `django`, `djangorestframework`, `simplejwt`, `mysqlclient`, `django-cors-headers`
- ✅ Projet Django initialisé : `otaku_backend`
- ✅ Base de données `otaku_kamer_db` créée dans phpMyAdmin
- ✅ `settings.py` configuré : `DATABASES`, `INSTALLED_APPS`, `MIDDLEWARE`, `CORS_ALLOWED_ORIGINS`
- ✅ `requirements.txt` généré

### Applications Django

| App | Statut | Description |
|---|---|---|
| `users` | ✅ Créée & migrée | Gestion des utilisateurs (modèle custom) |
| `events` | ✅ Créée & migrée | Gestion des événements |
| `tickets` | ✅ Créée & migrée | Billets et catégories de billets |
| `news` | ✅ Créée & migrée | Actualités de la culture Otaku |

### Modèles de données

Tous les modèles ont été définis et leurs migrations ont été appliquées avec succès.

#### `Utilisateur` (users)

Étend `AbstractUser` de Django. Champs supplémentaires :

- `dateNaiss` — DateField (optionnel)
- `photoProfil` — ImageField (`upload_to='profile_pics/'`)
- `role` — CharField avec choix : `membre` | `organisateur` | `admin`

#### `Evenement` (events)

- `organisateur` — ForeignKey → Utilisateur
- `titre`, `description`, `typeEven`, `ville`, `lieu`
- `datePublication` (auto), `dateLancement`, `prix`
- `image` — ImageField (optionnel)
- `statut` — `en_preparation` | `annule` | `en_cours` | `termine`

#### `CategorieBillet` (tickets)

- `evenement` — ForeignKey → Evenement
- `nom`, `prix` — DecimalField
- `nombreTotale`, `nombreRestant` — PositiveIntegerField

#### `Billet` (tickets)

- `categorie` — ForeignKey → CategorieBillet
- `acheteur` — ForeignKey → Utilisateur
- `prix`, `dateAchat` (auto), `qrcode` (unique)
- `statut` — `valide` | `annule` | `utilise`

> ⚠️ **Bug à corriger** : le `__str__` de `Billet` retourne `self.nom` qui n'existe pas sur ce modèle. À remplacer par `self.qrcode` ou `f'{self.acheteur} - {self.categorie}'`.

#### `News` (news)

- `auteur` — ForeignKey → Utilisateur
- `titre`, `description` — TextField
- `datePublication` (auto), `dateMiseAJour` (auto)
- `image` — ImageField (optionnel)
- `statut` — `publie` | `brouillon`
- `typeNews` — `gaming` | `anime` | `BD` | `culture`

### Migrations

Toutes les migrations ont été générées (`makemigrations`) et appliquées (`migrate`) avec succès. Tables visibles dans phpMyAdmin :

- **Tables Django** : `auth_group`, `auth_permission`, `django_migrations`, `django_session`, `django_content_type`, `django_admin_log`
- **Tables projet** : `users_utilisateur`, `events_evenement`, `tickets_categoriebillet`, `tickets_billet`, `news_news`

---

## 🚀 Prochaines étapes <a name="prochaines-étapes"></a>

- [ ] **Corriger le `__str__` de `Billet`** — remplacer `self.nom` par une valeur valide
- [ ] **Serializers** — créer les serializers DRF pour chaque modèle (conversion Python ↔ JSON)
- [ ] **Vues & URLs** — créer les ViewSets et configurer le routeur DRF
- [ ] **Authentification JWT** — configurer les endpoints login / refresh / register
- [ ] **Admin Django** — enregistrer les modèles dans `admin.py`
- [ ] **Tests API** — tester les endpoints avec Postman ou Thunder Client
- [ ] **Frontend React** — initialiser le projet avec Vite + Tailwind CSS

---

## 🔑 Commandes de référence <a name="commandes"></a>

```bash
# Activer l'environnement virtuel (Windows)
venv\Scripts\activate

# Démarrer le serveur Django
python manage.py runserver

# Créer une migration après modification d'un modèle
python manage.py makemigrations
python manage.py migrate

# Créer un superutilisateur (accès à l'admin Django)
python manage.py createsuperuser
```

---

*Documentation rédigée dans le cadre du projet OtakuKamer — Février 2026*
