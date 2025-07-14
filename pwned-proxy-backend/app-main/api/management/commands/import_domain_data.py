# file: api/management/commands/import_domain_data.py

import json
import urllib.request
import urllib.error
from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime

from api.models import Domain, HIBPKey

API_URL = "https://haveibeenpwned.com/api/v3/subscribeddomains"

class Command(BaseCommand):
    help = "Import or update domain records from the HIBP API, removing any not returned."

    def handle(self, *args, **options):
        # 1) Fetch the latest stored API key
        hibp_key = HIBPKey.objects.order_by('-created_at').first()
        if not hibp_key:
            self.stderr.write(
                self.style.ERROR("No HIBPKey found in the database. Please add one in the admin.")
            )
            return

        # 2) Make a request to the HIBP API
        try:
            req = urllib.request.Request(
                API_URL,
                headers={
                    "hibp-api-key": hibp_key.api_key,
                }
            )
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode("utf-8"))
        except urllib.error.URLError as e:
            self.stderr.write(self.style.ERROR(f"Error fetching domains from the HIBP API: {e}"))
            return

        # 3) Build a set of domain names from the response (for deletion of old ones)
        returned_domain_names = set()

        # 4) Create or update each domain in the DB
        for domain_data in data:
            domain_name = domain_data["DomainName"]
            pwn_count = domain_data["PwnCount"]
            pwn_excl = domain_data["PwnCountExcludingSpamLists"]
            pwn_renewal = domain_data["PwnCountExcludingSpamListsAtLastSubscriptionRenewal"]
            renewal_str = domain_data["NextSubscriptionRenewal"]

            # Parse datetime if present
            next_renewal = parse_datetime(renewal_str) if renewal_str else None

            returned_domain_names.add(domain_name)

            obj, created = Domain.objects.update_or_create(
                name=domain_name,
                defaults={
                    "pwn_count": pwn_count,
                    "pwn_count_excluding_spam_lists": pwn_excl,
                    "pwn_count_excluding_spam_lists_at_last_subscription_renewal": pwn_renewal,
                    "next_subscription_renewal": next_renewal,
                },
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created domain: {domain_name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Updated domain: {domain_name}"))

        # 5) Remove any domains not in the API response
        deleted_count, _ = Domain.objects.exclude(name__in=returned_domain_names).delete()
        if deleted_count > 0:
            self.stdout.write(self.style.WARNING(f"Deleted {deleted_count} old domains."))

        self.stdout.write(self.style.SUCCESS("Finished importing domain data from HIBP."))
