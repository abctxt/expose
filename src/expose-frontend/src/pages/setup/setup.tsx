import Layout from "@comp/layout/layout"
import {useAppDispatch, useAppSelector} from "@fwk/hooks"
import {kLocaleCzech_CZ, kLocaleEnglish_GB, kLocaleEnglish_US, kLocaleGerman_CH, kLocaleGerman_DE} from "@app/constants"
import {Option, Select, SelectDomRef, Ui5CustomEvent} from "@ui5/webcomponents-react"
import type {SelectChangeEventDetail} from "@ui5/webcomponents/Select.d.ts"
import {Locale, setLocale} from "./setup.redux"
import English_US from "../../_i18n/English_US"
import English_GB from "../../_i18n/English_GB"
import German_DE from "../../_i18n/German_DE"
import German_CH from "../../_i18n/German_CH"
import Czech_CZ from "../../_i18n/Czech_CZ"

const localeMap = {
    [kLocaleEnglish_US]: English_US.displayName,
    [kLocaleEnglish_GB]: English_GB.displayName,
    [kLocaleGerman_DE]: German_DE.displayName,
    [kLocaleGerman_CH]: German_CH.displayName,
    [kLocaleCzech_CZ]: Czech_CZ.displayName,
}

const Setup = () => {
    const dispatch = useAppDispatch()
    const locale = useAppSelector(state => state.setup.locale)

    const onLocaleChange = (ev: Ui5CustomEvent<SelectDomRef, SelectChangeEventDetail>) => {
        const selectedLocale = ev.detail.selectedOption.dataset.id as Locale
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
