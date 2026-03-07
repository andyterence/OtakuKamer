from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Utilisateur

# Serializer pour le modèle Utilisateur, qui convertit les instances du modèle en formats JSON et vice versa.
class UtilisateurSerializer(serializers.ModelSerializer):
    # La classe Meta est utilisée pour spécifier les informations de configuration du serializer, comme le modèle associé et les champs à inclure dans la sérialisation.    
    class Meta:
        # Indique à Django REST Framework que ce serializer est associé au modèle Utilisateur
        model = Utilisateur
        # expose tous les champs fields = ['id', 'nom', 'email', 'motDePasse', 'dateInscription', 'statut']
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'dateNaiss', 'photoProfil', 'role']
        # extra_kwargs est utilisé pour spécifier des arguments supplémentaires pour les champs du serializer. Ici, on indique que le champ 'username' n'est pas requis lors de la création d'un utilisateur, car dans notre modèle, le champ USERNAME_FIELD est défini sur 'email', et nous allons automatiquement définir 'username' à partir de l'email lors de la création d'un utilisateur.
        extra_kwargs = {
        'username': {'required': False}
        }
        
    # La methode create est utilisée pour créer une nouvelle instance du modèle Utilisateur à partir des données validées. Elle prend les données validées, définit le champ 'username' à partir de l'email (car dans notre modèle, le champ USERNAME_FIELD est défini sur 'email'), puis utilise la méthode create_user pour créer un nouvel utilisateur avec les données fournies. Enfin, elle retourne l'utilisateur créé.   
    def create(self, validated_data):
            validated_data['username'] = validated_data['email']
            user = Utilisateur.objects.create_user(**validated_data)
            return user    
        
class MonTokenSerializer(TokenObtainPairSerializer):
    username_field = 'email'