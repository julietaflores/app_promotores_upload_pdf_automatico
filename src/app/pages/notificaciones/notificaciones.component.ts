import { Component, OnInit} from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';
import { NavigationExtras } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController , Platform} from '@ionic/angular';
import { Filesystem, Directory,Encoding } from '@capacitor/filesystem';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { items_aux } from 'src/app/interfaces/items_aux';

import { PDFDocument } from 'pdf-lib';
import * as XLSX from 'xlsx';
import { ModalController } from '@ionic/angular';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss'],
})
export class NotificacionesComponent  implements OnInit {
  dummy: any[] = [];
  lista_notificaciones: any[] = [];
  limit_home:any=1;
  t_limit_home:any=0;
  armo_array:any ='';
  constructor(
    public util: UtilService,
    public api: ApiService,
    private modalController: ModalController
  ) {
  }

  ngOnInit() {
    moment.locale('es');
    this.getlista_notificaciones('', false);
  }

  getlista_notificaciones(event: any, haveRefresh: any) {

    const storedValue2 = localStorage.getItem('USER_CODE');
    const param = {
      usuario: storedValue2?.toString() ?? 'NA',
    }
    console.log(param);
    const params = new HttpParams({ fromObject:param || {} }).toString();
    console.log(params);
   
      this.api.getDataParamentid("actualizar_lognoti_user_new",params).then((data_f: any) => {

      
            this.api.getDataParamentid("listar_notificacion_x_usuario_cantidad",params).then((data: any) => { 
              console.log('cantidad_notif '+JSON.stringify(data));
              this.util.cantidad_notificaciones=(data[0].cantidad);
              console.log('cantidad_notif '+this.util.cantidad_notificaciones);
            });


            console.log('nuevo cc 1 '+this.limit_home);
            this.t_limit_home=this.limit_home*10;
            console.log('nuevo cc 2 '+this.t_limit_home);
            this.limit_home= this.limit_home+1;
            console.log('nuevo cc 3 '+this.limit_home);
            this.armo_array='usuario='+localStorage.getItem("USER_CODE")+'&limit='+this.t_limit_home+'&limitt=10';
            console.log(this.armo_array);
            this.api.getDataParamentid("listar_notificacion_x_usuario_new_v",this.armo_array).then((data: any) => {
              this.dummy = [];
              if (data) {
                console.log(data);
                data.forEach((element: any) => {
                  element.FechaRegistro = moment(element.FechaRegistro).format('LL');
                  this.lista_notificaciones.push(element);
                });
              }
              if (haveRefresh) {
                event.target.complete();
              }
            console.log(this.lista_notificaciones);
            }, error => {
              console.log(error);
              this.dummy = [];
              this.lista_notificaciones = [];
              if (haveRefresh) {
                event.target.complete();
              }
              this.util.apiErrorHandler(error);
            }).catch((error: any) => {
              console.log(error);
              this.dummy = [];
              this.lista_notificaciones = [];
              if (haveRefresh) {
                event.target.complete();
              }
              this.util.apiErrorHandler(error);
            });


       

      });


    



  }


  doRefresh(event: any) {
    console.log('cargar '+event);
    this.getlista_notificaciones(event, true);
  }

  onBack() {
    this.util.onBack();
  }


}
