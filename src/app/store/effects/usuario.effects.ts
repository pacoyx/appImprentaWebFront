import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as usuariosActions from '../actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { UsuarioService } from 'src/app/services/usuario.service';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class UsuarioEffects {

    constructor(
        private actions$: Actions,
        private usuarioService: UsuarioService,
        private authService: AuthService) {

    }


    loginUsuario$ = createEffect(
        () => this.actions$.pipe(
            ofType(usuariosActions.loginUsuario),
            mergeMap(
                (action) => this.authService.loginUsuario(action.email, action.password)
                    .pipe(
                        map(user => usuariosActions.loginUsuarioSuccess({ usuario: user.data[0][0] })),
                        catchError(err => of(usuariosActions.cargarUsuarioError({ payload: err })))
                    )
            )
        )
    );

}
