import {createSlice, PayloadAction} from "@reduxjs/toolkit"

export enum Route {
    Dashboard = "/",
    Portfolio = "/portfolio",
    Watchlist = "/watchlist",
    Notifications = "/notifications",
    EtfHoldings = "/etf-holdings",
    News = "/news",
    Setup = "/setup",
    SetupAppearance = "/setup/appearance",
    SetupBehavior = "/setup/behavior",
    SetupShortcuts = "/setup/shortcuts",
    SetupIntegrations = "/setup/integrations",
    AiChat = "/ai-chat",
    Search = "/search",
    Network = "/network",
    About = "/about",
}

export const isAppRoute = (url: string): url is Route =>
    (Object.values(Route) as string[]).includes(url)

const setupSections = [Route.SetupAppearance, Route.SetupBehavior, Route.SetupShortcuts, Route.SetupIntegrations] as const

export const isSetupPath = (url: string) =>
    url === Route.Setup || (setupSections as readonly string[]).includes(url)

const routeFromLocation = (): Route => {
    if (typeof window === "undefined") {
        return Route.Dashboard
    }
    const path = window.location.pathname
    return isAppRoute(path) ? path : Route.Dashboard
}

interface State {
    currentRoute: Route
}

const init: State = {
    currentRoute: routeFromLocation(),
}

export const slice = createSlice({
    name: "Router",
    initialState: init,
    reducers: {
        navigateTo(state: State, action: PayloadAction<Route>) {
            state.currentRoute = action.payload
        }
    },
})

export const {navigateTo} = slice.actions

export default slice.reducer
