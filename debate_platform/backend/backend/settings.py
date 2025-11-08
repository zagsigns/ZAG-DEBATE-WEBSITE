import os
from pathlib import Path
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
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
    'rest_framework',
    'djoser',
    'rest_framework_simplejwt',
    'corsheaders',
    'channels',

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

# The URL configuration lives in the inner 'backend' directory
ROOT_URLCONF = 'backend.urls'

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
                # FIX 1: Corrected path for messages context processor
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# FIX 2: Corrected the project name from 'zag_debate_platform' to 'backend'
WSGI_APPLICATION = 'backend.wsgi.application'

# --- Database (using default SQLite for initial setup) ---
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# --- Password Validation ---
AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
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
CORS_ALLOW_ALL_ORIGINS = True # Allow all origins during development

# --- Channels/WebSockets Configuration (Real-Time Setup) ---
# FIX 3: Corrected the project name from 'zag_debate_platform' to 'backend'
ASGI_APPLICATION = 'backend.asgi.application'

# Channel Layer Configuration: Using Redis for the channel layer
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.pubsub.RedisChannelLayer',
        'CONFIG': {
            # Use a dummy in-memory configuration if Redis is not locally installed for development
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