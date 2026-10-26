import {createSlice, PayloadAction} from "@reduxjs/toolkit"

interface State {
    headerVisible: boolean
    navVisible: boolean
}

const init: State = {
    headerVisible: true,
    navVisible: true,
}

export const slice = createSlice({
    name: "Layout",
    initialState: init,
    reducers: {
        setHeaderVisible: (state, action: PayloadAction<boolean>) => {
            state.headerVisible = action.payload
        },
        setNavVisible: (state, action: PayloadAction<boolean>) => {
            state.navVisible = action.payload
        },
    },
})

export const {setHeaderVisible, setNavVisible} = slice.actions

export default slice.reducer
