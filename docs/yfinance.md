## YFinance Live Data Service

`Expose` includes a dedicated Python microservice (`src/expose-yfinance`) for live quote retrieval via `yfinance`.
The backend consumes quotes via server-streaming gRPC and exposes cached snapshots under `/market/quotes`.

Quick start:

- `cd src/expose-yfinance`
- `python -m pip install -e ".[dev]"`
- `python -m expose_yfinance.main`

Service environment variables:

- `YF_BIND_HOST` (default: `0.0.0.0`)
- `YF_GRPC_PORT` (default: `50061`)
- `YF_HTTP_PORT` (default: `8091`)
- `YF_POLL_INTERVAL_MS` (default: `2000`)
- `YF_DEFAULT_SYMBOLS` (default: `AAPL,MSFT,^SPX,^NDX,BTC-USD,ETH-USD,SOL-USD`)
