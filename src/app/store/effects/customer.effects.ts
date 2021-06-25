import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as customerActions from '../actions/customer.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ClientesService } from '../../services/clientes.service';


@Injectable()
export class CustomerEffects {

    constructor(private actions$: Actions, private customerService: ClientesService) { }


    createCustomer$ = createEffect(
        () => this.actions$.pipe(
            ofType(customerActions.createCustomer),
            mergeMap(
                (varCustomer) => this.customerService.createClientes(varCustomer.customer)
                    .pipe(
                        // tap(rex => console.log('effects clientes::', rex)),
                        map((resp: any) => customerActions.createCustomerSuccess({ estado: resp.estado, mensaje: resp.message })),
                        catchError(err => of(customerActions.createCustomerError({ payload: err })))
                    )
            )
        )
    );


}