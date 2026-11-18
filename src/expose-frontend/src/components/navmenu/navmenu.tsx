import type {TargetedMouseEvent} from "preact"
import {useEffect, useRef} from "preact/hooks"
import {useLocation} from "preact-iso"
import styl from "./navmenu.module.styl"
import FlexSpacer from "@fwk/flex"
import {useTranslation} from "@fwk/i18n"
import {useAppSelector} from "@fwk/hooks"
import {Route, isSetupPath} from "@comp/router/router.redux"
import {Button} from "@ui5/webcomponents-react"

const leftPages = [Route.Dashboard, Route.Portfolio, Route.Watchlist, Route.Notifications, Route.News, Route.EtfHoldings, Route.SetupAppearance] as const
const topPages = [Route.Search, Route.AiChat, Route.Network, Route.About] as const

const wheelThreshold = 10
const wheelCooldownMs = 36

const wheelPixels = (event: WheelEvent) => {
    const dominant = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX
    if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        return dominant * 16
    }
    if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        return dominant * window.innerHeight
    }
    return dominant
}

type NavButtonProps = {
    icon: string
    text: string
    route: Route
}

const NavButton = ({icon, text, route: path}: NavButtonProps) => {
    const {route, url} = useLocation()
    const selected = path === Route.SetupAppearance ? isSetupPath(url) : url === path
    const className = selected ? `${styl.button} ${styl.active}` : styl.button
    return <Button
        design="Transparent"
        className={className}
        icon={icon}
        onClick={() => route(path)}>
        <span>{text}</span>
    </Button>
}


const barOf = (event: WheelEvent): readonly Route[] | null => {
    for (const node of event.composedPath()) {
        if (!(node instanceof HTMLElement)) {
            continue
        }
        if (node.dataset.navmenu != null) {
            return leftPages
        }
        if (node.dataset.topbar != null) {
            return topPages
        }
    }
    return null
}

const NavWheelGesture = () => {
    const {route, path} = useLocation()
    const scrollMenus = useAppSelector(state => state.setup.scrollMenus)
    const pathRef = useRef(path)
    const routeRef = useRef(route)
    const enabledRef = useRef(scrollMenus)
    pathRef.current = path
    routeRef.current = route
    enabledRef.current = scrollMenus

    useEffect(() => {
        let accumulated = 0
        let lockedUntil = 0
        const onWheel = (event: WheelEvent) => {
            if (!enabledRef.current) {
                return
            }
            const pages = barOf(event)
            if (!pages) {
                return
            }
            event.preventDefault()
            const delta = wheelPixels(event)
            if (accumulated !== 0 && Math.sign(delta) !== Math.sign(accumulated)) {
                accumulated = 0
            }
            accumulated += delta
            const now = performance.now()
            if (now < lockedUntil || Math.abs(accumulated) < wheelThreshold) {
                return
            }
            const direction = accumulated > 0 ? 1 : -1
            const current = isSetupPath(pathRef.current) ? Route.SetupAppearance : pathRef.current
            const index = pages.findIndex(page => page === current)
            const next = index + direction
            if (index < 0 || next < 0 || next >= pages.length) {
                accumulated = 0
                return
            }
            accumulated -= direction * wheelThreshold
            accumulated = Math.max(-wheelThreshold, Math.min(wheelThreshold, accumulated))
            lockedUntil = now + wheelCooldownMs
            routeRef.current(pages[next])
        }
        document.addEventListener("wheel", onWheel, {capture: true, passive: false})
        return () => document.removeEventListener("wheel", onWheel, {capture: true})
    }, [])

    return null
}

const NavMenu = ({onContextMenu}: {onContextMenu: (event: TargetedMouseEvent<HTMLElement>) => void}) => {
    const { t } = useTranslation()

    return (
        <nav className={styl.navmenu} data-navmenu onContextMenuCapture={onContextMenu}>
            <NavButton icon="tnt/technicalinstance" text={t("navmenu", "menu_dashboard")} route={Route.Dashboard}/>
            <NavButton icon="wallet" text={t("navmenu", "menu_portfolio")} route={Route.Portfolio}/>
            <NavButton icon="show" text={t("navmenu", "menu_watchlist")} route={Route.Watchlist}/>
            <NavButton icon="bell" text={t("navmenu", "menu_notifications")} route={Route.Notifications}/>
            <NavButton icon="newspaper" text={t("navmenu", "menu_news")} route={Route.News}/>
            <NavButton icon="document-text" text={t("navmenu", "menu_etf_holdings")} route={Route.EtfHoldings}/>
            <FlexSpacer/>
            <NavButton icon="action-settings" text={t("navmenu", "menu_setup")} route={Route.SetupAppearance}/>
        </nav>
    )
}

export default NavMenu
export {NavWheelGesture}
