# Temporal Admin CLI Cheat Sheet

The `temporal-admin` service is an optional interactive shell (`temporalio/admin-tools`) with `TEMPORAL_ADDRESS` already set. There is no login user/password — shell in and use the `temporal` CLI.

Start it (with Temporal core):

```bash
./start.sh temporal-admin
# or
./start.sh temporal-dev   # core + UI + admin
```

UI (easier for day-to-day browsing): http://localhost:8080

## Attach / exec

```bash
# interactive shell in the running admin container
podman exec -it expose_temporal-admin_1 sh

# attach only if the container's main process is already an interactive shell
podman attach expose_temporal-admin_1
```

Prefer `exec -it … sh`. The default admin container command is effectively idle (`sleep`); `attach` alone usually has nothing useful to talk to.

## Cluster

```bash
temporal operator cluster health
```

## Namespaces

```bash
temporal operator namespace list
temporal operator namespace describe -n expose
```

Default local namespace is `expose` (see `EXPOSE_TEMPORAL_NAMESPACE`).

## Workflows

```bash
temporal workflow list -n expose

temporal workflow describe -n expose -w <workflow-id>
temporal workflow show -n expose -w <workflow-id>

# optional ops
temporal workflow signal -n expose -w <workflow-id> --name <signal-name>
temporal workflow cancel -n expose -w <workflow-id>
temporal workflow terminate -n expose -w <workflow-id>
```

## Search attributes

```bash
temporal operator search-attribute list -n expose
```

## Notes

- gRPC frontend from the host (override): `localhost:7234` → container `7233`
- Inside the compose network, clients use `temporal:7233`
- For scripting from the host without exec, install the Temporal CLI locally and point `--address localhost:7234`
