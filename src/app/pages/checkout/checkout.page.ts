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

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  lista_clientes_X_promotor: any[] = [];
  armo_array:any ='';
  limit_cont:any=0;
  dummy: any[] = [];
  walletCheck: boolean = false;
  valor_buscar:any='';
  valo_cli:any='';
  constructor(
    public util: UtilService,
    public api: ApiService,
    private modalController: ModalController
  ) {
  }

  ngOnInit() {
    this.lista_clientes_X_promotor = [];
    moment.locale('es');
    this.getlista_clientes('', false);
  }

  getlista_clientes(event: any, haveRefresh: any) {
    console.log('nuevo cc 1 '+this.limit_cont);
    this.limit_cont=this.limit_cont+10;
    this.armo_array='id_empleado='+localStorage.getItem("empleado_ventas")+'&limit='+this.limit_cont+'&limitt=10&valor='+this.valor_buscar;
    console.log(this.armo_array);
    this.api.getDataParamentid("lista_cliente_x_promotor_servicio",this.armo_array).then((data: any) => {
      this.dummy = [];
      if (data) {
        const personaString = localStorage.getItem('cliente_seleccionado');
        this.valo_cli='';
        if (personaString) {
          const persona = JSON.parse(personaString);
          this.valo_cli=persona.CardCode;
        }
        data.forEach((element: any) => {
          element.CreateDate = moment(element.CreateDate).format('LL');
          element.tipo_venta= element.GroupNumb="-1"?"CREDITO":"CONTADO";
          element.seleccionado= element.CardCode==this.valo_cli?true:false;
          this.lista_clientes_X_promotor.push(element);
        });
      }
      if (haveRefresh) {
        event.target.complete();
      }
      console.log(this.lista_clientes_X_promotor);
    }, error => {
      console.log(error);
      this.dummy = [];
      this.lista_clientes_X_promotor = [];
      if (haveRefresh) {
        event.target.complete();
      }
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.dummy = [];
      this.lista_clientes_X_promotor = [];
      if (haveRefresh) {
        event.target.complete();
      }
      this.util.apiErrorHandler(error);
    });
  }


  doRefresh(event: any) {
    console.log('cargar '+event);
    this.getlista_clientes(event, true);
  }


  onSearchChange(events: any) {
     this.lista_clientes_X_promotor = [];
     this.limit_cont=0;
     this.valor_buscar='';
    if (events.value !== '') {
      console.log(events.detail.value);
      this.valor_buscar= events.detail.value;
      this.valor_buscar=this.valor_buscar.toUpperCase();
      console.log(this.valor_buscar);
      this.getlista_clientes('', false);
    } else {
      this.getlista_clientes('', false);
    }
  }


  onBack() {
    this.util.reloadComponent('');
  }

  onCheckboxChange(selectedItem: any) {
     this.lista_clientes_X_promotor.forEach(item => {
      if (item !== selectedItem) {
        item.seleccionado = false;
      }
    });
    selectedItem.seleccionado = !selectedItem.seleccionado;
    localStorage.setItem('cliente_seleccionado',JSON.stringify(selectedItem));
    console.log(localStorage.getItem('cliente_seleccionado'));
  }
}
