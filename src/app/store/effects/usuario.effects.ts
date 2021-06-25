import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as usuariosActions from '../actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class UsuarioEffects {

    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private router: Router) { }


    loginUsuario$ = createEffect(
        () => this.actions$.pipe(
            ofType(usuariosActions.loginUsuario),
            mergeMap(
                (action) => this.authService.loginUsuario(action.email, action.password)
                    .pipe(
                        tap(rex => {
                            localStorage.setItem('userImprenta', rex.data[0][0].nameUser);
                            console.log('desde el effects');
                        }),
                        map(user =>
                            usuariosActions.loginUsuarioSuccess({ usuario: user.data[0][0] })
                        ),
                        catchError(err => of(usuariosActions.cargarUsuarioError({ payload: err })))
                    )
            )
        )
    );

    loginNavigate$ = createEffect(
        () => this.actions$.pipe(
            ofType(usuariosActions.loginUsuarioSuccess),
            tap(() => {
                console.log('iniciando la navegacion');

                this.router.navigate(['/']);
            })
        ), { dispatch: false }
    );

}
