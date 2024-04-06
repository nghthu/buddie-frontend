import { RootState } from '../store';

export const getRefreshTokenSelector = (state: RootState) => {
  return state.auth.refreshToken;
};
