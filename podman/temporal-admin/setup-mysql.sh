#!/bin/sh
# Aligned with temporalio/samples-server compose/scripts/setup-mysql.sh
# and docker-builds auto-setup.sh MySQL path.
set -eu

: "${MYSQL_SEEDS:?MYSQL_SEEDS is required}"
: "${MYSQL_USER:?MYSQL_USER is required}"

# Prefer MYSQL_PWD (server/compose convention); fall back to SQL_PASSWORD.
MYSQL_PWD="${MYSQL_PWD:-${SQL_PASSWORD:-}}"
: "${MYSQL_PWD:?MYSQL_PWD or SQL_PASSWORD is required}"
export SQL_PASSWORD="${MYSQL_PWD}"

DB_PORT="${DB_PORT:-3306}"
DBNAME="${DBNAME:-temporal}"
VISIBILITY_DBNAME="${VISIBILITY_DBNAME:-temporal_visibility}"
# temporal-db already creates empty databases; skip create by default.
SKIP_DB_CREATE="${SKIP_DB_CREATE:-true}"

echo "Starting MySQL schema setup..."
echo "Waiting for MySQL at ${MYSQL_SEEDS}:${DB_PORT}..."
i=1
while ! nc -z -w 2 "${MYSQL_SEEDS}" "${DB_PORT}"; do
    if [ "$i" -ge 60 ]; then
        echo "MySQL did not become ready in time" >&2
        exit 1
    fi
    i=$((i + 1))
    sleep 1
done
echo "MySQL is available"

sql_tool() {
    temporal-sql-tool \
        --plugin mysql8 \
        --ep "${MYSQL_SEEDS}" \
        -u "${MYSQL_USER}" \
        -p "${DB_PORT}" \
        "$@"
}

if [ "${SKIP_DB_CREATE}" != "true" ]; then
    sql_tool --db "${DBNAME}" create
fi
sql_tool --db "${DBNAME}" setup-schema -v 0.0
sql_tool --db "${DBNAME}" update-schema -d /etc/temporal/schema/mysql/v8/temporal/versioned

if [ "${SKIP_DB_CREATE}" != "true" ]; then
    sql_tool --db "${VISIBILITY_DBNAME}" create
fi
sql_tool --db "${VISIBILITY_DBNAME}" setup-schema -v 0.0
sql_tool --db "${VISIBILITY_DBNAME}" update-schema -d /etc/temporal/schema/mysql/v8/visibility/versioned

echo "MySQL schema setup complete"
