import {kRouteAbout, kRouteDashboard, kRouteNetwork, kRouteSetup} from "@app/constants"
import {LocationProvider, Route, Router, useLocation} from "preact-iso"
import {useEffect} from "preact/hooks"
import {useAppSelector} from "@fwk/hooks"
import {AnyComponent} from "preact"

import SignalHandler from "@comp/signals/signals"
import Dashboard from "@page/dashboard/dashboard"
import Network from "@page/network/network"
import Setup from "@page/setup/setup"
import About from "@page/about/about"
import NotFound from "@page/_404"


const routeMap: Record<string, AnyComponent> = {
    [kRouteDashboard]: Dashboard,
    [kRouteSetup]: Setup,
    [kRouteNetwork]: Network,
    [kRouteAbout]: About,
}

const LocationListener = () => {
    const currentRoute = useAppSelector((state) => state._router.currentRoute)
    const {url, route} = useLocation()

    useEffect(() => {
        // Synchronize the current route in Redux with the browser route
        if (url !== currentRoute && Object.keys(routeMap).includes(url)) {
            route(currentRoute)
        }
    }, [currentRoute, url, route])

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
    </LocationProvider>
)

export default AppRouter
