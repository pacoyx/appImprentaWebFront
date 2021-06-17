import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { AppState } from 'src/app/store/app.reducers';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  uiSubscription: Subscription;
  usuarioSis: Usuario;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {

    this.uiSubscription = this.store.select('usuario').subscribe(resp => {
      this.usuarioSis = resp.user;
    });

  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

}
