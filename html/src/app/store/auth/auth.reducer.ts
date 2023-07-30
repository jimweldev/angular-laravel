import { createReducer, on } from '@ngrx/store';
import { setAuth, removeAuth } from './auth.actions';

export const initialState = {
  user: null,
  roles: null
};

export const authReducer = createReducer(
  initialState,
  on(setAuth, (state, { user, roles }) => ({
    ...state,
    user: user,
    roles: roles,
  })),
  on(removeAuth, (state) => ({
    ...state,
    user: null,
    roles: null,
  }))
);