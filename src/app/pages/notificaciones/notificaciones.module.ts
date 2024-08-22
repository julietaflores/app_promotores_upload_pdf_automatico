import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionesComponent } from './notificaciones.component';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';



const routes: Routes = [
    {
      path: '',
      component: NotificacionesComponent
    }
  ];

@NgModule({


  imports: [
    CommonModule,
    IonicModule,  // Import IonicModule here
    RouterModule.forChild(routes) // Configura el enrutamiento para este módulo
  ],
  exports: [RouterModule],

  declarations: [NotificacionesComponent]
})
export class NotificacionesModule {}
