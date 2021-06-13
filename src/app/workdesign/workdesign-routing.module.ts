import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './clientes/clientes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { RegserviciosComponent } from './regservicios/regservicios.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

const routes: Routes = [{
  path: '', component: HomeComponent,
  children: [
    { path: '', component: DashboardComponent },
    { path: 'servicios', component: RegserviciosComponent },
    { path: 'clientes', component: ClientesComponent },
    { path: 'usuarios', component: UsuariosComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkdesignRoutingModule { }
