import uuid
from django.db import models
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError

# Default length of generated API keys
DEFAULT_API_KEY_LENGTH = len(uuid.uuid4().hex)


def generate_api_key():
    """
    Returns a new, random UUID4 hex string.
    """
    return uuid.uuid4().hex


class Domain(models.Model):
    """
    A simple model for storing domain names.
    For example:
       name = "dtu.dk"
    """
    name = models.CharField(max_length=255, unique=True)

    pwn_count = models.IntegerField(null=True, blank=True)
    pwn_count_excluding_spam_lists = models.IntegerField(null=True, blank=True)
    pwn_count_excluding_spam_lists_at_last_subscription_renewal = models.IntegerField(null=True, blank=True)
    next_subscription_renewal = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name


class APIKey(models.Model):
    """
    Each API key:
      - Belongs to one Django Group.
      - Stores the raw key directly in the DB.
      - Can be associated with multiple domains via 'domains'.

    Example usage in the shell:
      group = Group.objects.get(name='IT Department')
      domains = [Domain.objects.get_or_create(name='dtu.dk')[0],
                 Domain.objects.get_or_create(name='cert.dk')[0]]

      api_key_obj, raw_key = APIKey.create_api_key(
          group=group,
          domain_list=domains
      )
    """
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name='api_keys'
    )
    # Instead of a single "allowed_domain" CharField, now we allow many:
    domains = models.ManyToManyField(Domain, blank=True)

    key = models.CharField(max_length=64, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Show partial hash and how many domains
        domain_count = self.domains.count()
        return f"APIKey {self.key[:8]}... ({domain_count} domains)"


    def save(self, *args, **kwargs):
        """
        Automatically generate a random key if none is provided.
        """
        if not self.key:
            self.key = generate_api_key()
        self.full_clean()
        super().save(*args, **kwargs)

    def clean(self):
        if self.key and len(self.key) < DEFAULT_API_KEY_LENGTH:
            raise ValidationError(
                f"API key must be at least {DEFAULT_API_KEY_LENGTH} characters long."
            )

    @classmethod
    def create_api_key(cls, group: Group, domain_list=None):
        """
        Create an APIKey instance by:
          1) Generating a random raw key
          2) Creating the APIKey object
          4) Linking the specified 'domain_list' (list of Domain objs)
          5) Returning (api_key_obj, raw_key)

        :param group: The Django Group that will own this key.
        :param domain_list: A list of Domain model instances (optional).
        :returns: (APIKey object, raw_key string)
        """
        if domain_list is None:
            domain_list = []

        # 1) Generate random raw key (UUID4 hex)
        raw_key = generate_api_key()

        # 2) Create the APIKey record storing the raw key
        new_key = cls.objects.create(
            group=group,
            key=raw_key
        )

        # 4) Link M2M domains, if provided
        if domain_list:
            new_key.domains.set(domain_list)  # can be a list of Domain objects

        return new_key, raw_key



# file: api/models.py

from django.db import models
from django.core.exceptions import ValidationError
from django.core.cache import cache

class HIBPKey(models.Model):
    """
    Model that allows only ONE record.
    """
    api_key = models.CharField(max_length=255, unique=True)
    description = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Optional label or notes for this key."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.description or f"HIBP Key: {self.api_key[:6]}..."

    def clean(self):
        """
        Check if we're trying to create more than one HIBPKey record.
        """
        # If self.pk is None, it means we're creating a new record.
        # If HIBPKey.objects.exists() is True, it means at least one record
        # already exists. So we raise an error to block the save.
        if not self.pk and HIBPKey.objects.exists():
            raise ValidationError("Only one HIBPKey entry is allowed.")
        if self.api_key and len(self.api_key) < DEFAULT_API_KEY_LENGTH:
            raise ValidationError(
                f"HIBP API key must be at least {DEFAULT_API_KEY_LENGTH} characters long."
            )

    def save(self, *args, **kwargs):
        """
        Call self.clean() before actually saving.
        """
        self.full_clean()
        super().save(*args, **kwargs)
        cache.delete("hibp_api_key")

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        cache.delete("hibp_api_key")


class EndpointLog(models.Model):
    """Record which API key accessed which endpoint and whether it succeeded."""

    api_key = models.ForeignKey(
        APIKey,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="endpoint_logs",
    )
    group = models.ForeignKey(
        Group,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="endpoint_logs",
    )
    endpoint = models.CharField(max_length=255)
    status_code = models.IntegerField()
    success = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.group}: {self.endpoint} -> {self.status_code}"
