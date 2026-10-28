import type {TargetedMouseEvent} from "preact"
import {useEffect, useRef} from "preact/hooks"
import {useLocation} from "preact-iso"
import styl from "./navmenu.module.styl"
import FlexSpacer from "@fwk/flex"
import {useTranslation} from "@fwk/i18n"
import {useAppSelector} from "@fwk/hooks"
import {Route} from "@comp/router/router.redux"
import {Button} from "@ui5/webcomponents-react"

const leftPages = [Route.Dashboard, Route.EtfHoldings, Route.Setup] as const
const topPages = [Route.Network, Route.About] as const

const wheelThreshold = 40
const wheelCooldownMs = 380

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
    const className = url === path ? `${styl.button} ${styl.active}` : styl.button
    return <Button
        design="Transparent"
        className={className}
        icon={icon}
        onClick={() => route(path)}>
        <span>{text}</span>
    </Button>
}


const barOf = (event: WheelEvent) => {
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
            const now = performance.now()
            if (now < lockedUntil) {
                accumulated = 0
                return
            }
            accumulated += wheelPixels(event)
            if (Math.abs(accumulated) < wheelThreshold) {
                return
            }
            const direction = accumulated > 0 ? 1 : -1
            accumulated = 0
            const index = pages.indexOf(pathRef.current as typeof pages[number])
            const next = index + direction
            if (index < 0 || next < 0 || next >= pages.length) {
                return
            }
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
            <NavButton icon="document-text" text={t("navmenu", "menu_etf_holdings")} route={Route.EtfHoldings}/>
            <FlexSpacer/>
            <NavButton icon="action-settings" text={t("navmenu", "menu_setup")} route={Route.Setup}/>
        </nav>
    )
}

export default NavMenu
export {NavWheelGesture}
