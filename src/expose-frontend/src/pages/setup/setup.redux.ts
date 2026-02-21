import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {kLocaleCzech_CZ, kLocaleEnglish_GB, kLocaleEnglish_US, kLocaleGerman_CH, kLocaleGerman_DE} from "@app/constants"

export enum Locale {
    EnglishUS = kLocaleEnglish_US,
    EnglishGB = kLocaleEnglish_GB,
    GermanDE = kLocaleGerman_DE,
    GermanCH = kLocaleGerman_CH,
    CzechCZ = kLocaleCzech_CZ,
}

interface State {
    locale: Locale
}

const init: State = {
    locale: Locale.EnglishUS
}

export const slice = createSlice({
    name: "Setup",
    initialState: init,
    reducers: {
        setLocale: (state, action: PayloadAction<Locale>) => {
            state.locale = action.payload
        }
    },
})

export const {setLocale} = slice.actions

export default slice.reducer
