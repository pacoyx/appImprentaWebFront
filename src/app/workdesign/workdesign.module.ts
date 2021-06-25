import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkdesignRoutingModule } from './workdesign-routing.module';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientesComponent } from './clientes/clientes.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { RegserviciosComponent } from './regservicios/regservicios.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { TrinityRingsSpinnerModule } from 'angular-epic-spinners';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    ClientesComponent,
    UsuariosComponent,
    RegserviciosComponent
  ],
  imports: [
    CommonModule,
    WorkdesignRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    TrinityRingsSpinnerModule
  ]
})
export class WorkdesignModule { }
