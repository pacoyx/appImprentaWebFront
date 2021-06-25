import { createAction, props } from '@ngrx/store';
import { Customer } from '../../models/customer.model';

export const cargarCustomers = createAction('[Customers] Cargar Customers');

export const cargarCustomersSuccess = createAction('[Customer] Cargar Customers Success',
    props<{ customers: Customer[] }>());

export const cargarCustomersError = createAction('[Customers] Cargar Customers Error',
    props<{ payload: any }>());
