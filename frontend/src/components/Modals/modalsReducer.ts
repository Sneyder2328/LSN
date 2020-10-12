import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type ModalState = {
    modalType?: string;
    modalProps?: any;
}

const initialState: ModalState = {};

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        showModal: (state, action: PayloadAction<{modalType: string, modalProps?: any}>) => {
            state.modalType = action.payload.modalType
            state.modalProps = action.payload.modalProps
        },
        hideModal: () => initialState
    }
})

export const modalReducer = modalSlice.reducer
export const hideModal = modalSlice.actions.hideModal
export const showModal = modalSlice.actions.showModal