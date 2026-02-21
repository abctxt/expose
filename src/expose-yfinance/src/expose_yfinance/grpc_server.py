from __future__ import annotations

import asyncio
import logging
from typing import Any

import grpc

from .config import Settings
from .models import QuoteData
from .proto_codegen import load_modules

pb2, pb2_grpc = load_modules()


class YFinanceService(pb2_grpc.YFinanceMarketDataServicer):
    def __init__(self, provider: Any, settings: Settings):
        self._provider = provider
        self._settings = settings
        self._log = logging.getLogger(__name__)
        self._latest: dict[str, pb2.QuoteSnapshot] = {}

    async def GetLatestQuote(self, request, context):
        symbol = request.symbol.strip().upper()
        if not symbol:
            await context.abort(grpc.StatusCode.INVALID_ARGUMENT, "symbol is required")
        quote = await self._provider.fetch_quote(symbol)
        if quote is None:
            await context.abort(grpc.StatusCode.NOT_FOUND, f"no quote found for symbol {symbol}")
        snapshot = self._to_proto(quote, self._next_sequence(symbol))
        self._latest[symbol] = snapshot
        return snapshot

    async def SubscribeQuotes(self, request, context):
        symbols = [s.strip().upper() for s in request.symbols if s.strip()]
        if not symbols:
            symbols = list(self._settings.default_symbols)
        if not symbols:
            await context.abort(grpc.StatusCode.INVALID_ARGUMENT, "at least one symbol is required")

        poll_interval_ms = request.poll_interval_ms if request.poll_interval_ms > 0 else self._settings.poll_interval_ms
        include_heartbeat = bool(request.include_heartbeat)

        while not context.cancelled():
            for symbol in symbols:
                try:
                    quote = await self._provider.fetch_quote(symbol)
                    if quote is None:
                        continue
                    snapshot = self._to_proto(quote, self._next_sequence(symbol))
                    previous = self._latest.get(symbol)
                    changed = previous is None or self._has_changed(previous, snapshot)
                    self._latest[symbol] = snapshot
                    if changed or include_heartbeat:
                        await context.write(snapshot)
                except asyncio.CancelledError:
                    raise
                except Exception:
                    self._log.exception("Failed to fetch or stream quote for %s", symbol)
            await asyncio.sleep(poll_interval_ms / 1000)

    @staticmethod
    def _has_changed(previous, current) -> bool:
        return (
            previous.price != current.price
            or previous.currency != current.currency
            or previous.exchange != current.exchange
            or previous.is_market_open != current.is_market_open
        )

    def _next_sequence(self, symbol: str) -> int:
        existing = self._latest.get(symbol)
        return 1 if existing is None else existing.sequence + 1

    @staticmethod
    def _to_proto(quote: QuoteData, sequence: int):
        return pb2.QuoteSnapshot(
            symbol=quote.symbol,
            price=quote.price,
            currency=quote.currency,
            exchange=quote.exchange,
            timestamp_unix_ms=quote.timestamp_unix_ms,
            source=quote.source,
            sequence=sequence,
            is_market_open=quote.is_market_open,
        )


async def run_grpc_server(provider: Any, settings: Settings) -> grpc.aio.Server:
    server = grpc.aio.server()
    pb2_grpc.add_YFinanceMarketDataServicer_to_server(YFinanceService(provider, settings), server)
    server.add_insecure_port(f"{settings.bind_host}:{settings.grpc_port}")
    await server.start()
    return server
