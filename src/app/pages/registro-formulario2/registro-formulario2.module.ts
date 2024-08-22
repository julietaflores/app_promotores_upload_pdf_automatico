import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroFormulario2Component } from './registro-formulario2.component';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
const routes: Routes = [
    {
      path: '',
      component: RegistroFormulario2Component
    }
  ];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,  // Import IonicModule here
    RouterModule.forChild(routes) // Configura el enrutamiento para este módulo
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Añadir CUSTOM_ELEMENTS_SCHEMA aquí
  declarations: [RegistroFormulario2Component]
})
export class RegistroFormulario2Module {}
