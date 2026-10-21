import {useLocation} from "preact-iso"
import styl from "./navmenu.module.styl"
import FlexSpacer from "@fwk/flex"
import {useTranslation} from "@fwk/i18n"
import {Route} from "@comp/router/router.redux"
import {Button} from "@ui5/webcomponents-react"

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


const NavMenu = () => {
    const { t } = useTranslation()

    return (
        <nav className={styl.navmenu}>
            <NavButton icon="tnt/technicalinstance" text={t("navmenu", "menu_dashboard")} route={Route.Dashboard}/>
            <FlexSpacer/>
            <NavButton icon="action-settings" text={t("navmenu", "menu_setup")} route={Route.Setup}/>
        </nav>
    )
}

export default NavMenu
