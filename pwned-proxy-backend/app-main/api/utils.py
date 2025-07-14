# api/utils.py
from django.core.cache import cache
from .models import HIBPKey


def get_hibp_key() -> str:
    """
    Return the single HIBP API key stored in the DB.

    * The result is cached for one hour to avoid a query on every request.
    * Raises RuntimeError if no key has been configured yet.
    """
    cache_key = "hibp_api_key"
    key = cache.get(cache_key)
    if key:
        return key

    try:
        key = HIBPKey.objects.only("api_key").get().api_key
    except HIBPKey.DoesNotExist:  # pragma: no cover
        raise RuntimeError("HIBP API key is missing – add it via the admin first.")

    cache.set(cache_key, key, 60 * 60)  # 1 hour
    return key
