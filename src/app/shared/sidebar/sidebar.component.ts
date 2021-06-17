import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { AppState } from 'src/app/store/app.reducers';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre: string;

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

  logout() { }
}
