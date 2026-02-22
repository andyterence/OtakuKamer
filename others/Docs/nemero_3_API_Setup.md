# OtakuKamer — Mise en place de l'API REST

> Troisieme partie de la documentation technique du projet  
> Couvre : Serializers · Views · URLs · Test de l'API

---

## 📋 Table des matières

1. [Rappel de l'architecture](#architecture)
2. [Les Serializers](#serializers)
3. [Les Views (ViewSets)](#views)
4. [Les URLs & le Routeur](#urls)
5. [Test de l'API](#test)
6. [Prochaines étapes](#prochaines-étapes)

---

## 🏗️ Rappel de l'architecture <a name="architecture"></a>

Chaque requête HTTP de React suit ce chemin dans Django :

```
React (port 3000)
      ↓  requête HTTP
  urls.py (routeur)
      ↓  redirige vers
  views.py (ViewSet)
      ↓  utilise
  serializers.py (conversion Python ↔ JSON)
      ↓  lit/écrit
  models.py (base de données)
```

---

## 🔄 Les Serializers <a name="serializers"></a>

### Rôle

Un serializer est le **traducteur** entre les objets Python de Django et le JSON compris par React. Il fonctionne dans les deux sens :

- **Lecture** — convertit un objet Python → JSON pour répondre à React
- **Écriture** — valide et convertit le JSON envoyé par React → objet Python à sauvegarder

### Structure de base

```python
from rest_framework import serializers
from .models import MonModele

class MonModeleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonModele
        fields = '__all__'  # ou liste explicite : ['id', 'titre', ...]
```

### Serializers créés

| App | Classe | Champs |
|---|---|---|
| `events` | `EvenementSerializer` | Tous (`__all__`) |
| `news` | `NewsSerializer` | Tous (`__all__`) |
| `tickets` | `BilletSerializer` | Tous (`__all__`) |
| `tickets` | `CategorieBilletSerializer` | Tous (`__all__`) |
| `users` | `UtilisateurSerializer` | Liste explicite (sans `password`) |

### Cas particulier — `UtilisateurSerializer`

Le champ `password` est exclu pour des raisons de sécurité. On liste les champs manuellement :

```python
fields = ['id', 'username', 'email', 'first_name', 'last_name', 'dateNaiss', 'photoProfil', 'role']
```

> 💡 Avec `fields = '__all__'`, le hash du mot de passe serait exposé dans les réponses API — ce qui est un problème de sécurité majeur.

---

## 👁️ Les Views (ViewSets) <a name="views"></a>

### Rôle

Un ViewSet regroupe automatiquement toutes les opérations CRUD en une seule classe grâce à `ModelViewSet`.

### Les 5 opérations automatiques

| Action | Méthode HTTP | URL générée | Description |
|---|---|---|---|
| `list` | GET | `/api/evenements/` | Retourne tous les objets |
| `retrieve` | GET | `/api/evenements/1/` | Retourne un objet par ID |
| `create` | POST | `/api/evenements/` | Crée un nouvel objet |
| `update` | PUT | `/api/evenements/1/` | Modifie un objet |
| `destroy` | DELETE | `/api/evenements/1/` | Supprime un objet |

### Structure de base

```python
from rest_framework import viewsets
from .models import MonModele
from .serializers import MonModeleSerializer

class MonModeleViewSet(viewsets.ModelViewSet):
    queryset = MonModele.objects.all()
    serializer_class = MonModeleSerializer
```

- `queryset` — définit quels objets seront retournés
- `serializer_class` — indique quel serializer utiliser

### ViewSets créés

| App | Fichier | Classe |
|---|---|---|
| `events` | `events/views.py` | `EvenementViewSet` |
| `news` | `news/views.py` | `NewsViewSet` |
| `tickets` | `tickets/views.py` | `BilletViewSet` |
| `tickets` | `tickets/views.py` | `CategorieViewSet` |
| `users` | `users/views.py` | `UtilisateurViewSet` |

---

## 🔗 Les URLs & le Routeur <a name="urls"></a>

### Rôle

Le routeur génère automatiquement toutes les URLs à partir des ViewSets enregistrés. On utilise un **routeur central** dans `otaku_backend/urls.py` plutôt que des fichiers `urls.py` par app.

> 💡 Avoir plusieurs `path('api/', include(...))` avec le même préfixe fait que Django ne garde que le dernier. D'où l'importance d'un routeur central unique.

### Configuration finale — `otaku_backend/urls.py`

```python
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from events.views import EvenementViewSet
from news.views import NewsViewSet
from tickets.views import BilletViewSet, CategorieViewSet
from users.views import UtilisateurViewSet

router = routers.DefaultRouter()
router.register(r'evenements', EvenementViewSet)
router.register(r'news', NewsViewSet)
router.register(r'billet', BilletViewSet)
router.register(r'categorie', CategorieViewSet)
router.register(r'utilisateurs', UtilisateurViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
```

### Endpoints disponibles

| Endpoint | Description |
|---|---|
| `GET /api/` | Interface navigable DRF — liste tous les endpoints |
| `GET/POST /api/evenements/` | Liste ou crée un événement |
| `GET/PUT/DELETE /api/evenements/{id}/` | Détail, modification ou suppression |
| `GET/POST /api/news/` | Liste ou crée une news |
| `GET/POST /api/billet/` | Liste ou crée un billet |
| `GET/POST /api/categorie/` | Liste ou crée une catégorie de billet |
| `GET/POST /api/utilisateurs/` | Liste ou crée un utilisateur |

---

## ✅ Test de l'API <a name="test"></a>

### Lancer le serveur

```bash
# Activer le venv (Windows)
venv\Scripts\activate

# Lancer le serveur
python manage.py runserver
```

### Résultat attendu sur `http://127.0.0.1:8000/api/`

L'interface navigable de Django REST Framework affiche tous les endpoints enregistrés — confirme que le routeur fonctionne correctement.

> ⚠️ Le `404` sur `http://127.0.0.1:8000/` est **normal** — aucune route n'est définie pour `/`, l'API commence à `/api/`.

---

## 🚀 Prochaines étapes <a name="prochaines-étapes"></a>

- [ ] Créer un superutilisateur : `python manage.py createsuperuser`
- [ ] Configurer l'authentification JWT (login, refresh, register)
- [ ] Protéger les endpoints sensibles avec des permissions
- [ ] Enregistrer les modèles dans `admin.py` de chaque app
- [ ] Tester les endpoints avec Postman ou Thunder Client
- [ ] Initialiser le Frontend React avec Vite + Tailwind CSS

---

*Documentation rédigée dans le cadre du projet OtakuKamer — Février 2026*
