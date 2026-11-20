import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {Locales} from "@app/locales"

export const ColorScheme = {Light: "light", Dark: "dark"} as const
export type ColorScheme = typeof ColorScheme[keyof typeof ColorScheme]

export const UiSize = {Compact: "compact", Cozy: "cozy", Condensed: "condensed"} as const
export type UiSize = typeof UiSize[keyof typeof UiSize]

export const FontSize = {Default: "default", Enlarged: "enlarged"} as const
export type FontSize = typeof FontSize[keyof typeof FontSize]

export const Accent = {Red: "red", Blue: "blue", Teal: "teal", Amber: "amber", Violet: "violet"} as const
export type Accent = typeof Accent[keyof typeof Accent]

export const accentPalette: Record<Accent, {color: string, focus: string}> = {
    [Accent.Red]: {color: "#cd071e", focus: "#e98994"},
    [Accent.Blue]: {color: "#1a73c7", focus: "#7eb6e8"},
    [Accent.Teal]: {color: "#0e8a78", focus: "#6ec4b4"},
    [Accent.Amber]: {color: "#d97706", focus: "#f0b15a"},
    [Accent.Violet]: {color: "#7c3aed", focus: "#b794f6"},
}

interface State {
    locale: Locales
    colorScheme: ColorScheme
    uiSize: UiSize
    fontSize: FontSize
    accent: Accent
}

const storageKey = "Expose.appearance"

const defaults: State = {
    locale: Locales.EnglishUS,
    colorScheme: ColorScheme.Dark,
    uiSize: UiSize.Cozy,
    fontSize: FontSize.Default,
    accent: Accent.Teal,
}

export const locales = [Locales.EnglishUS, Locales.EnglishGB, Locales.GermanDE, Locales.GermanCH, Locales.FrenchFR, Locales.CzechCZ] as const
const colorSchemes = [ColorScheme.Light, ColorScheme.Dark] as const
export const uiSizes = [UiSize.Compact, UiSize.Cozy, UiSize.Condensed] as const
export const fontSizes = [FontSize.Default, FontSize.Enlarged] as const
export const accents = [Accent.Red, Accent.Blue, Accent.Teal, Accent.Amber, Accent.Violet] as const

export const isOneOf = <T extends string>(value: unknown, allowed: readonly T[]): value is T =>
    typeof value === "string" && allowed.some(item => item === value)

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value)

const readStored = (): Record<string, unknown> | null => {
    try {
        const raw = localStorage.getItem(storageKey)
        if (!raw) {
            return null
        }
        const data: unknown = JSON.parse(raw)
        return isRecord(data) ? data : null
    } catch {
        return null
    }
}

export const loadAppearance = (): State => {
    const data = readStored()
    if (!data) {
        return defaults
    }
    return {
        locale: isOneOf(data.locale, locales) ? data.locale : defaults.locale,
        colorScheme: isOneOf(data.colorScheme, colorSchemes) ? data.colorScheme : defaults.colorScheme,
        uiSize: isOneOf(data.uiSize, uiSizes) ? data.uiSize : defaults.uiSize,
        fontSize: isOneOf(data.fontSize, fontSizes) ? data.fontSize : defaults.fontSize,
        accent: isOneOf(data.accent, accents) ? data.accent : defaults.accent,
    }
}

export const loadScrollMenus = (): boolean => {
    const data = readStored()
    return typeof data?.scrollMenus === "boolean" ? data.scrollMenus : true
}

export const saveAppearance = (appearance: State, scrollMenus: boolean) => {
    try {
        localStorage.setItem(storageKey, JSON.stringify({...appearance, scrollMenus}))
    } catch {
        // The browser may refuse storage in private mode.
    }
}

const init: State = loadAppearance()

export const slice = createSlice({
    name: "Appearance",
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
        },
        setAccent: (state, action: PayloadAction<Accent>) => {
            state.accent = action.payload
        },
    },
})

export const {setLocale, setColorScheme, setUiSize, setFontSize, setAccent} = slice.actions

export default slice.reducer
