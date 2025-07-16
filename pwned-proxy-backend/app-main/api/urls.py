# api/urls.py
from django.urls import path

from .views import (
    # Core proxies
    BreachedDomainProxyView,
    BreachedAccountProxyView,
    # Extended HIBP v3
    PasteAccountProxyView,
    SubscribedDomainsProxyView,
    StealerLogsByEmailProxyView,
    StealerLogsByWebsiteDomainProxyView,
    StealerLogsByEmailDomainProxyView,
    AllBreachesProxyView,
    SingleBreachProxyView,
    LatestBreachProxyView,
    DataClassesProxyView,
    SubscriptionStatusProxyView,
    GroupNamesView,
)

urlpatterns = [
    # Core
    path(
        "breacheddomain/<str:domain>",
        BreachedDomainProxyView.as_view(),
        name="breached-domain",
    ),
    path(
        "breachedaccount/<path:account>",
        BreachedAccountProxyView.as_view(),
        name="breached-account",
    ),
    # Extended
    path("pasteaccount/<path:account>", PasteAccountProxyView.as_view(), name="paste-account"),
    path(
        "subscribeddomains",
        SubscribedDomainsProxyView.as_view(),
        name="subscribed-domains",
    ),
    path(
        "stealerlogsbyemail/<path:email>",
        StealerLogsByEmailProxyView.as_view(),
        name="stealer-logs-by-email",
    ),
    path(
        "stealerlogsbywebsitedomain/<str:domain>",
        StealerLogsByWebsiteDomainProxyView.as_view(),
        name="stealer-logs-by-website",
    ),
    path(
        "stealerlogsbyemaildomain/<str:domain>",
        StealerLogsByEmailDomainProxyView.as_view(),
        name="stealer-logs-by-email-domain",
    ),
    path("breaches", AllBreachesProxyView.as_view(), name="breaches"),
    path("breach/<str:name>", SingleBreachProxyView.as_view(), name="single-breach"),
    path("latestbreach", LatestBreachProxyView.as_view(), name="latest-breach"),
    path("dataclasses", DataClassesProxyView.as_view(), name="data-classes"),
    path(
        "subscription/status",
        SubscriptionStatusProxyView.as_view(),
        name="subscription-status",
    ),
    path("group-names", GroupNamesView.as_view(), name="group-names"),
]
