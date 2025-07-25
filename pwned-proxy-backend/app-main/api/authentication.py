# api/authentication.py

import os
import jwt
from jwt import PyJWKClient

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from .models import APIKey, hash_api_key

User = get_user_model()


class APIKeyAuthentication(BaseAuthentication):
    """
    Looks for 'X-API-Key' or 'hibp-api-key' in headers,
    matches it directly against stored API keys.
    """

    def authenticate(self, request):
        raw_key = request.headers.get('X-API-Key') or request.headers.get('hibp-api-key')
        if not raw_key:
            return None  # No API key => DRF tries next auth class

        hashed = hash_api_key(raw_key)
        try:
            api_key = APIKey.objects.get(key=hashed)
        except APIKey.DoesNotExist:
            raise AuthenticationFailed("Invalid API Key")

        # Return an AnonymousUser plus the APIKey instance
        return (AnonymousUser(), api_key)


# class AzureAdJWTAuthentication(BaseAuthentication):
#     """
#     Validates 'Authorization: Bearer <token>' from Azure AD.
    
#     Must set these env variables or read from Django settings:
#       - PUBLIC_AZURE_AD_TENANT_ID
#       - AZURE_APP_AIT_SOC_GRAPH_VICRE_REGISTRATION_CLIENT_ID  (the *API* app’s client ID)
#     """

#     def authenticate(self, request):
#         auth_header = request.headers.get('Authorization')
#         if not auth_header:
#             return None  # No auth => next authentication

#         parts = auth_header.split()
#         if len(parts) != 2 or parts[0].lower() != 'bearer':
#             return None  # Not "Bearer ..." => next auth

#         token = parts[1]

#         tenant_id = os.environ.get("PUBLIC_AZURE_AD_TENANT_ID", "")
#         audience = os.environ.get("AZURE_APP_AIT_SOC_GRAPH_VICRE_REGISTRATION_CLIENT_ID", "")

#         if not tenant_id or not audience:
#             raise AuthenticationFailed("Missing Azure AD tenant_id or client_id in environment variables.")

#         # JWKS URL for your tenant
#         jwks_url = f"https://login.microsoftonline.com/{tenant_id}/discovery/v2.0/keys"
#         jwks_client = PyJWKClient(jwks_url)

#         try:
#             signing_key = jwks_client.get_signing_key_from_jwt(token)
#             decoded = jwt.decode(
#                 token,
#                 signing_key.key,
#                 algorithms=["RS256"],
#                 audience=audience,
#                 issuer=f"https://sts.windows.net/{tenant_id}/"
#             )
#         except Exception as exc:
#             raise AuthenticationFailed(f"Token validation error: {str(exc)}")

#         # Extract user principal name/email
#         user_email = decoded.get("upn") or decoded.get("email") or decoded.get("preferred_username")
#         if not user_email:
#             raise AuthenticationFailed("No identifiable email/UPN in token claims.")

#         # Create or fetch local user
#         user, _ = User.objects.get_or_create(
#             username=user_email, 
#             defaults={"email": user_email}
#         )

#         return (user, decoded)
