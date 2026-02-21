import {render} from "preact"
import {Provider} from "react-redux"
import {store} from "@app/store"
import AppRouter from "@comp/router/router"

import "./main.styl"
import "@ui5/webcomponents-react/dist/Assets"
import "@ui5/webcomponents-icons/dist/AllIcons"
import "@ui5/webcomponents-icons-tnt/dist/AllIcons"

import {ThemeProvider} from "@ui5/webcomponents-react"
import {setTheme} from "@ui5/webcomponents-base/dist/config/Theme.js"
import {setLanguage} from "@ui5/webcomponents-base/dist/config/Language.js"
import {setAnimationMode} from "@ui5/webcomponents-base/dist/config/AnimationMode.js"
import {createOrUpdateStyle} from "@ui5/webcomponents-base/dist/ManagedStyles.js"

setAnimationMode("minimal")
await setLanguage("en")
await setTheme("sap_horizon_dark")

// Remove styles with downloaded fonts
createOrUpdateStyle("", "data-ui5-font-face")
//createOrUpdateStyle("", "data-ui5-font-face-override")

// compact / cozy / condensed
document.body.classList.add("ui5-content-density-cozy")


const App = () => (
    <Provider store={store}>
        <ThemeProvider>
            <AppRouter/>
        </ThemeProvider>
    </Provider>
)

render(<App/>, document.getElementById("root"))
