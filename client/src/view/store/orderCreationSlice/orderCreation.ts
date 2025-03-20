import { createSlice, PayloadAction } from '@reduxjs/toolkit';
type SelectedImage = {
    isSelectedNow: boolean;
    src: string;
};

export type OrderCreationFormData = {
    images: string[];
    title: string;
    description: string;
    street: string;
    entrance: string;
    apartmentNumber: string;
    executionDate: string;
    executionTimes: string[];
    selectedImage: SelectedImage;
};

const initialState: OrderCreationFormData = {
    images: [],
    title: '',
    description: '',
    executionDate: new Date().toISOString(),
    executionTimes: [
        '8:00 - 10:00',
        '10:00 - 12:00',
        '12:00 - 14:00',
        '14:00 - 16:00',
        '16:00 - 18:00',
        '20:00 - 22:00',
    ],
    street: '',
    entrance: '',
    apartmentNumber: '',
    selectedImage: {
        isSelectedNow: false,
        src: '',
    },
};

const orderCreationSlice = createSlice({
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
        setOrderDate: (state, action: PayloadAction<string>) => {
            state.executionDate = action.payload;
        },
        setOrderExecTimes: (state, action: PayloadAction<string[]>) => {
            state.executionTimes = action.payload;
        },
        setSelectedImageSrc: (state, action: PayloadAction<string>) => {
            state.selectedImage.src = action.payload;
        },
        setImageSelected: (state, action: PayloadAction<boolean>) => {
            state.selectedImage.isSelectedNow = action.payload;
        },
        clearAllData: () => initialState,
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
    setImageSelected,
    setSelectedImageSrc,
    clearAllData,
} = orderCreationSlice.actions;

export default orderCreationSlice.reducer;
