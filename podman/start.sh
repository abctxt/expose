#!/bin/sh
set -eu

cd "$(dirname "$0")"

COMPOSE_PROJECT="${COMPOSE_PROJECT:-expose}"
COMPOSE="podman-compose -p ${COMPOSE_PROJECT} -f compose.yml -f compose.override.yml"

usage() {
    cat <<'EOF'
Usage: ./start.sh <command> [args...]

Commands:
  all                 Start default stack (no optional profiles)
  app                 Start frontend, backend, yfinance, ai, mariadb, temporal core
  mariadb             Start MariaDB only
  temporal            Start Temporal core (db, db-schema, server, namespace)
  temporal-ui         Start Temporal UI (profile temporal-ui; pulls in Temporal core)
  temporal-admin      Start Temporal admin tools (profile temporal-admin)
  temporal-dev        Start Temporal core + UI + admin
  ollama              Start Ollama (profile ollama-cpu)
  down                Stop and remove project containers
  ps                  Show project container status
  logs [service...]   Follow logs (all services if none given)
  help                Show this help

Examples:
  ./start.sh temporal-dev
  ./start.sh mariadb
  ./start.sh logs temporal
EOF
}

compose() {
    # shellcheck disable=SC2086
    ${COMPOSE} "$@"
}

up() {
    compose up --build -d "$@"
}

up_with_profiles() {
    profiles=""
    while [ "$#" -gt 0 ]; do
        case "$1" in
            --)
                shift
                break
                ;;
            *)
                profiles="${profiles} --profile $1"
                shift
                ;;
        esac
    done
    # shellcheck disable=SC2086
    ${COMPOSE} ${profiles} up --build -d "$@"
}

cmd_all() {
    up
}

cmd_app() {
    up frontend backend yfinance ai mariadb \
        temporal-db temporal-db-schema temporal temporal-namespace
}

cmd_mariadb() {
    up mariadb
}

cmd_temporal() {
    up temporal-db temporal-db-schema temporal temporal-namespace
}

cmd_temporal_ui() {
    up_with_profiles temporal-ui -- \
        temporal-db temporal-db-schema temporal temporal-namespace temporal-ui
}

cmd_temporal_admin() {
    up_with_profiles temporal-admin -- \
        temporal-db temporal-db-schema temporal temporal-namespace temporal-admin
}

cmd_temporal_dev() {
    up_with_profiles temporal-ui temporal-admin -- \
        temporal-db temporal-db-schema temporal temporal-namespace \
        temporal-ui temporal-admin
}

cmd_ollama() {
    up_with_profiles ollama-cpu -- ollama
}

cmd_down() {
    compose --profile temporal-ui --profile temporal-admin --profile ollama-cpu down
}

cmd_ps() {
    compose ps
}

cmd_logs() {
    compose logs -f "$@"
}

cmd="${1:-help}"
[ "$#" -gt 0 ] && shift

case "${cmd}" in
    all)            cmd_all "$@" ;;
    app)            cmd_app "$@" ;;
    mariadb)        cmd_mariadb "$@" ;;
    temporal)       cmd_temporal "$@" ;;
    temporal-ui)    cmd_temporal_ui "$@" ;;
    temporal-admin) cmd_temporal_admin "$@" ;;
    temporal-dev)   cmd_temporal_dev "$@" ;;
    ollama)         cmd_ollama "$@" ;;
    down)           cmd_down "$@" ;;
    ps)             cmd_ps "$@" ;;
    logs)           cmd_logs "$@" ;;
    help|-h|--help) usage ;;
    *)
        echo "Unknown command: ${cmd}" >&2
        usage >&2
        exit 1
        ;;
esac
