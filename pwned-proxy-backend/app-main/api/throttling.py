from rest_framework.throttling import SimpleRateThrottle

class APIKeyRateThrottle(SimpleRateThrottle):
    scope = 'apikey'

    def get_cache_key(self, request, view):
        api_key = request.headers.get('X-API-Key')
        if not api_key:
            return None
        return f"apikey_{api_key}"
