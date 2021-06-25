import { createAction, props } from '@ngrx/store';
import { Customer } from '../../models/customer.model';

export const createCustomer = createAction(
    '[Customer] New Customers',
    props<{ customer: Customer }>()
);

export const createCustomerSuccess = createAction(
    '[Customer] New Customers Success',
    props<{ estado: string, mensaje: string }>()
);

export const createCustomerError = createAction(
    '[Customer] New Customers Error',
    props<{ payload: Error | any }>()
);

export const createCustomerCloseMsg = createAction(
    '[Customer] New Customers Close Alert Msg'
);
