import {createSlice} from "@reduxjs/toolkit"

interface State {
    value: number
}

const init: State = {
    value: 0,
}

export const slice = createSlice({
    name: "Network",
    initialState: init,
    reducers: {},
})

export const {} = slice.actions

export default slice.reducer
