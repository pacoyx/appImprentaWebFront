import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as customersActions from '../actions/customers.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ClientesService } from '../../services/clientes.service';


@Injectable()
export class CustomersEffects {

    constructor(private actions$: Actions, private customerService: ClientesService) { }


    cargarCustomers$ = createEffect(
        () => this.actions$.pipe(
            ofType(customersActions.cargarCustomers),
            mergeMap(
                () => this.customerService.getClientes()
                    .pipe(
                        // tap(rex => console.log('effects clientes::', rex)),
                        map(resp => customersActions.cargarCustomersSuccess({ customers: resp })),
                        catchError(err => of(customersActions.cargarCustomersError({ payload: err })))
                    )
            )
        )
    );


}
