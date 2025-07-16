from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.contrib.auth.models import Group
from api.models import HIBPKey, APIKey, Domain
from api.admin import SEED_DATA
import os
import json


class Command(BaseCommand):
    help = "Perform initial setup using HIBP_API_KEY if provided."

    def handle(self, *args, **options):
        hibp_key_env = os.getenv("HIBP_API_KEY")
        created = False
        hibp_obj = HIBPKey.objects.first()

        if hibp_key_env:
            if hibp_obj:
                if hibp_obj.api_key != hibp_key_env:
                    hibp_obj.api_key = hibp_key_env
                    if not hibp_obj.description:
                        hibp_obj.description = "Updated key from .env"
                    hibp_obj.save()
                    self.stdout.write(self.style.SUCCESS("Updated HIBP API key."))
                else:
                    self.stdout.write("HIBP API key already configured and up to date.")
            else:
                HIBPKey.objects.create(
                    api_key=hibp_key_env, description="Initial key from .env"
                )
                self.stdout.write(self.style.SUCCESS("Added HIBP API key."))
                created = True

            if created:
                # Import domains only when a new key was added
                call_command("import_domain_data")
        else:
            self.stdout.write(
                self.style.WARNING("HIBP_API_KEY not set; skipping domain import.")
            )

        # Seed groups if they haven't been created yet
        seed_group_names = [item["group"] for item in SEED_DATA]
        existing = APIKey.objects.filter(group__name__in=seed_group_names)
        if existing.exists():
            self.stdout.write("Group API keys already exist; skipping seeding.")
        else:
            APIKey.objects.filter(group__name__in=seed_group_names).delete()

            results = []
            for item in SEED_DATA:
                group_name = item["group"]
                base_domain = item["domain"]
                group, _ = Group.objects.get_or_create(name=group_name)
                api_key_obj, raw_key = APIKey.create_api_key(group=group)
                matching = Domain.objects.filter(name__endswith=base_domain)
                api_key_obj.domains.add(*matching)
                results.append({"group": group_name, "api_key": raw_key})

            for res in results:
                self.stdout.write(f"{res['group']}: {res['api_key']}")

        # Also print admin credentials from env if available
        admin_user = os.getenv("DJANGO_SUPERUSER_USERNAME", "admin")
        admin_pass = os.getenv("DJANGO_SUPERUSER_PASSWORD", "")
        self.stdout.write(f"Admin user: {admin_user}")
        if admin_pass:
            self.stdout.write(f"Admin password: {admin_pass}")
