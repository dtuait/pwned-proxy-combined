# file: api/admin.py

from django.contrib import admin, messages
from django.core.management import call_command
from django.shortcuts import redirect, get_object_or_404
from django.urls import path
from django.utils.html import format_html

from .models import APIKey, Domain, generate_api_key, EndpointLog

@admin.register(APIKey)
class APIKeyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'group', 'domain_list', 'key', 'created_at')
    search_fields = ('name', 'description', 'key')
    readonly_fields = ('created_at',)
    filter_horizontal = ('domains',)
    actions = ['rotate_api_keys']

    # Custom template to add "Rotate" button on change page
    change_form_template = "admin/api/apikey/change_form.html"

    def domain_list(self, obj):
        return ", ".join(d.name for d in obj.domains.all())
    domain_list.short_description = "Domains"

    def save_model(self, request, obj, form, change):
        if not change and not obj.key:
            obj.key = generate_api_key()
            super().save_model(request, obj, form, change)
            self.message_user(request, f"Your new API key: {obj.key}", level=messages.SUCCESS)
        else:
            super().save_model(request, obj, form, change)

    def rotate_api_keys(self, request, queryset):
        """Admin action to rotate one or more API keys."""
        messages_list = []
        for api_key in queryset:
            raw_key = generate_api_key()
            api_key.key = raw_key
            api_key.save()
            messages_list.append(f"{api_key.group or api_key.id}: {raw_key}")

        if messages_list:
            self.message_user(request, "Rotated keys:", level=messages.SUCCESS)
            for item in messages_list:
                self.message_user(request, item, level=messages.SUCCESS)

        else:
            self.message_user(request, "No keys rotated.", level=messages.WARNING)

    rotate_api_keys.short_description = "Rotate selected API keys"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "<int:pk>/rotate/",
                self.admin_site.admin_view(self.rotate_single_api_key),
                name="api_apikey_rotate",
            ),
        ]
        return custom_urls + urls

    def rotate_single_api_key(self, request, pk):
        api_key = get_object_or_404(APIKey, pk=pk)
        raw_key = generate_api_key()
        api_key.key = raw_key
        api_key.save()
        self.message_user(request, f"API key rotated. New key: {raw_key}", level=messages.SUCCESS)
        return redirect("../")


@admin.register(Domain)
class DomainAdmin(admin.ModelAdmin):
    """
    This admin removes all add/change/delete permissions,
    leaving only the listing and the "Import from HIBP" action.
    """

    list_display = ('name', 'pwn_count', 'pwn_count_excluding_spam_lists')
    search_fields = ('name',)

    # 1) Use the custom template with the "Import from HIBP" button
    change_list_template = "admin/api/domain/change_list.html"

    # 2) Expose a custom URL for the import process
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "import-hibp/",
                self.admin_site.admin_view(self.import_from_hibp),
                name="api_domain_import_hibp"
            ),
        ]
        return custom_urls + urls

    # 3) The actual “import from HIBP” view
    def import_from_hibp(self, request):
        """
        Calls the custom management command that fetches and
        updates domains from the HIBP API, then redirects back
        to the domain list.
        """
        call_command("import_domain_data")
        self.message_user(request, "Domains imported from HIBP!")
        return redirect("..")

    # ------------------------------
    # Disable add, change, delete:
    # ------------------------------

    def has_view_permission(self, request, obj=None):
        # Allow viewing the changelist page
        return True

    def has_add_permission(self, request):
        # Disable "Add" button/link
        return False

    def has_change_permission(self, request, obj=None):
        # Disable changing/editing
        return False

    def has_delete_permission(self, request, obj=None):
        # Disable deletes
        return True



# file: api/admin.py

from django.contrib import admin, messages
from django.core.management import call_command
from django.shortcuts import redirect
from django.urls import path

from .models import APIKey, Domain, generate_api_key, HIBPKey

@admin.register(HIBPKey)
class HIBPKeyAdmin(admin.ModelAdmin):
    """
    Allows admin users to add/remove HIBP API keys.
    """
    list_display = ('__str__', 'api_key', 'created_at')
    search_fields = ('api_key', 'description')


@admin.register(EndpointLog)
class EndpointLogAdmin(admin.ModelAdmin):
    list_display = ('created_at', 'group', 'endpoint', 'status_code', 'success')
    list_filter = ('group', 'endpoint', 'success')
    readonly_fields = ('api_key', 'group', 'endpoint', 'status_code', 'success', 'created_at')




from django.contrib import admin, messages
from django.contrib.auth.models import Group
from django.contrib.auth.admin import GroupAdmin

from django.urls import path
from django.shortcuts import redirect
from django.http import HttpResponse
import csv

from .models import APIKey, Domain, EndpointLog

# 1) Unregister the default Group admin
admin.site.unregister(Group)

SEED_DATA = [
  {"domain": "aau.dk", "group": "Aalborg Universitet"},
  {"domain": "ruc.dk", "group": "Roskilde Universitet"},
  {"domain": "ku.dk",  "group": "Københavns Universitet"},
  {"domain": "nbi.dk", "group": "Niels Bohr Institutet"},
  {"domain": "itu.dk", "group": "IT-Universitetet i København"},
  {"domain": "dtu.dk", "group": "Danmarks Tekniske Universitet"},
  {"domain": "deic.dk","group": "Danish e-Infrastructure Cooperation"},
  {"domain": "cert.dk","group": "Danish e-Infrastructure Cooperation"},
  {"domain": "cbs.dk", "group": "Copenhagen Business School"}
]

@admin.register(Group)
class CustomGroupAdmin(GroupAdmin):
    """
    Extends the default Django Group admin so we can add a
    “Seed Groups” button/link in the changelist page.
    """
    change_list_template = "admin/auth/group/change_list.html"

    def get_urls(self):
        """
        Append our custom "seed-groups/" URL to the default GroupAdmin URLs.
        """
        urls = super().get_urls()
        custom = [
            path('seed-groups/', self.admin_site.admin_view(self.seed_groups), name='seed_groups'),
            path('export-groups/', self.admin_site.admin_view(self.export_groups_keys), name='export_groups_keys'),
            path('import-groups/', self.admin_site.admin_view(self.import_groups_keys), name='import_groups_keys'),
        ]
        return custom + urls

    def seed_groups(self, request):
        """
        If request.GET.get('confirmed') != '1', do nothing and just return.
        Otherwise:
          1. Overwrite (delete) the existing APIKeys for all the groups in SEED_DATA
          2. Create new APIKeys
          3. For each group, find subdomains that end with the domain and associate them
          4. Return a JSON file with the group name, raw key, and associated domains
        """
        from django.contrib import messages
        from django.shortcuts import redirect
        confirmed = request.GET.get('confirmed')
        if confirmed != '1':
            messages.warning(request, "Seed groups canceled.")
            return redirect("..")

        # 1) Gather the group names from SEED_DATA
        seed_group_names = [item["group"] for item in SEED_DATA]

        # 2) Delete existing APIKeys for those groups
        APIKey.objects.filter(group__name__in=seed_group_names).delete()

        # 3) Create new APIKeys, gather info grouped per group
        from collections import defaultdict
        grouped = defaultdict(list)

        for item in SEED_DATA:
            group_name = item["group"]
            base_domain = item["domain"]

            group, _created = Group.objects.get_or_create(name=group_name)
            api_key_obj, raw_key = APIKey.create_api_key(
                group=group,
                name=f"Seed key for {group_name}",
                description="Initial seed key",
            )

            # find all matching domains
            matching_domains = Domain.objects.filter(name__endswith=base_domain)
            api_key_obj.domains.add(*matching_domains)

            # Build a list of domain names
            domain_names = [d.name for d in matching_domains]

            grouped[group_name].append({
                "raw_key": raw_key,
                "domains": domain_names,
            })

        result_list = [
            {"group_name": name, "api_keys": keys} for name, keys in grouped.items()
        ]

        # 4) Return a JSON response (as a downloadable file)
        import json
        from django.http import HttpResponse

        response = HttpResponse(
            json.dumps(result_list, indent=2),
            content_type='application/json'
        )
        response['Content-Disposition'] = 'attachment; filename="seeded_api_keys.json"'
        return response

    def export_groups_keys(self, request):
        """Return JSON describing all groups and their API keys."""
        import json
        from django.http import HttpResponse
        data = []
        for group in Group.objects.order_by('name'):
            key_list = []
            for api_key in group.api_keys.all():
                key_list.append({
                    "raw_key": api_key.key,
                    "domains": list(api_key.domains.values_list('name', flat=True)),
                })
            data.append({"group_name": group.name, "api_keys": key_list})

        response = HttpResponse(
            json.dumps(data, indent=2),
            content_type='application/json'
        )
        response['Content-Disposition'] = 'attachment; filename="exported_groups_api_keys.json"'
        return response

    def import_groups_keys(self, request):
        """Upload JSON produced by export_groups_keys and recreate keys."""
        from django import forms
        from django.template.response import TemplateResponse
        import json
        from django.contrib import messages
        from django.shortcuts import redirect

        class UploadForm(forms.Form):
            json_file = forms.FileField()

        if request.method == 'POST':
            form = UploadForm(request.POST, request.FILES)
            if form.is_valid():
                try:
                    data = json.load(form.cleaned_data['json_file'])
                except json.JSONDecodeError:
                    messages.error(request, 'Invalid JSON file.')
                    return redirect(request.path)

                for entry in data:
                    group, _ = Group.objects.get_or_create(name=entry.get('group_name'))
                    APIKey.objects.filter(group=group).delete()
                    for key in entry.get('api_keys', []):
                        domains = list(Domain.objects.filter(name__in=key.get('domains', []) ))
                        api_key = APIKey.objects.create(group=group, key=key.get('raw_key'))
                        if domains:
                            api_key.domains.set(domains)

                messages.success(request, 'Groups and API keys imported.')
                return redirect('..')
        else:
            form = UploadForm()

        context = dict(self.admin_site.each_context(request), form=form)
        return TemplateResponse(request, 'admin/auth/group/import_form.html', context)
