import {configureStore, Action, ThunkAction} from "@reduxjs/toolkit"

import _appearance, {saveAppearance} from "@comp/appearance/appearance.redux"
import _router from "@comp/router/router.redux"
import _signals from "@comp/signals/signals.redux"
import layout from "@comp/layout/layout.redux"
import about from "@page/about/about.redux"
import dashboard from "@page/dashboard/dashboard.redux"
import aiChat from "@page/ai-chat/ai-chat.redux"
import search from "@page/search/search.redux"
import notifications from "@page/notifications/notifications.redux"
import portfolio from "@page/portfolio/portfolio.redux"
import watchlist from "@page/watchlist/watchlist.redux"
import news from "@page/news/news.redux"
import etfHoldings from "@page/etf-holdings/etf-holdings.redux"
import network from "@page/network/network.redux"
import setup from "@page/setup/setup.redux"


export const store = configureStore({
    reducer: {
        _appearance,
        _router,
        _signals,
        layout,
        about,
        dashboard,
        aiChat,
        search,
        notifications,
        portfolio,
        watchlist,
        news,
        etfHoldings,
        network,
        setup,
    },
})

const storedPreferences = () => JSON.stringify({
    ...store.getState()._appearance,
    scrollMenus: store.getState().setup.scrollMenus,
})

let storedAppearance = storedPreferences()
store.subscribe(() => {
    const next = storedPreferences()
    if (next === storedAppearance) {
        return
    }
    storedAppearance = next
    saveAppearance(store.getState()._appearance, store.getState().setup.scrollMenus)
})

export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>
