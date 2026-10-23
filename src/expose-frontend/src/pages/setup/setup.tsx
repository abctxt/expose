import Layout from "@comp/layout/layout"
import {useAppDispatch, useAppSelector} from "@fwk/hooks"
import {useTranslation} from "@fwk/i18n"
import {Locales} from "@app/locales"
import {ColorScheme, FontSize, setColorScheme, setFontSize, setLocale, setUiSize, UiSize} from "./setup.redux"
import English_US from "../../_i18n/English_US"
import English_GB from "../../_i18n/English_GB"
import German_DE from "../../_i18n/German_DE"
import German_CH from "../../_i18n/German_CH"
import French_FR from "../../_i18n/French_FR"
import Czech_CZ from "../../_i18n/Czech_CZ"
import styl from "./setup.module.styl"

const localeMap = {
    [Locales.EnglishUS]: English_US.displayName,
    [Locales.EnglishGB]: English_GB.displayName,
    [Locales.GermanDE]: German_DE.displayName,
    [Locales.GermanCH]: German_CH.displayName,
    [Locales.FrenchFR]: French_FR.displayName,
    [Locales.CzechCZ]: Czech_CZ.displayName
}

const Setup = () => {
    const dispatch = useAppDispatch()
    const {t} = useTranslation()
    const locale = useAppSelector(state => state.setup.locale)
    const colorScheme = useAppSelector(state => state.setup.colorScheme)
    const uiSize = useAppSelector(state => state.setup.uiSize)
    const fontSize = useAppSelector(state => state.setup.fontSize)

    return (
        <Layout>
            <div className={styl.page}>
                <section className={`${styl.column} ${styl.panel}`}>
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
                </section>
            </div>
        </Layout>
    )
}

export default Setup
