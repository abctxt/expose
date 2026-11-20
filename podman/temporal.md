# Temporal Container Stack

Self-hosted Temporal setup for Workflow Automation.

## Layout

| Path | Role |
|------|------|
| `temporal/` | Server image (`temporalio/server`) + dynamic config |
| `temporal-db/` | Custom AlmaLinux MySQL 8.4 (history + visibility databases) |
| `temporal-admin/` | Admin-tools image + `setup-mysql.sh` / `setup-namespace.sh` |
| `temporal-ui/` | UI image (`temporalio/ui`) |

## Services (`compose.yml`)

| Service | Purpose |
|---------|---------|
| `temporal-db` | Dedicated MySQL 8.4 persistence |
| `temporal-db-schema` | One-shot `temporal-sql-tool` schema setup/update |
| `temporal` | Server only; waits for the schema job to succeed |
| `temporal-namespace` | One-shot job; creates namespace `expose` (72h retention) |
| `temporal-ui` | Profile `temporal-ui`: optional UI (`http://localhost:8234`) |
| `temporal-admin` | Profile `temporal-admin`: interactive CLI |

Startup order: `temporal-db` healthy → schema job completes → server healthy →
namespace job completes → Expose `backend` starts.

## Start

From the `podman` directory (requires `compose.override.yml` with the MySQL passwords):

```bash
./start.sh temporal          # core only
./start.sh temporal-dev      # core + UI + admin
./start.sh temporal-ui       # core + UI
./start.sh app               # full app stack including Temporal core
```

## Configuration

Set via shell env or `compose.override.yml` (see `~compose.override.yml`):

- `EXPOSE_TEMPORAL_ADDRESS` (default `temporal:7233`)
- `EXPOSE_TEMPORAL_NAMESPACE` (default `expose`)
- `EXPOSE_TEMPORAL_NAMESPACE_RETENTION` (default `72h`)
- `EXPOSE_TEMPORAL_DB_NAME` / `EXPOSE_TEMPORAL_VISIBILITY_DB_NAME`
- `EXPOSE_TEMPORAL_MYSQL_USER`
- `EXPOSE_TEMPORAL_MYSQL_PASSWORD` (**required**, no compose default)
- `EXPOSE_TEMPORAL_MYSQL_ROOT_PASSWORD` (**required**, no compose default)
- `EXPOSE_TEMPORAL_UI_PORT` (default `8234`; `8233` is taken by the local dev server)
- `EXPOSE_TEMPORAL_UI_CORS_ORIGINS`

Use deployment secrets for the MySQL passwords outside local development.

MariaDB cannot back Temporal 1.32 visibility (MySQL JSON generated columns), so
Temporal uses this dedicated MySQL service instead of the Expose MariaDB.

## Verify

```bash
./start.sh temporal-admin
podman exec -it expose_temporal-admin_1 sh
# inside the container:
temporal operator cluster health
temporal operator namespace describe -n expose
```

See [temporal-admin.md](temporal-admin.md) for a short CLI cheat sheet.
