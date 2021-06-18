import { createAction, props } from '@ngrx/store';
import { Usuario } from 'src/app/models/usuario.model';

export const cargarUsuario = createAction('[Usuario] Cargar Usuario',
    props<{ id: string }>());

export const cargarUsuarioSuccess = createAction('[Usuario] Cargar Usuario Success',
    props<{ usuario: Usuario }>());

export const cargarUsuarioError = createAction('[Usuario] Cargar Usuario Error',
    props<{ payload: any }>());


// login

export const loginUsuario = createAction('[LoginUsuario] Login Usuario',
    props<{ email: string, password: string }>());

export const loginUsuarioSuccess = createAction('[LoginUsuario] Login Usuario Success',
    props<{ usuario: Usuario }>());

export const loginUsuarioError = createAction('[LoginUsuario] Login Usuario Error',
    props<{ payload: any }>());

export const unSetUser = createAction('[LoginUsuario] unSetUser');
