#!/bin/sh

echo "Starting build"

DO_NOT_EDIT_LINE="# DO NOT EDIT BELOW THIS LINE. IT IS CREATED BY 'build.sh'"

# Variables for Local env
PROJECT_LOCATION=$(pwd -P)
MONGOD_CONF_LOCATION=$(pwd -P)/mongod.conf
DOTENV_CONFIG_PATH_FOR_API=.env

SPA_PORT=3000
API_PORT=8000

# Development build
if [ "$1" = "dev" ]
then
    # Local env
    if [ -e .env.development.local ]
    then
        sed -i "/$DO_NOT_EDIT_LINE/Q" .env.development.local
    else
        touch .env.development.local
        if [ -e .env.development.local.example ]
        then
            cat .env.development.local.example >> .env.development.local
        fi
    fi

    cat >> .env.development.local << EOF
$DO_NOT_EDIT_LINE
PROJECT_LOCATION=$PROJECT_LOCATION
MONGOD_CONF_LOCATION=$MONGOD_CONF_LOCATION
DOTENV_CONFIG_PATH_FOR_API=$DOTENV_CONFIG_PATH_FOR_API
SPA_PORT=$SPA_PORT
API_PORT=$API_PORT
EOF

    # Env for Development
    # These URLs should NOT have trailing slashes
    REACT_APP_API_DATA_LOCATION=http://localhost:8000/api/entry
    REACT_APP_API_SCHEMA_LOCATION=http://localhost:8000/api/schema
    REACT_APP_API_UI_SCHEMA_LOCATION=http://localhost:8000/api/uischema
    REACT_APP_API_LOGIN_LOCATION=http://localhost:8000/login

    if [ -e .env.development ]
    then
        sed -i "/$DO_NOT_EDIT_LINE/Q" .env.development
    else
        touch .env.development
        if [ -e .env.development.example ]
        then
            cat .env.development.example >> .env.development
        fi
    fi

    cat >> .env.development << EOF
$DO_NOT_EDIT_LINE
REACT_APP_API_DATA_LOCATION=$REACT_APP_API_DATA_LOCATION
REACT_APP_API_SCHEMA_LOCATION=$REACT_APP_API_SCHEMA_LOCATION
REACT_APP_API_UI_SCHEMA_LOCATION=$REACT_APP_API_UI_SCHEMA_LOCATION
REACT_APP_API_LOGIN_LOCATION=$REACT_APP_API_LOGIN_LOCATION
EOF

else
# Production build
# Local env
    if [ -e .env.production.local ]
    then
        sed -i "/$DO_NOT_EDIT_LINE/Q" .env.production.local
    else
        touch .env.production.local
        if [ -e .env.production.local.example ]
        then
            cat .env.production.local.example >> .env.production.local
        fi
    fi

    cat >> .env.production.local << EOF
$DO_NOT_EDIT_LINE
PROJECT_LOCATION=$PROJECT_LOCATION
MONGOD_CONF_LOCATION=$MONGOD_CONF_LOCATION
DOTENV_CONFIG_PATH_FOR_API=$DOTENV_CONFIG_PATH_FOR_API
SPA_PORT=$SPA_PORT
API_PORT=$API_PORT
EOF

    # Env for Production
    # These URLs should NOT have trailing slashes
    REACT_APP_API_DATA_LOCATION=http://api.mappingviolence.org/api/entry
    REACT_APP_API_SCHEMA_LOCATION=http://api.mappingviolence.org/api/schema
    REACT_APP_API_UI_SCHEMA_LOCATION=http://api.mappingviolence.org/api/uischema
    REACT_APP_API_LOGIN_LOCATION=http://api.mappingviolence.org/login

    if [ -e .env.production ]
    then
        sed -i "/$DO_NOT_EDIT_LINE/Q" .env.production
    else
        touch .env.production
        if [ -e .env.production.example ]
        then
            cat .env.production.example >> .env.production
        fi
    fi

    cat >> .env.production << EOF
$DO_NOT_EDIT_LINE
REACT_APP_API_DATA_LOCATION=$REACT_APP_API_DATA_LOCATION
REACT_APP_API_SCHEMA_LOCATION=$REACT_APP_API_SCHEMA_LOCATION
REACT_APP_API_UI_SCHEMA_LOCATION=$REACT_APP_API_UI_SCHEMA_LOCATION
REACT_APP_API_LOGIN_LOCATION=$REACT_APP_API_LOGIN_LOCATION
EOF
fi

if [ -e .env ]
then
    sed -i "/$DO_NOT_EDIT_LINE/Q" .env
else
    touch .env
    if [ -e .env.example ]
    then
        cat .env.example >> .env
    fi
fi

if [ "$1" = "dev" ]
then
    echo $DO_NOT_EDIT_LINE >> .env
    cat .env.development .env.development.local | sed -e "s/$DO_NOT_EDIT_LINE//g" | sed -e "/^$/d" >> .env
else
    echo $DO_NOT_EDIT_LINE >> .env
    cat .env.production .env.production.local | sed -e "s/$DO_NOT_EDIT_LINE//g" | sed -e "/^$/d" >> .env
fi

echo "Build ended"
