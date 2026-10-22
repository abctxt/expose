import {render} from "preact"
import {useEffect} from "preact/hooks"
import {Provider} from "react-redux"
import {store} from "@app/store"
import {useAppSelector} from "@fwk/hooks"
import AppRouter from "@comp/router/router"

import "./main.styl"
import "@ui5/webcomponents-react/dist/Assets"
import "@ui5/webcomponents-icons/dist/action-settings.js"
import "@ui5/webcomponents-icons/dist/hint.js"
import "@ui5/webcomponents-icons-tnt/dist/technicalinstance.js"
import "@ui5/webcomponents-icons-tnt/dist/values.js"

import {ThemeProvider} from "@ui5/webcomponents-react"
import {setTheme} from "@ui5/webcomponents-base/dist/config/Theme.js"
import {setLanguage} from "@ui5/webcomponents-base/dist/config/Language.js"
import {setAnimationMode} from "@ui5/webcomponents-base/dist/config/AnimationMode.js"
import {createOrUpdateStyle} from "@ui5/webcomponents-base/dist/ManagedStyles.js"

const initialLocale = store.getState().setup.locale
setAnimationMode("minimal")
await setLanguage(initialLocale)
await setTheme("sap_horizon_dark")
document.documentElement.lang = initialLocale

// Remove styles with downloaded fonts
createOrUpdateStyle("", "data-ui5-font-face")
//createOrUpdateStyle("", "data-ui5-font-face-override")

// compact / cozy / condensed
document.body.classList.add("ui5-content-density-cozy")


const SyncUi5Language = () => {
    const locale = useAppSelector(state => state.setup.locale)
    useEffect(() => {
        document.documentElement.lang = locale
        void setLanguage(locale)
    }, [locale])
    return null
}

const App = () => (
    <Provider store={store}>
        <ThemeProvider>
            <AppRouter/>
            <SyncUi5Language/>
        </ThemeProvider>
    </Provider>
)

const root = document.getElementById("root")
if (!root) {
    throw new Error("Missing element #root")
}
render(<App/>, root)
