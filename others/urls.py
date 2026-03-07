"""
URL configuration for otaku_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

# Importation de la fonction path pour définir les routes de l'API RESTful.
from django.contrib import admin
# Importation de la fonction include pour inclure les routes définies dans les applications de l'API RESTful.
from django.urls import path, include
# Importation des vues associées à chaque application, qui contiennent la logique pour gérer les requêtes HTTP liées aux événements, nouvelles, billets et utilisateurs.
from rest_framework import routers
from events.views import EvenementViewSet
from news.views import NewsViewSet
from tickets.views import BilletViewSet, CategorieViewSet
from users.views import UtilisateurViewSet
from django.conf import settings
from django.conf.urls.static import static
from users.serializers import MonTokenSerializer
# Fournir des vues pour l'authentification JWT, permettant aux utilisateurs d'obtenir et de rafraîchir leurs tokens d'accès.
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Création d'un routeur pour gérer les routes de l'API RESTful, en enregistrant les vues associées à chaque application.
router = routers.DefaultRouter()
router.register(r'evenements', EvenementViewSet)
router.register(r'news', NewsViewSet)
router.register(r'billet', BilletViewSet)
router.register(r'utilisateurs', UtilisateurViewSet)

class MonTokenView(TokenObtainPairView):
    serializer_class = MonTokenSerializer

# Définition des routes de l'API RESTful, en incluant les routes définies dans les applications et la route pour l'administration de Django.
urlpatterns = [
    path('admin/', admin.site.urls),
    # Inclure les routes définies dans les applications de l'API RESTful, en utilisant le routeur pour gérer les routes associées à chaque application.
    path('api/', include(router.urls)),
    # React envoie email + password, reçoit les deux tokens
    path('api/token/', MonTokenView.as_view(), name='token_obtain_pair'),
    # React envoie le refresh token, reçoit un nouveau access token
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
