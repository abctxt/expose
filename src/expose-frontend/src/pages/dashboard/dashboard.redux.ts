import {createSlice, PayloadAction} from "@reduxjs/toolkit"

export const Viewport = {
    Map: "map",
    Satellite: "satellite",
} as const

export type Viewport = typeof Viewport[keyof typeof Viewport]

interface State {
    viewportOpen: boolean
    viewport: Viewport
    gridLocked: boolean
}

const init: State = {
    viewportOpen: true,
    viewport: Viewport.Map,
    gridLocked: false,
}

export const slice = createSlice({
    name: "Dashboard",
    initialState: init,
    reducers: {
        setViewportOpen: (state, action: PayloadAction<boolean>) => {
            state.viewportOpen = action.payload
        },
        setViewport: (state, action: PayloadAction<Viewport>) => {
            state.viewport = action.payload
        },
        toggleGridLock: (state) => {
            state.gridLocked = !state.gridLocked
        },
    },
})

export const {setViewportOpen, setViewport, toggleGridLock} = slice.actions

export default slice.reducer
