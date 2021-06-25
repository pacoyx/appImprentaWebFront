import { createReducer, on } from '@ngrx/store';
import { Customer } from 'src/app/models/customer.model';

import { cargarCustomers, cargarCustomersError, cargarCustomersSuccess } from '../actions/customers.actions';

export interface CustomersState {
    customers: Customer[];
    loaded: boolean;
    loading: boolean;
    error: any;
}

export const CustomersInitialState: CustomersState = {
    customers: [],
    loaded: false,
    loading: false,
    error: null
};

const _customersReducer = createReducer(
    CustomersInitialState,
    on(cargarCustomers, (state) => ({ ...state, loading: true })),

    on(cargarCustomersSuccess, (state, { customers }) => ({
        ...state,
        loading: false,
        loaded: true,
        customers: [...customers]
    })),

    on(cargarCustomersError, (state, { payload }) => ({
        ...state,
        loading: false,
        loaded: false,
        error: {
            url: payload.url,
            name: payload.name,
            message: payload.message
        }
    })),
);


export function customersReducer(state, action) {
    return _customersReducer(state, action);
}