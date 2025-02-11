import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  message: string;
}

const initialState: UserState = {
  message: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserState>) => {
      state.message = action.payload.message;
    },
  },
});

export const { setUserData } = userSlice.actions;

const store = configureStore({
  reducer: {
    message: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
