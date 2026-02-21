import styl from "./header.module.styl"
import {useTranslation} from "@fwk/i18n"
import {Button} from "@ui5/webcomponents-react"
import {useAppDispatch, useAppSelector} from "@fwk/hooks"
import {navigateTo, Route} from "@comp/router/router.redux"


const TopButton = ({icon, route}) => {
    const dispatch = useAppDispatch()
    return <Button
        design="Transparent"
        className={styl.button}
        icon={icon}
        onClick={() => dispatch(navigateTo(route))}/>
}


const Header = () => {
    const route = useAppSelector((state) => state._router.currentRoute)
    const { t } = useTranslation()

    const captionMap = {
        [Route.Dashboard]: t("header", "caption_dashboard"),
        [Route.Setup]: t("header", "caption_setup"),
        [Route.Network]: t("header", "caption_network"),
        [Route.About]: t("header", "caption_about"),
    }
    const caption = captionMap[route]

    return <header className={styl.header}>
        <aside className={styl.logoBox}>
            {/*<img src={logo} className={styl.logo} alt="Logo" draggable={false}/>*/}
        </aside>
        <aside className={styl.clock}>
            <span>{caption}</span>
        </aside>
        <nav className={styl.nav}>
            <TopButton icon="tnt/aggregator" route={Route.Network}/>
            <TopButton icon="sys-help" route={Route.About}/>
        </nav>
    </header>
}

export default Header
