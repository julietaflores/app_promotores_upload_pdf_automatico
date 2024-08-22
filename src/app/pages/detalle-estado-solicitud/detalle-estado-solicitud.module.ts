import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalleEstadoSolicitudComponent } from './detalle-estado-solicitud.component';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
    {
      path: '',
      component: DetalleEstadoSolicitudComponent
    }
  ];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,  // Import IonicModule here
    RouterModule.forChild(routes) // Configura el enrutamiento para este módulo
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Añadir CUSTOM_ELEMENTS_SCHEMA aquí
  declarations: [DetalleEstadoSolicitudComponent]
})
export class DetalleEstadoSolicitudModule {}
