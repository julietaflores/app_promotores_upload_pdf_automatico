import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NgOtpInputModule } from 'ng-otp-input';
import  { NotificacionesModule } from './pages/notificaciones/notificaciones.module'; 
import  { DetalleEstadoSolicitudModule } from './pages/detalle-estado-solicitud/detalle-estado-solicitud.module'; 
import  { RegistroFormulario2Module } from './pages/registro-formulario2/registro-formulario2.module'; 
import { registerLocaleData } from '@angular/common';
export function customTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    NgOtpInputModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: customTranslateLoader,
        deps: [HttpClient]
      }
    }),
    NotificacionesModule,
    DetalleEstadoSolicitudModule,
    RegistroFormulario2Module
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    InAppBrowser,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
