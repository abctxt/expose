#!/bin/bash
set -e

export MYSQL_UNIX_PORT=/var/run/mysql/mariadb.sock

shutdown() {
    mariadb-admin shutdown
    exit 0
}

trap shutdown SIGTERM SIGINT

if [ ! -d "/var/lib/mysql/mysql" ]; then
    mariadb-install-db --user=mysql
fi

exec mariadbd --user=mysql --console
