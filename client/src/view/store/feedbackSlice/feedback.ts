import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum OptionsList {
    TIME = 'Время',
    MONEY = 'Деньги',
    SPECIALIST_CONFIDENCE = 'Уверенность в специалисте',
}

type FeedBack = {
    orderId: number;
    importantOption: string;
    comment: string;
};

const initialState: FeedBack = {
    orderId: -1,
    importantOption: '',
    comment: '',
};

const feedbackSlice = createSlice({
    name: 'feedback',
    initialState,
    reducers: {
        setOrderID: (state, action: PayloadAction<number>) => {
            state.orderId = action.payload;
        },
        setImportantOption: (state, action: PayloadAction<string>) => {
            state.importantOption = action.payload;
        },
        setComment: (state, action: PayloadAction<string>) => {
            state.comment = action.payload;
        },
    },
});

export const { setImportantOption, setComment, setOrderID } = feedbackSlice.actions;

export default feedbackSlice.reducer;
