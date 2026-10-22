import type {TargetedMouseEvent} from "preact"
import {useLocation} from "preact-iso"
import styl from "./header.module.styl"
import {useTranslation} from "@fwk/i18n"
import {Button} from "@ui5/webcomponents-react"
import {isAppRoute, Route} from "@comp/router/router.redux"

type TopButtonProps = {
    icon: string
    label: string
    route: Route
}

const TopButton = ({icon, label, route: path}: TopButtonProps) => {
    const {route, url} = useLocation()
    const className = url === path ? `${styl.button} ${styl.active}` : styl.button
    return <Button
        design="Transparent"
        className={className}
        icon={icon}
        tooltip={label}
        accessibleName={label}
        onClick={() => route(path)}/>
}


const Header = ({onContextMenu}: {onContextMenu: (event: TargetedMouseEvent<HTMLElement>) => void}) => {
    const {url} = useLocation()
    const { t } = useTranslation()

    const captionMap = {
        [Route.Dashboard]: t("header", "caption_dashboard"),
        [Route.Setup]: t("header", "caption_setup"),
        [Route.Network]: t("header", "caption_network"),
        [Route.About]: t("header", "caption_about"),
    }
    const caption = isAppRoute(url) ? captionMap[url] : t("header", "caption_notfound")

    return <header className={styl.header} onContextMenuCapture={onContextMenu}>
        <aside className={styl.logoBox}>
            {/*<img src={logo} className={styl.logo} alt="Logo" draggable={false}/>*/}
        </aside>
        <aside className={styl.clock}>
            <span>{caption}</span>
        </aside>
        <nav className={styl.nav}>
            <TopButton icon="tnt/values" label={captionMap[Route.Network]} route={Route.Network}/>
            <TopButton icon="hint" label={captionMap[Route.About]} route={Route.About}/>
        </nav>
    </header>
}

export default Header
