#!/bin/bash
set -e

export MYSQL_UNIX_PORT=/var/run/mysql/mariadb.sock

shutdown() {
    mariadb-admin shutdown
    exit 0
}

trap shutdown SIGTERM SIGINT

escape_sql() {
    printf '%s' "$1" | sed "s/'/''/g"
}

wait_for_server() {
    local i
    for i in $(seq 1 60); do
        if mariadb-admin ping --silent 2>/dev/null; then
            return 0
        fi
        sleep 1
    done
    echo "MariaDB did not become ready in time" >&2
    return 1
}

init_db() {
    : "${MARIADB_PASSWORD:?MARIADB_PASSWORD is required for first-time init}"
    : "${MARIADB_ROOT_PASSWORD:?MARIADB_ROOT_PASSWORD is required for first-time init}"

    local db_name="${MARIADB_DATABASE:-expose}"
    local db_user="${MARIADB_USER:-expose}"
    local db_password
    local root_password
    root_password="$(escape_sql "$MARIADB_ROOT_PASSWORD")"
    db_password="$(escape_sql "$MARIADB_PASSWORD")"

    # Already running as mysql (Containerfile USER); omit --user to avoid chown on bind mounts.
    mariadb-install-db \
        --skip-test-db \
        --auth-root-authentication-method=normal

    mariadbd --skip-networking &
    local pid=$!
    wait_for_server

    mariadb -uroot <<SQL
ALTER USER 'root'@'localhost' IDENTIFIED BY '${root_password}';
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY '${root_password}';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
CREATE DATABASE IF NOT EXISTS \`${db_name}\`;
CREATE USER IF NOT EXISTS '${db_user}'@'%' IDENTIFIED BY '${db_password}';
GRANT ALL PRIVILEGES ON \`${db_name}\`.* TO '${db_user}'@'%';
FLUSH PRIVILEGES;
SQL

    mariadb-admin -uroot -p"${MARIADB_ROOT_PASSWORD}" shutdown
    wait "$pid" || true
}

if [ ! -d "/var/lib/mysql/mysql" ]; then
    init_db
fi

exec mariadbd --console
