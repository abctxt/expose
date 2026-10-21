import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {Locales} from "@app/locales"

interface State {
    locale: Locales
}

const storageKey = "Expose.appearance"

const defaults: State = {
    locale: Locales.EnglishUS
}

const locales = [Locales.EnglishUS, Locales.EnglishGB, Locales.GermanDE, Locales.GermanCH, Locales.CzechCZ] as const

const isOneOf = <T extends string>(value: unknown, allowed: readonly T[]): value is T =>
    typeof value === "string" && (allowed as readonly string[]).includes(value)

export const loadAppearance = (): State => {
    try {
        const raw = localStorage.getItem(storageKey)
        if (!raw) {
            return defaults
        }
        const data = JSON.parse(raw) as Partial<State>
        return {
            locale: isOneOf(data.locale, locales) ? data.locale : defaults.locale
        }
    } catch {
        return defaults
    }
}

export const saveAppearance = (state: State) => {
    try {
        localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
        // The browser may refuse storage in private mode.
    }
}

const init: State = loadAppearance()

export const slice = createSlice({
    name: "Setup",
    initialState: init,
    reducers: {
        setLocale: (state, action: PayloadAction<Locales>) => {
            state.locale = action.payload
        }
    },
})

export const {setLocale} = slice.actions

export default slice.reducer
