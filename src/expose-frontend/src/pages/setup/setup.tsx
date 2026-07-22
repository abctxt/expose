import Layout from "@comp/layout/layout"
import {useAppDispatch, useAppSelector} from "@fwk/hooks"
import {Option, Select, SelectDomRef, Ui5CustomEvent} from "@ui5/webcomponents-react"
import type {SelectChangeEventDetail} from "@ui5/webcomponents/Select.d.ts"
import {Locales} from "@app/locales"
import {setLocale} from "./setup.redux"
import English_US from "../../_i18n/English_US"
import English_GB from "../../_i18n/English_GB"
import German_DE from "../../_i18n/German_DE"
import German_CH from "../../_i18n/German_CH"
import Czech_CZ from "../../_i18n/Czech_CZ"

const localeMap = {
    [Locales.EnglishUS]: English_US.displayName,
    [Locales.EnglishGB]: English_GB.displayName,
    [Locales.GermanDE]: German_DE.displayName,
    [Locales.GermanCH]: German_CH.displayName,
    [Locales.CzechCZ]: Czech_CZ.displayName,
}

const Setup = () => {
    const dispatch = useAppDispatch()
    const locale = useAppSelector(state => state.setup.locale)

    const onLocaleChange = (ev: Ui5CustomEvent<SelectDomRef, SelectChangeEventDetail>) => {
        const selectedLocale = ev.detail.selectedOption.dataset.id as Locales
        dispatch(setLocale(selectedLocale))
    }

    return (
        <Layout>
            <Select style={{margin: "20px"}} onChange={onLocaleChange}>
                {Object.entries(localeMap).map(([key, label]) => (
                    <Option key={key} data-id={key} selected={key === locale}>{label}</Option>
                ))}
            </Select>
        </Layout>
    )
}

export default Setup
