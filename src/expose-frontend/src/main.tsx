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

const initialAppearance = store.getState().setup
setAnimationMode("minimal")
await setLanguage(initialAppearance.locale)
await setTheme(initialAppearance.colorScheme === "dark" ? "sap_horizon_dark" : "sap_horizon")
document.documentElement.lang = initialAppearance.locale
document.documentElement.classList.toggle("font-size-enlarged", initialAppearance.fontSize === "enlarged")

// Remove styles with downloaded fonts
createOrUpdateStyle("", "data-ui5-font-face")
//createOrUpdateStyle("", "data-ui5-font-face-override")

// compact / cozy / condensed
document.body.classList.add(`ui5-content-density-${initialAppearance.uiSize}`)


const densityClasses = ["ui5-content-density-compact", "ui5-content-density-cozy", "ui5-content-density-condensed"]

const SyncUi5Language = () => {
    const locale = useAppSelector(state => state.setup.locale)
    const colorScheme = useAppSelector(state => state.setup.colorScheme)
    const uiSize = useAppSelector(state => state.setup.uiSize)
    const fontSize = useAppSelector(state => state.setup.fontSize)
    useEffect(() => {
        document.documentElement.lang = locale
        void setLanguage(locale)
    }, [locale])
    useEffect(() => {
        void setTheme(colorScheme === "dark" ? "sap_horizon_dark" : "sap_horizon")
    }, [colorScheme])
    useEffect(() => {
        document.body.classList.remove(...densityClasses)
        document.body.classList.add(`ui5-content-density-${uiSize}`)
    }, [uiSize])
    useEffect(() => {
        document.documentElement.classList.toggle("font-size-enlarged", fontSize === "enlarged")
    }, [fontSize])
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
