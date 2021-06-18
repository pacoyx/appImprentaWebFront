import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { AppState } from '../../store/app.reducers';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre: string;
  uiSubscription: Subscription;
  usuarioSis: Usuario;

  constructor(private store: Store<AppState>, private authServis: AuthService) { }

  ngOnInit(): void {
    this.uiSubscription = this.store.select('usuario').subscribe(resp => {
      this.usuarioSis = resp.user;
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  logout(): void {
    this.authServis.logout();
  }


}
