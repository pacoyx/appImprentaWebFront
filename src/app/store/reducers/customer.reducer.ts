import { createReducer, on } from '@ngrx/store';
import { Customer } from 'src/app/models/customer.model';
import { createCustomer, createCustomerError, createCustomerSuccess, createCustomerCloseMsg } from '../actions/customer.actions';

export interface CustomerState {
    cliente: Customer;
    loaded: boolean;
    loading: boolean;
    error: any;
    estado: string;
    mensaje: string;
}

export const CustomerInitialState: CustomerState = {
    cliente: null,
    loaded: false,
    loading: false,
    error: null,
    estado: '',
    mensaje: '',
};

const _customerReducer = createReducer(
    CustomerInitialState,
    on(createCustomer, (state, { customer }) => ({
        ...state,
        loading: true,
        cliente: customer
    })),

    on(createCustomerSuccess, (state, { estado, mensaje }) => ({
        ...state,
        loading: false,
        loaded: true,
        estado,
        mensaje
    })),

    on(createCustomerError, (state, { payload }) => ({
        ...state,
        loading: false,
        loaded: false,
        error: payload,
    })),

    on(createCustomerCloseMsg, (state) => ({
        ...state,
        loaded: false,
        loading: false,
        error: null
    })),

);


export function customerReducer(state, action) {
    return _customerReducer(state, action);
}
