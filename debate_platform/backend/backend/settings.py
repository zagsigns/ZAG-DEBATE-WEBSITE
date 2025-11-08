import os
from pathlib import Path
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

SECRET_KEY = 'django-insecure-your-secret-key-goes-here' # !!! REPLACE ME IN PRODUCTION !!!

DEBUG = True

ALLOWED_HOSTS = ['*'] # Allow all hosts for development/Canvas environment

# Application definition
INSTALLED_APPS = [
    # 1. Django Defaults
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # 2. Third-Party Apps (Required for Project)
    'rest_framework',           # DRF for API endpoints
    'djoser',                   # Optional: If you use Djoser for auth setup
    'rest_framework_simplejwt', # JWT Token Auth
    'corsheaders',              # For React frontend communication
    'channels',                 # Real-time WebSocket support

    # 3. Project Apps
    'accounts',
    'debates',
    'payments',
]

# --- Middleware, URLs, and Templates (Standard) ---
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware', # CORS middleware must be high up
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'zag_debate_platform.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'zag_debate_platform.wsgi.application'

# --- Database (PostgreSQL recommended, using default SQLite for initial setup) ---
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# --- Password Validation ---
AUTH_PASSWORD_VALIDATORS = [
    # Standard validators...
]

# --- Internationalization ---
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# --- Static files (CSS, JavaScript, Images) ---
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- Custom User Model Configuration ---
AUTH_USER_MODEL = 'accounts.User'

# --- Django REST Framework (DRF) Configuration ---
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    )
}

# --- CORS Configuration (Essential for Frontend/Backend communication) ---
# Allows the React development server (e.g., http://localhost:3000 or http://127.0.0.1:5173) to communicate
CORS_ALLOW_ALL_ORIGINS = True # Allow all origins during development

# --- Channels/WebSockets Configuration (Real-Time Setup) ---
ASGI_APPLICATION = 'zag_debate_platform.asgi.application'

# Channel Layer Configuration: Using Redis for the channel layer
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.pubsub.RedisChannelLayer',
        'CONFIG': {
            # Use a dummy in-memory configuration if Redis is not locally installed for development
            # In a real setup, this would be: "hosts": [('127.0.0.1', 6379)],
            "hosts": [os.environ.get('REDIS_URL', 'redis://localhost:6379/')],
        },
    },
}

# --- Simple JWT Configuration ---
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60), # Access tokens valid for 1 hour
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),    # Refresh tokens valid for 1 day
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id', # Standard claim name
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}