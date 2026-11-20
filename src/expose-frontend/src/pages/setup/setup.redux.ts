import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {loadScrollMenus} from "@comp/appearance/appearance.redux"

interface State {
    scrollMenus: boolean
}

const init: State = {
    scrollMenus: loadScrollMenus(),
}

export const slice = createSlice({
    name: "Setup",
    initialState: init,
    reducers: {
        setScrollMenus: (state, action: PayloadAction<boolean>) => {
            state.scrollMenus = action.payload
        },
    },
})

export const {setScrollMenus} = slice.actions

export default slice.reducer
