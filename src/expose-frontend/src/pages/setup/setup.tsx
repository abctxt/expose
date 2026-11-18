import Layout from "@comp/layout/layout"
import {useAppDispatch, useAppSelector} from "@fwk/hooks"
import {useTranslation} from "@fwk/i18n"
import {Locales} from "@app/locales"
import {Route} from "@comp/router/router.redux"
import {Accent, ColorScheme, FontSize, setAccent, setColorScheme, setFontSize, setLocale, setScrollMenus, setUiSize, UiSize} from "./setup.redux"
import English_US from "../../_i18n/English_US"
import English_GB from "../../_i18n/English_GB"
import German_DE from "../../_i18n/German_DE"
import German_CH from "../../_i18n/German_CH"
import French_FR from "../../_i18n/French_FR"
import Czech_CZ from "../../_i18n/Czech_CZ"
import {Icon} from "@ui5/webcomponents-react"
import {useLocation} from "preact-iso"
import {useEffect} from "preact/hooks"
import {Fragment} from "preact"
import styl from "./setup.module.styl"

const localeMap = {
    [Locales.EnglishUS]: English_US.displayName,
    [Locales.EnglishGB]: English_GB.displayName,
    [Locales.GermanDE]: German_DE.displayName,
    [Locales.GermanCH]: German_CH.displayName,
    [Locales.FrenchFR]: French_FR.displayName,
    [Locales.CzechCZ]: Czech_CZ.displayName
}

const sections = [
    {path: Route.SetupAppearance, icon: "palette", label: "category_appearance"},
    {path: Route.SetupBehavior, icon: "customize", label: "category_behavior"},
    {path: Route.SetupShortcuts, icon: "keyboard-and-mouse", label: "category_shortcuts"},
    {path: Route.SetupIntegrations, icon: "chain-link", label: "category_integrations", separated: true},
] as const

const Appearance = () => {
    const dispatch = useAppDispatch()
    const {t} = useTranslation()
    const locale = useAppSelector(state => state.setup.locale)
    const colorScheme = useAppSelector(state => state.setup.colorScheme)
    const uiSize = useAppSelector(state => state.setup.uiSize)
    const fontSize = useAppSelector(state => state.setup.fontSize)
    const accent = useAppSelector(state => state.setup.accent)

    return (
        <>
            <h2 className={styl.heading}>{t("setup", "category_appearance")}</h2>
            <div className={styl.item}>
                <span className={styl.caption}>{t("setup", "language")}</span>
                <span className={styl.desc}>{t("setup", "language_desc")}</span>
                <select
                    className={styl.control}
                    value={locale}
                    onChange={ev => dispatch(setLocale(ev.currentTarget.value as Locales))}>
                    {Object.entries(localeMap).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </div>
            <div className={styl.item}>
                <label className={styl.check}>
                    <input
                        type="checkbox"
                        checked={colorScheme === ColorScheme.Dark}
                        onChange={ev => dispatch(setColorScheme(ev.currentTarget.checked ? ColorScheme.Dark : ColorScheme.Light))}/>
                    <span>
                        <span className={styl.caption}>{t("setup", "dark_mode")}</span>
                        <span className={styl.desc}>{t("setup", "dark_mode_desc")}</span>
                    </span>
                </label>
            </div>
            <div className={styl.item}>
                <span className={styl.caption}>{t("setup", "accent")}</span>
                <span className={styl.desc}>{t("setup", "accent_desc")}</span>
                <select
                    className={styl.control}
                    value={accent}
                    onChange={ev => dispatch(setAccent(ev.currentTarget.value as Accent))}>
                    <option value={Accent.Red}>{t("setup", "accent_red")}</option>
                    <option value={Accent.Blue}>{t("setup", "accent_blue")}</option>
                    <option value={Accent.Teal}>{t("setup", "accent_teal")}</option>
                    <option value={Accent.Amber}>{t("setup", "accent_amber")}</option>
                    <option value={Accent.Violet}>{t("setup", "accent_violet")}</option>
                </select>
            </div>
            <div className={styl.item}>
                <span className={styl.caption}>{t("setup", "ui_size")}</span>
                <span className={styl.desc}>{t("setup", "ui_size_desc")}</span>
                <select
                    className={styl.control}
                    value={uiSize}
                    onChange={ev => dispatch(setUiSize(ev.currentTarget.value as UiSize))}>
                    <option value={UiSize.Cozy}>{t("setup", "size_cozy")}</option>
                    <option value={UiSize.Compact}>{t("setup", "size_compact")}</option>
                    <option value={UiSize.Condensed}>{t("setup", "size_condensed")}</option>
                </select>
            </div>
            <div className={styl.item}>
                <span className={styl.caption}>{t("setup", "font_size")}</span>
                <span className={styl.desc}>{t("setup", "font_size_desc")}</span>
                <select
                    className={styl.control}
                    value={fontSize}
                    onChange={ev => dispatch(setFontSize(ev.currentTarget.value as FontSize))}>
                    <option value={FontSize.Default}>{t("setup", "font_default")}</option>
                    <option value={FontSize.Enlarged}>{t("setup", "font_enlarged")}</option>
                </select>
            </div>
        </>
    )
}

const Behavior = () => {
    const dispatch = useAppDispatch()
    const {t} = useTranslation()
    const scrollMenus = useAppSelector(state => state.setup.scrollMenus)

    return (
        <>
            <h2 className={styl.heading}>{t("setup", "category_behavior")}</h2>
            <div className={styl.item}>
                <label className={styl.check}>
                    <input
                        type="checkbox"
                        checked={scrollMenus}
                        onChange={ev => dispatch(setScrollMenus(ev.currentTarget.checked))}/>
                    <span>
                        <span className={styl.caption}>{t("setup", "scroll_menus")}</span>
                        <span className={styl.desc}>{t("setup", "scroll_menus_desc")}</span>
                    </span>
                </label>
            </div>
        </>
    )
}

const Shortcuts = () => {
    const {t} = useTranslation()
    return <h2 className={styl.heading}>{t("setup", "category_shortcuts")}</h2>
}

const Integrations = () => {
    const {t} = useTranslation()
    return <h2 className={styl.heading}>{t("setup", "category_integrations")}</h2>
}

const panes = {
    [Route.SetupAppearance]: Appearance,
    [Route.SetupBehavior]: Behavior,
    [Route.SetupShortcuts]: Shortcuts,
    [Route.SetupIntegrations]: Integrations,
}

const Setup = () => {
    const {t} = useTranslation()
    const {path, route} = useLocation()
    const active = sections.find(section => section.path === path)?.path ?? Route.SetupAppearance
    const Pane = panes[active]

    useEffect(() => {
        if (path !== active) {
            route(active, true)
        }
    }, [path, active, route])

    return (
        <Layout>
            <div className={styl.page}>
                <div className={styl.shell}>
                    <nav className={styl.menu} aria-label={t("header", "caption_setup")}>
                        {sections.map(section => (
                            <Fragment key={section.path}>
                                {"separated" in section ? <hr className={styl.menuRule}/> : null}
                                <button
                                    type="button"
                                    className={section.path === active ? `${styl.menuItem} ${styl.active}` : styl.menuItem}
                                    aria-current={section.path === active ? "page" : undefined}
                                    onClick={() => route(section.path)}>
                                    <Icon name={section.icon} className={styl.menuIcon}/>
                                    <span>{t("setup", section.label)}</span>
                                </button>
                            </Fragment>
                        ))}
                    </nav>
                    <section className={styl.panel}>
                        <Pane/>
                    </section>
                </div>
            </div>
        </Layout>
    )
}

export default Setup
