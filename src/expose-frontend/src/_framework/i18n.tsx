import English_US from "../_i18n/English_US"
import English_GB from "../_i18n/English_GB"
import German_DE from "../_i18n/German_DE"
import German_CH from "../_i18n/German_CH"
import Czech_CZ from "../_i18n/Czech_CZ"
import Translation from "../_i18n/_i18n"
import {useAppSelector} from "./hooks"
import {Locales} from "@app/locales"

const map = {
    [Locales.EnglishUS]: English_US,
    [Locales.EnglishGB]: English_GB,
    [Locales.GermanDE]: German_DE,
    [Locales.GermanCH]: German_CH,
    [Locales.CzechCZ]: Czech_CZ
} as const

// Create a hook for translations
export const useTranslation = () => {
    const locale = useAppSelector(state => state.setup.locale)

    const t = <TKey extends keyof Translation>(
        fstKey: TKey,
        sndKey: keyof Translation[TKey],
        fallback?: string
    ) => {
        try {
            return map[locale][fstKey][sndKey] as string
        } catch {
            return fallback || `${String(fstKey)}.${String(sndKey)}`
        }
    }
    return {t, locale}
}

// Component for translations
export const Tr = <TKey extends keyof Translation>(
    {
        fstKey,
        sndKey,
        fallback
    }: {
        fstKey: TKey
        sndKey: keyof Translation[TKey]
        fallback?: string
    }) => {
    const {t} = useTranslation()
    return <>{t(fstKey, sndKey, fallback)}</>
}
