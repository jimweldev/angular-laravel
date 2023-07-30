import { createAction, props } from '@ngrx/store';

export const setAuth = createAction('[Auth Component] Set Auth', props<{ user: any, roles: any }>());
export const removeAuth = createAction('[Auth Component] Remove Auth');