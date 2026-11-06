import {LocationProvider, Route, Router, useLocation} from "preact-iso"
import {useEffect} from "preact/hooks"
import {useAppDispatch, useAppSelector} from "@fwk/hooks"
import {AnyComponent} from "preact"
import {isAppRoute, navigateTo, Route as AppRoute} from "./router.redux"
import SignalHandler from "@comp/signals/signals"
import {NavWheelGesture} from "@comp/navmenu/navmenu"
import Dashboard from "@page/dashboard/dashboard"
import Portfolio from "@page/portfolio/portfolio"
import Watchlist from "@page/watchlist/watchlist"
import Notifications from "@page/notifications/notifications"
import EtfHoldings from "@page/etf-holdings/etf-holdings"
import News from "@page/news/news"
import AiChat from "@page/ai-chat/ai-chat"
import Search from "@page/search/search"
import Network from "@page/network/network"
import Setup from "@page/setup/setup"
import About from "@page/about/about"
import NotFound from "@page/_404"


const routeMap: Record<string, AnyComponent> = {
    [AppRoute.Dashboard]: Dashboard,
    [AppRoute.Portfolio]: Portfolio,
    [AppRoute.Watchlist]: Watchlist,
    [AppRoute.Notifications]: Notifications,
    [AppRoute.EtfHoldings]: EtfHoldings,
    [AppRoute.News]: News,
    [AppRoute.AiChat]: AiChat,
    [AppRoute.Search]: Search,
    [AppRoute.Setup]: Setup,
    [AppRoute.SetupAppearance]: Setup,
    [AppRoute.SetupBehavior]: Setup,
    [AppRoute.SetupShortcuts]: Setup,
    [AppRoute.SetupIntegrations]: Setup,
    [AppRoute.Network]: Network,
    [AppRoute.About]: About,
}

const LocationListener = () => {
    const currentRoute = useAppSelector((state) => state._router.currentRoute)
    const dispatch = useAppDispatch()
    const {url} = useLocation()

    useEffect(() => {
        if (url !== currentRoute && isAppRoute(url)) {
            dispatch(navigateTo(url))
        }
    }, [url, currentRoute, dispatch])

    return <></>
}

const AppRouter = () => (
    <LocationProvider>
        <Router>
            {Object.entries(routeMap).map(([path, page]) => (
                <Route key={path} path={path} component={page}/>
            ))}
            <Route default component={NotFound}/>
        </Router>
        <SignalHandler/>
        <LocationListener/>
        <NavWheelGesture/>
    </LocationProvider>
)

export default AppRouter
