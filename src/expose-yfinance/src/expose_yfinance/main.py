from __future__ import annotations

import asyncio
import logging

from .config import Settings
from .grpc_server import run_grpc_server
from .yf_provider import YFinanceProvider

log = logging.getLogger(__name__)


async def _serve_http_health(settings: Settings) -> None:
    async def handler(reader: asyncio.StreamReader, writer: asyncio.StreamWriter) -> None:
        try:
            data = await reader.read(1024)
            if data.startswith(b"GET /health"):
                body = b'{"ok":true}'
                response = (
                    b"HTTP/1.1 200 OK\r\n"
                    b"Content-Type: application/json\r\n"
                    + f"Content-Length: {len(body)}\r\n".encode("utf-8")
                    + b"Connection: close\r\n\r\n"
                    + body
                )
            else:
                response = b"HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\nConnection: close\r\n\r\n"
            writer.write(response)
            await writer.drain()
        finally:
            writer.close()
            await writer.wait_closed()

    server = await asyncio.start_server(handler, host=settings.bind_host, port=settings.http_port)
    async with server:
        await server.serve_forever()


async def run() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
    settings = Settings()
    provider = YFinanceProvider()
    grpc_server = await run_grpc_server(provider, settings)
    log.info("yfinance gRPC server listening on %s:%s", settings.bind_host, settings.grpc_port)
    try:
        await _serve_http_health(settings)
    finally:
        await grpc_server.stop(grace=3)


if __name__ == "__main__":
    asyncio.run(run())
