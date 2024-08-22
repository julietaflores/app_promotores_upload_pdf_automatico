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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-estado-solicitud',
  templateUrl: './detalle-estado-solicitud.component.html',
  styleUrls: ['./detalle-estado-solicitud.component.scss'],
})
export class DetalleEstadoSolicitudComponent  implements OnInit {
  id: any = 0;
  Codigo: any = '';
  n_oferta: any = '';
  armo_array:any ='';
  lista_detalle_sd: any[] = [];
  lista_estado_lista: any[] = [];
  infor_cliente: any[] = [];
  infor_items: any[] = [];
  url_pdf:any='';
  Estado_soli_j:any=0;
  text_area_mensaje: any = ''; 
  constructor( 
    public util: UtilService,
    public api: ApiService,
    public route: ActivatedRoute,
  ) 
    { 
 
      this.route.queryParams.subscribe((data: any) => {
        console.log(data);

      
        if (data && data.id && data.Codigo && data.n_oferta && data.Estado_soli) {
          this.id = data.id;
          this.Codigo=data.Codigo;
          this.n_oferta= data.n_oferta
  this.Estado_soli_j=data.Estado_soli;
          this.getOrderDetails();
        }
      });

    }

    ngOnInit() {
      moment.locale('es');
    }



    getOrderDetails() {
      console.log(this.id);
      this.armo_array='id='+this.id;
      console.log(this.armo_array);
      this.api.getDataParamentid("datos_sd_id",this.armo_array).then((data: any) => {
        if (data) {
        
          console.log(data);

          this.api.getDataParament("listar_estadol_solicitud1").then((datas: any) => {
            if (datas) {
              datas.forEach((elements: any) => {
                this.lista_estado_lista.push(elements);
              });
             
              data.forEach((element: any) => {
                console.log(element);
                this.infor_cliente= JSON.parse(element.lista_item_cliente_array||"[]");
                this.infor_items= JSON.parse(element.lista_item_descuento_array ||"[]");
                 element.codigo_cliente = this.infor_cliente[0].CardCode;
                 element.tipo_venta_cliente=this.infor_cliente[0].GroupNumb;
                 element.TipoVenta_solicitud=element.TipoVentaCliente==1?"CONTADO":"CREDITO";
                 element.FechaRegistro = moment(element.FechaRegistro).format('LL');
                 console.log(element.Estado);
                 element.color_estado= element.Estado==4 || element.Estado==1?"green" : element.Estado==2?"#ef4f1c":"red";


                 element.ruta_pdf=this.api.mediaURL+element.doc;
                 console.log(element.ruta_pdf);
                 this.url_pdf=element.ruta_pdf;

                 console.log(element);
                 console.log('lista estado '+JSON.stringify(this.lista_estado_lista));


                this.infor_items.forEach((element1: any) => {

                  console.log('ccccccccccc '+element1.Estado_Porcentaje);
                  console.log('ccccccccccc '+JSON.stringify(this.lista_estado_lista));
                   const userFound = this.lista_estado_lista.find(user =>  parseInt(user.Id) === parseInt(element1.Estado_Porcentaje) );
                   console.log(userFound.Detalle);
                   element1.detalle_estado=userFound.Detalle;
                   element1.estado_color_d= element1.Estado_Porcentaje==2?"green":"#ff5733";
                });

                 console.log(this.infor_items);
                 this.lista_detalle_sd.push(element);
              });
              console.log('lista sd '+JSON.stringify(this.lista_detalle_sd));


            }
          }, error => {
            console.log(error);
            this.lista_estado_lista = [];
            this.util.apiErrorHandler(error);
          }).catch((error: any) => {
            console.log(error);
            this.lista_estado_lista = [];
            this.util.apiErrorHandler(error);
          });







        }
      console.log('lista sd '+this.lista_detalle_sd);
      }, error => {
        console.log(error);
        this.lista_detalle_sd = [];
        this.util.apiErrorHandler(error);
      }).catch((error: any) => {
        console.log(error);
        this.lista_detalle_sd = [];
        this.util.apiErrorHandler(error);
      });
    }

    onBack() {
      this.util.onBack();
    }
}
