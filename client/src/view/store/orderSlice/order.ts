import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type OrderCreationFormData = {
    images: string[];
    title: string;
    description: string;
    street: string;
    entrance: string;
    apartmentNumber: string;
    executionDate: Date;
    executionTimes: string[];
};

const initialState: OrderCreationFormData = {
    images: [],
    title: '',
    description: '',
    executionDate: new Date(),
    executionTimes: [],
    street: '',
    entrance: '',
    apartmentNumber: '',
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrderTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
        setOrderDescription: (state, action: PayloadAction<string>) => {
            state.description = action.payload;
        },
        setOrderImage: (state, action: PayloadAction<string>) => {
            state.images.push(action.payload);
        },
        deleteOrderImage: (state, action: PayloadAction<number>) => {
            state.images.splice(action.payload, 1);
        },
        setOrderStreet: (state, action: PayloadAction<string>) => {
            state.street = action.payload;
        },
        setOrderApartmentNumber: (state, action: PayloadAction<string>) => {
            state.apartmentNumber = action.payload;
        },
        setOrderEntrance: (state, action: PayloadAction<string>) => {
            state.entrance = action.payload;
        },
        setOrderDate: (state, action: PayloadAction<Date>) => {
            state.executionDate = action.payload;
        },
        setOrderExecTimes: (state, action: PayloadAction<string[]>) => {
            state.executionTimes = action.payload;
        },
    },
});

export const {
    setOrderTitle,
    setOrderDescription,
    setOrderImage,
    deleteOrderImage,
    setOrderStreet,
    setOrderApartmentNumber,
    setOrderEntrance,
    setOrderDate,
    setOrderExecTimes,
} = orderSlice.actions;

export default orderSlice.reducer;
