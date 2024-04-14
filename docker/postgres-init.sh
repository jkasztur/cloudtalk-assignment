#!/bin/sh
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE test;
    ALTER DATABASE test OWNER TO postgres;
    GRANT ALL PRIVILEGES ON DATABASE test TO postgres;
EOSQL
