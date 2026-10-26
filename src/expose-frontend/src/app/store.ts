import {configureStore, Action, ThunkAction} from "@reduxjs/toolkit"

import _router from "@comp/router/router.redux"
import _signals from "@comp/signals/signals.redux"
import layout from "@comp/layout/layout.redux"
import about from "@page/about/about.redux"
import dashboard from "@page/dashboard/dashboard.redux"
import network from "@page/network/network.redux"
import setup, {saveAppearance} from "@page/setup/setup.redux"


export const store = configureStore({
    reducer: {
        _router,
        _signals,
        layout,
        about,
        dashboard,
        network,
        setup,
    },
})

let storedAppearance = JSON.stringify(store.getState().setup)
store.subscribe(() => {
    const next = JSON.stringify(store.getState().setup)
    if (next === storedAppearance) {
        return
    }
    storedAppearance = next
    saveAppearance(store.getState().setup)
})

export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>
