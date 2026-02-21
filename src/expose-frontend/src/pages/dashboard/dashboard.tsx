import Layout from "@comp/layout/layout"
import {useEffect, useMemo, useState} from "preact/hooks"
import styl from "./dashboard.module.styl"

interface Quote {
    symbol: string
    price: number
    currency: string
    exchange: string
    timestampUnixMs: number
    source: string
    sequence: number
    isMarketOpen: boolean
}

const kQuotesUrl = "http://localhost:5777/market/quotes"
const kRefreshIntervalMs = 2000
const kMinPriceDigits = 0
const kMaxPriceDigits = 6
type SortKey = "symbol" | "price" | "type" | "currency" | "exchange" | "isMarketOpen" | "timestampUnixMs"
type SortDirection = "asc" | "desc"
interface SortRule {
    key: SortKey
    direction: SortDirection
}

const Dashboard = () => {
    const [quotes, setQuotes] = useState<Quote[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [sortPrimary, setSortPrimary] = useState<SortRule>({key: "symbol", direction: "asc"})
    const [sortSecondary, setSortSecondary] = useState<SortRule | null>(null)
    const [priceDigits, setPriceDigits] = useState(2)

    const fetchQuotes = async () => {
        try {
            const response = await fetch(kQuotesUrl)
            if (!response.ok) {
                throw new Error(`Failed to fetch quotes (${response.status})`)
            }
            const data = await response.json() as Quote[]
            setQuotes(data)
            setError(null)
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown dashboard error"
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void fetchQuotes()
        const interval = window.setInterval(() => {
            void fetchQuotes()
        }, kRefreshIntervalMs)
        return () => window.clearInterval(interval)
    }, [])

    const toggleDirection = (direction: SortDirection): SortDirection =>
        direction === "asc" ? "desc" : "asc"

    const formatPrice = (price: number): string => {
        const digits = Math.min(kMaxPriceDigits, Math.max(kMinPriceDigits, priceDigits))
        const factor = 10 ** digits
        const truncated = Math.trunc(price * factor) / factor
        return truncated.toFixed(digits)
    }

    const getQuoteType = (quote: Quote): "Crypto" | "Index" | "Stock" => {
        const normalizedSymbol = quote.symbol.toUpperCase()
        if (normalizedSymbol === "^NDX" || normalizedSymbol.startsWith("^")) {
            return "Index"
        }
        if (quote.exchange.toUpperCase() === "CCC" || quote.symbol.endsWith("-USD")) {
            return "Crypto"
        }
        return "Stock"
    }

    const onSort = (key: SortKey, secondary = false) => {
        if (secondary) {
            if (sortPrimary.key === key) {
                return
            }
            if (sortSecondary?.key === key) {
                setSortSecondary({...sortSecondary, direction: toggleDirection(sortSecondary.direction)})
                return
            }
            setSortSecondary({key, direction: "asc"})
            return
        }

        if (sortPrimary.key === key) {
            setSortPrimary({...sortPrimary, direction: toggleDirection(sortPrimary.direction)})
            return
        }
        setSortPrimary({key, direction: "asc"})
        // keep deterministic ordering by clearing conflicting secondary
        if (sortSecondary?.key === key) {
            setSortSecondary(null)
        }
    }

    const sortIndicator = (key: SortKey, secondary = false) => {
        if (secondary) {
            if (sortSecondary?.key !== key) {
                return ""
            }
            return sortSecondary.direction === "asc" ? " ▵" : " ▿"
        }
        if (sortPrimary.key !== key) {
            return ""
        }
        return sortPrimary.direction === "asc" ? " ▲" : " ▼"
    }

    const sortedQuotes = useMemo(() => {
        const directionFactor = sortPrimary.direction === "asc" ? 1 : -1
        const secondaryFactor = sortSecondary?.direction === "asc" ? 1 : -1
        const list = [...quotes]

        const compareBy = (a: Quote, b: Quote, sortKey: SortKey): number => {
            switch (sortKey) {
                case "price":
                    return a.price - b.price
                case "currency":
                    return a.currency.localeCompare(b.currency)
                case "exchange":
                    return a.exchange.localeCompare(b.exchange)
                case "type":
                    return getQuoteType(a).localeCompare(getQuoteType(b))
                case "isMarketOpen":
                    return Number(a.isMarketOpen) - Number(b.isMarketOpen)
                case "timestampUnixMs":
                    return a.timestampUnixMs - b.timestampUnixMs
                case "symbol":
                default:
                    return a.symbol.localeCompare(b.symbol)
            }
        }

        list.sort((a, b) => {
            const primaryResult = compareBy(a, b, sortPrimary.key) * directionFactor
            if (primaryResult !== 0) {
                return primaryResult
            }
            if (sortSecondary) {
                const secondaryResult = compareBy(a, b, sortSecondary.key) * secondaryFactor
                if (secondaryResult !== 0) {
                    return secondaryResult
                }
            }
            return a.symbol.localeCompare(b.symbol)
        })
        return list
    }, [quotes, sortPrimary, sortSecondary])

    const formattedCurrentDate = useMemo(() => {
        const now = new Date()
        const weekday = new Intl.DateTimeFormat("en-US", {weekday: "short"}).format(now)
        const month = new Intl.DateTimeFormat("en-US", {month: "short"}).format(now)
        const day = new Intl.DateTimeFormat("en-US", {day: "numeric"}).format(now)
        const year = new Intl.DateTimeFormat("en-US", {year: "numeric"}).format(now)
        return `${weekday} ${month} ${day}, ${year}`
    }, [])

    return (
        <Layout>
            <section className={styl.dashboard}>
                <header className={styl.header}>
                    <h2>Market Quotes</h2>
                    <span className={styl.meta}>
                        Refresh: {kRefreshIntervalMs / 1000}s | Shift+Click header for secondary sort
                    </span>
                </header>

                {loading && <p className={styl.message}>Loading quotes...</p>}
                {error && <p className={styl.error}>Error: {error}</p>}

                {!loading && !error && (
                    <div className={styl.tableWrap}>
                        <table className={styl.table}>
                            <thead>
                                <tr>
                                    <th className={styl.sortHeader} onClick={e => onSort("symbol", e.shiftKey)}>Symbol{sortIndicator("symbol")}{sortIndicator("symbol", true)}</th>
                                    <th className={styl.sortHeader} onClick={e => onSort("price", e.shiftKey)}>Price{sortIndicator("price")}{sortIndicator("price", true)}</th>
                                    <th className={styl.sortHeader} onClick={e => onSort("type", e.shiftKey)}>Type{sortIndicator("type")}{sortIndicator("type", true)}</th>
                                    <th className={styl.sortHeader} onClick={e => onSort("currency", e.shiftKey)}>Currency{sortIndicator("currency")}{sortIndicator("currency", true)}</th>
                                    <th className={styl.sortHeader} onClick={e => onSort("exchange", e.shiftKey)}>Exchange{sortIndicator("exchange")}{sortIndicator("exchange", true)}</th>
                                    <th className={styl.sortHeader} onClick={e => onSort("isMarketOpen", e.shiftKey)}>Status{sortIndicator("isMarketOpen")}{sortIndicator("isMarketOpen", true)}</th>
                                    <th className={styl.sortHeader} onClick={e => onSort("timestampUnixMs", e.shiftKey)}>Updated{sortIndicator("timestampUnixMs")}{sortIndicator("timestampUnixMs", true)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedQuotes.map(quote => (
                                    <tr key={quote.symbol}>
                                        <td>{quote.symbol}</td>
                                        <td>{formatPrice(quote.price)}</td>
                                        <td>{getQuoteType(quote)}</td>
                                        <td>{quote.currency || "-"}</td>
                                        <td>{quote.exchange || "-"}</td>
                                        <td>{quote.isMarketOpen ? "Open" : "Closed"}</td>
                                        <td>{new Date(quote.timestampUnixMs).toLocaleTimeString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && !error && (
                    <div className={styl.controlsRow}>
                        <div className={styl.priceSettings}>
                            <label htmlFor="price-digits">Price digits after dot:</label>
                            <select
                                id="price-digits"
                                value={priceDigits}
                                onChange={e => setPriceDigits(Math.min(kMaxPriceDigits, Math.max(kMinPriceDigits, Number(e.currentTarget.value) || 0)))}
                            >
                                {Array.from({length: kMaxPriceDigits + 1}, (_, value) => (
                                    <option key={value} value={value}>{value}</option>
                                ))}
                            </select>
                        </div>
                        <span className={styl.currentDate}>{formattedCurrentDate}</span>
                    </div>
                )}
            </section>
        </Layout>
    )
}

export default Dashboard
