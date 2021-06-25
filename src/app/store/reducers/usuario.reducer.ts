import { createReducer, on } from '@ngrx/store';
import { Usuario } from 'src/app/models/usuario.model';
import {
    cargarUsuario,
    cargarUsuarioSuccess,
    cargarUsuarioError,
    loginUsuario,
    loginUsuarioSuccess,
    loginUsuarioError,
    unSetUser,
    createCustomerCloseMsg,
    loginCloseMsg
} from '../actions';

export interface UsuarioState {
    id: string;
    user: Usuario;
    loaded: boolean;
    loading: boolean;
    error: any;
}

export const UsuarioInitialState: UsuarioState = {
    id: null,
    user: null,
    loaded: false,
    loading: false,
    error: null
};

const _usuarioReducer = createReducer(
    UsuarioInitialState,
    on(loginUsuario, (state, { email, password }) => ({ ...state, loading: true, email, password })),
    on(loginUsuarioSuccess, (state, { usuario }) => ({
        ...state,
        loading: false,
        loaded: true,
        user: { ...usuario }
    })),
    on(loginUsuarioError, (state, { payload }) => ({
        ...state,
        loading: false,
        loaded: false,
        error: {
            url: payload.url,
            name: payload.name,
            message: payload.message
        }
    })),

    on(unSetUser, (state) => ({ ...state, user: null })),


    on(cargarUsuario, (state, { id }) => ({ ...state, loading: true, id })),

    on(cargarUsuarioSuccess, (state, { usuario }) => ({
        ...state,
        loading: false,
        loaded: true,
        user: { ...usuario }
    })),

    on(cargarUsuarioError, (state, { payload }) => ({
        ...state,
        loading: false,
        loaded: false,
        error: {
            url: payload.url,
            name: payload.name,
            message: payload.message
        }
    })),

    on(loginCloseMsg, (state) => ({
        ...state,
        loaded: false,
        loading: false,
        error: null
    })),
);

export function usuarioReducer(state, action) {
    return _usuarioReducer(state, action);
}