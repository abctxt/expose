import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {Locales} from "@app/locales"

interface State {
    locale: Locales
}

const init: State = {
    locale: Locales.EnglishUS
}

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
