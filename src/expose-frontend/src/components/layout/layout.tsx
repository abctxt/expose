import type {ComponentChildren} from "preact"
import styl from "./layout.module.styl"
import Header from "@comp/header/header"
import NavMenu from "@comp/navmenu/navmenu"

const Layout = ({children}: {children: ComponentChildren}) => (
    <div className={styl.shell}>
        <Header/>
        <div className={styl.body}>
            <NavMenu/>
            <main className={styl.content}>{children}</main>
        </div>
    </div>
)

export default Layout
