import { createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  refreshToken: string;
}

const initialState: AuthState = {
  refreshToken: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
  },
});

export const { saveRefreshToken } = authSlice.actions;

export const authReducer = authSlice.reducer;
