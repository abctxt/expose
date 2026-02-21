import styl from "./navmenu.module.styl"
import FlexSpacer from "@fwk/flex"
import {useTranslation} from "@fwk/i18n"
import {useAppDispatch} from "@fwk/hooks"
import {navigateTo, Route} from "@comp/router/router.redux"
import {Button} from "@ui5/webcomponents-react"


const NavButton = ({icon, text, route}) => {
    const dispatch = useAppDispatch()
    return <Button
        design="Transparent"
        className={styl.button}
        icon={icon}
        onClick={() => dispatch(navigateTo(route))}>
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
