from .settings import *
from termcolor import colored
import getpass
from django.conf import settings
from django.conf.urls.static import static

DEBUG = True

if DEBUG:
    current_user = getpass.getuser()  # Get the current user's login name
    print(colored(f'WARNING: DEBUG IS ENABLED, NEVER RUN IN PRODUCTION! Running as {current_user}', 'magenta'))