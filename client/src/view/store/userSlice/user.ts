import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TgUserData = {
    chatId: number;
    fullName: string;
    userName: string;
    avatarUrl: string;
};

const initialState: TgUserData = {
    chatId: -1,
    fullName: '',
    userName: '',
    avatarUrl: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setFullName: (state, action: PayloadAction<string>) => {
            state.fullName = action.payload;
        },
        setUserName: (state, action: PayloadAction<string>) => {
            state.userName = action.payload;
        },
        setAvatarUrl: (state, action: PayloadAction<string>) => {
            state.avatarUrl = action.payload;
        },
        setChatId: (state, action: PayloadAction<number>) => {
            state.chatId = action.payload;
        },
        setUserData: (state, action: PayloadAction<TgUserData>) => {
            state.avatarUrl = action.payload.avatarUrl;
            state.chatId = action.payload.chatId;
            state.fullName = action.payload.fullName;
            state.userName = action.payload.userName;
        },
    },
});

export const { setFullName, setUserName, setAvatarUrl, setChatId, setUserData } = userSlice.actions;

export default userSlice.reducer;
