import {kRouteAbout, kRouteDashboard, kRouteNetwork, kRouteSetup} from "@app/constants"
import {createSlice, PayloadAction} from "@reduxjs/toolkit"

export enum Route {
    Dashboard = kRouteDashboard,
    Setup = kRouteSetup,
    Network = kRouteNetwork,
    About = kRouteAbout
}

interface State {
    currentRoute: Route
}

const init: State = {
    currentRoute: Route.Dashboard,
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
