from django.test import SimpleTestCase
from django.urls import reverse, resolve

from api import views

class URLPatternsTest(SimpleTestCase):
    def test_all_endpoints_resolve(self):
        tests = [
            ("breached-domain", {"domain": "dtu.dk"}, views.BreachedDomainProxyView),
            ("breached-account", {"account": "user@dtu.dk"}, views.BreachedAccountProxyView),
            ("paste-account", {"account": "user@dtu.dk"}, views.PasteAccountProxyView),
            ("subscribed-domains", {}, views.SubscribedDomainsProxyView),
            ("stealer-logs-by-email", {"email": "user@dtu.dk"}, views.StealerLogsByEmailProxyView),
            ("stealer-logs-by-website", {"domain": "dtu.dk"}, views.StealerLogsByWebsiteDomainProxyView),
            ("stealer-logs-by-email-domain", {"domain": "dtu.dk"}, views.StealerLogsByEmailDomainProxyView),
            ("breaches", {}, views.AllBreachesProxyView),
            ("single-breach", {"name": "Example"}, views.SingleBreachProxyView),
            ("latest-breach", {}, views.LatestBreachProxyView),
            ("data-classes", {}, views.DataClassesProxyView),
            ("subscription-status", {}, views.SubscriptionStatusProxyView),
            ("group-names", {}, views.GroupNamesView),
        ]
        for name, kwargs, view in tests:
            with self.subTest(name=name):
                url = reverse(name, kwargs=kwargs)
                resolver = resolve(url)
                print(f"Resolved {name} -> {url} -> {resolver.func.view_class.__name__}")
                self.assertEqual(resolver.func.view_class, view)
