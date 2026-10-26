import type {ComponentChildren, TargetedMouseEvent} from "preact"
import {useEffect, useLayoutEffect, useRef, useState} from "preact/hooks"
import {Menu, MenuItem, Ui5CustomEvent} from "@ui5/webcomponents-react"
import type {MenuItemClickEventDetail} from "@ui5/webcomponents/dist/Menu.js"
import {useAppDispatch, useAppSelector} from "@fwk/hooks"
import {useTranslation} from "@fwk/i18n"
import styl from "./layout.module.styl"
import Header from "@comp/header/header"
import NavMenu from "@comp/navmenu/navmenu"
import {setHeaderVisible, setNavVisible} from "./layout.redux"

const Layout = ({children}: {children: ComponentChildren}) => {
    const dispatch = useAppDispatch()
    const {t} = useTranslation()
    const headerVisible = useAppSelector(state => state.layout.headerVisible)
    const navVisible = useAppSelector(state => state.layout.navVisible)
    const [navPeek, setNavPeek] = useState(false)
    const [open, setOpen] = useState(false)
    const bodyRef = useRef<HTMLDivElement>(null)
    const navRef = useRef<HTMLDivElement>(null)
    const navHover = useRef(false)
    const hideNavTimer = useRef<number | null>(null)
    const [opener, setOpener] = useState<HTMLDivElement | null>(null)
    const reopen = useRef(false)

    const onBarContextMenu = (event: TargetedMouseEvent<HTMLElement>) => {
        event.preventDefault()
        if (!opener) {
            return
        }
        opener.style.left = `${event.clientX}px`
        opener.style.top = `${event.clientY}px`
        if (open) {
            reopen.current = true
            setOpen(false)
        } else {
            setOpen(true)
        }
    }

    useEffect(() => {
        // Preact sets boolean false as an empty attribute, which leaves ui5-menu.open as "".
        const menu = document.querySelector("ui5-menu") as (HTMLElement & {open: boolean}) | null
        if (menu && menu.open !== open) {
            menu.open = open
        }
    }, [open])

    useEffect(() => {
        if (!open && reopen.current) {
            reopen.current = false
            setOpen(true)
        }
    }, [open])

    const revealNav = () => {
        if (hideNavTimer.current !== null) {
            window.clearTimeout(hideNavTimer.current)
            hideNavTimer.current = null
        }
        setNavPeek(true)
    }

    const concealNav = (force = false) => {
        if (!force && open) {
            return
        }
        if (hideNavTimer.current !== null) {
            window.clearTimeout(hideNavTimer.current)
        }
        hideNavTimer.current = window.setTimeout(() => {
            hideNavTimer.current = null
            setNavPeek(false)
        }, 120)
    }

    useEffect(() => {
        if (navVisible) {
            if (hideNavTimer.current !== null) {
                window.clearTimeout(hideNavTimer.current)
                hideNavTimer.current = null
            }
            setNavPeek(false)
            return
        }
        const onMove = (event: MouseEvent) => {
            const body = bodyRef.current
            if (!body) {
                return
            }
            const rect = body.getBoundingClientRect()
            const onEdge = event.clientX <= rect.left + 4
                && event.clientY >= rect.top
                && event.clientY <= rect.bottom
            if (onEdge) {
                revealNav()
            }
        }
        window.addEventListener("mousemove", onMove)
        return () => {
            window.removeEventListener("mousemove", onMove)
            if (hideNavTimer.current !== null) {
                window.clearTimeout(hideNavTimer.current)
                hideNavTimer.current = null
            }
        }
    }, [navVisible])

    useLayoutEffect(() => {
        const nav = navRef.current
        if (!nav) {
            return
        }
        if (!navVisible && !navPeek) {
            nav.setAttribute("inert", "")
        } else {
            nav.removeAttribute("inert")
        }
    }, [navVisible, navPeek])

    const closeMenu = () => {
        setOpen(false)
        if (!navVisible && !navHover.current) {
            concealNav(true)
        }
    }

    const onItemClick = (event: Ui5CustomEvent<HTMLElement, MenuItemClickEventDetail>) => {
        if (event.detail.item.id === "chrome-header") {
            dispatch(setHeaderVisible(!headerVisible))
        } else if (event.detail.item.id === "chrome-nav") {
            dispatch(setNavVisible(!navVisible))
        }
    }

    return (
        <div className={styl.shell}>
            {headerVisible && <Header onContextMenu={onBarContextMenu}/>}
            <div className={styl.body} ref={bodyRef}>
                <div
                    ref={navRef}
                    className={navVisible
                        ? styl.navSlot
                        : `${styl.navSlot} ${styl.autohide}${navPeek ? ` ${styl.shown}` : ""}`}
                    onMouseEnter={() => {
                        navHover.current = true
                        if (!navVisible) {
                            revealNav()
                        }
                    }}
                    onMouseLeave={() => {
                        navHover.current = false
                        if (!navVisible) {
                            concealNav()
                        }
                    }}>
                    <NavMenu onContextMenu={onBarContextMenu}/>
                </div>
                <main className={styl.content}>{children}</main>
            </div>
            <div ref={setOpener} className={styl.opener}/>
            <Menu opener={opener} onClose={closeMenu} onItemClick={onItemClick}>
                <MenuItem
                    id="chrome-header"
                    text={headerVisible ? t("shell", "hide_header") : t("shell", "show_header")}/>
                <MenuItem
                    id="chrome-nav"
                    text={navVisible ? t("shell", "hide_nav") : t("shell", "show_nav")}/>
            </Menu>
        </div>
    )
}

export default Layout
