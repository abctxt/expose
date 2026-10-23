import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {Locales} from "@app/locales"

export const ColorScheme = {Light: "light", Dark: "dark"} as const
export type ColorScheme = typeof ColorScheme[keyof typeof ColorScheme]

export const UiSize = {Compact: "compact", Cozy: "cozy", Condensed: "condensed"} as const
export type UiSize = typeof UiSize[keyof typeof UiSize]

export const FontSize = {Default: "default", Enlarged: "enlarged"} as const
export type FontSize = typeof FontSize[keyof typeof FontSize]

interface State {
    locale: Locales
    colorScheme: ColorScheme
    uiSize: UiSize
    fontSize: FontSize
}

const storageKey = "Expose.appearance"

const defaults: State = {
    locale: Locales.EnglishUS,
    colorScheme: ColorScheme.Dark,
    uiSize: UiSize.Cozy,
    fontSize: FontSize.Default
}

const locales = [Locales.EnglishUS, Locales.EnglishGB, Locales.GermanDE, Locales.GermanCH, Locales.FrenchFR, Locales.CzechCZ] as const
const colorSchemes = [ColorScheme.Light, ColorScheme.Dark] as const
const uiSizes = [UiSize.Compact, UiSize.Cozy, UiSize.Condensed] as const
const fontSizes = [FontSize.Default, FontSize.Enlarged] as const

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
            locale: isOneOf(data.locale, locales) ? data.locale : defaults.locale,
            colorScheme: isOneOf(data.colorScheme, colorSchemes) ? data.colorScheme : defaults.colorScheme,
            uiSize: isOneOf(data.uiSize, uiSizes) ? data.uiSize : defaults.uiSize,
            fontSize: isOneOf(data.fontSize, fontSizes) ? data.fontSize : defaults.fontSize
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
        },
        setColorScheme: (state, action: PayloadAction<ColorScheme>) => {
            state.colorScheme = action.payload
        },
        setUiSize: (state, action: PayloadAction<UiSize>) => {
            state.uiSize = action.payload
        },
        setFontSize: (state, action: PayloadAction<FontSize>) => {
            state.fontSize = action.payload
        }
    },
})

export const {setLocale, setColorScheme, setUiSize, setFontSize} = slice.actions

export default slice.reducer
