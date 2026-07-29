#!/bin/bash
set -e

export MYSQL_UNIX_PORT=/var/run/mysql/mysql.sock

shutdown() {
    mysqladmin shutdown
    exit 0
}

trap shutdown SIGTERM SIGINT

escape_sql() {
    printf '%s' "$1" | sed "s/'/''/g"
}

wait_for_server() {
    local i
    for i in $(seq 1 60); do
        if mysqladmin ping --silent 2>/dev/null; then
            return 0
        fi
        sleep 1
    done
    echo "MySQL did not become ready in time" >&2
    return 1
}

init_db() {
    : "${MYSQL_PASSWORD:?MYSQL_PASSWORD is required for first-time init}"
    : "${MYSQL_ROOT_PASSWORD:?MYSQL_ROOT_PASSWORD is required for first-time init}"

    local db_name="${MYSQL_DATABASE:-temporal}"
    local visibility_db_name="${MYSQL_VISIBILITY_DATABASE:-temporal_visibility}"
    local db_user="${MYSQL_USER:-temporal}"
    local db_password
    local root_password
    root_password="$(escape_sql "$MYSQL_ROOT_PASSWORD")"
    db_password="$(escape_sql "$MYSQL_PASSWORD")"

    # Already running as mysql (Containerfile USER); omit --user to avoid chown on bind mounts.
    mysqld --initialize-insecure

    mysqld --skip-networking &
    local pid=$!
    wait_for_server

    mysql -uroot <<SQL
ALTER USER 'root'@'localhost' IDENTIFIED BY '${root_password}';
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY '${root_password}';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
CREATE DATABASE IF NOT EXISTS \`${db_name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
CREATE DATABASE IF NOT EXISTS \`${visibility_db_name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
CREATE USER IF NOT EXISTS '${db_user}'@'%' IDENTIFIED BY '${db_password}';
GRANT ALL PRIVILEGES ON \`${db_name}\`.* TO '${db_user}'@'%';
GRANT ALL PRIVILEGES ON \`${visibility_db_name}\`.* TO '${db_user}'@'%';
FLUSH PRIVILEGES;
SQL

    mysqladmin -uroot -p"${MYSQL_ROOT_PASSWORD}" shutdown
    wait "$pid" || true
}

if [ ! -d "/var/lib/mysql/mysql" ]; then
    init_db
fi

exec mysqld --console
