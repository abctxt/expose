import {createSlice, PayloadAction} from "@reduxjs/toolkit"

export enum Route {
    Dashboard = "/",
    EtfHoldings = "/etf-holdings",
    Setup = "/setup",
    Network = "/network",
    About = "/about",
}

export const isAppRoute = (url: string): url is Route =>
    (Object.values(Route) as string[]).includes(url)

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
