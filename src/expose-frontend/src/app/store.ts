import {configureStore, Action, ThunkAction} from "@reduxjs/toolkit"

import _router from "@comp/router/router.redux"
import _signals from "@comp/signals/signals.redux"
import about from "@page/about/about.redux"
import dashboard from "@page/dashboard/dashboard.redux"
import network from "@page/network/network.redux"
import setup from "@page/setup/setup.redux"


export const store = configureStore({
    reducer: {
        _router,
        _signals,
        about,
        dashboard,
        network,
        setup,
    },
})

export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>
