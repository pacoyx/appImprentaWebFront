import { ActionReducerMap } from '@ngrx/store';
import * as reducers from './reducers';

export interface AppState {
    usuario: reducers.UsuarioState;
    customers: reducers.CustomersState;
    customer: reducers.CustomerState;
}

export const appReducers: ActionReducerMap<AppState> = {
    usuario: reducers.usuarioReducer,
    customers: reducers.customersReducer,
    customer: reducers.customerReducer
};
