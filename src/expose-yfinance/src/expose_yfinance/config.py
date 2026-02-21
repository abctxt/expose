from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    bind_host: str = os.getenv("YF_BIND_HOST", "0.0.0.0")
    grpc_port: int = int(os.getenv("YF_GRPC_PORT", "50061"))
    http_port: int = int(os.getenv("YF_HTTP_PORT", "8091"))
    poll_interval_ms: int = int(os.getenv("YF_POLL_INTERVAL_MS", "2000"))
    default_symbols: tuple[str, ...] = tuple(
        s.strip().upper()
        for s in os.getenv("YF_DEFAULT_SYMBOLS", "AAPL,MSFT,^SPX,^NDX,BTC-USD,ETH-USD,SOL-USD").split(",")
        if s.strip()
    )
