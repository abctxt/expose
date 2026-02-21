import {createSlice, PayloadAction} from "@reduxjs/toolkit"

interface State {
    signalR_connected: boolean
}

const init: State = {
    signalR_connected: false,
}

export const slice = createSlice({
    name: "Signals",
    initialState: init,
    reducers: {},
})

export const {} = slice.actions

export default slice.reducer
