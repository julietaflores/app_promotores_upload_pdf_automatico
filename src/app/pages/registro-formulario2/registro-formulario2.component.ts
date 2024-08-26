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
import { HttpParams } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-registro-formulario2',
  templateUrl: './registro-formulario2.component.html',
  styleUrls: ['./registro-formulario2.component.scss'],
})
export class RegistroFormulario2Component  implements OnInit {
  mensajeError: any = '';
  valor:any='';
  lista_estado_lista: any[] = [];
  personaString:any='';
  persona:any;
  lista_itemss: any[] = [];
  lista_itemss_aux: any[] = [];
  lista_itemss_cliente: any[] = [];
  numero_documento: any=0;
  estt:any=0;
  ceros:any=0;

  hhh:any=0;

  validar_dd:any=0;
  isverificar: boolean = true;
  constructor( 
    public util: UtilService,
    public api: ApiService,
    public alertController: AlertController
  ) 
    { 
      this.personaString = localStorage.getItem('cliente_seleccionado');
      this.persona = JSON.parse(this.personaString);
      console.log('datos persom¿ba  '+JSON.stringify(this.persona));
      this.numero_documento= localStorage.getItem('numero_oferta')== undefined?0:localStorage.getItem('numero_oferta');
      console.log(this.numero_documento);
      this.lista_itemss=JSON.parse(localStorage.getItem("Lista_items_pdf")||"[]");
      console.log(this.lista_itemss);
      console.log(this.lista_itemss.sort((a, b) => a.numero - b.numero));
      this.lista_itemss=this.lista_itemss.sort((a, b) => a.numero - b.numero);
      console.log(this.lista_itemss);
      this.util.tipo_venta_solicitud= localStorage.getItem('tipo_venta_solicitud');
      this.util.tipo_venta_solicitud_detalle= localStorage.getItem('tipo_venta_solicitud_detalle');
      console.log(this.util.tipo_venta_solicitud);
      console.log(this.util.tipo_venta_solicitud_detalle);
      this.lista_estadoo();
      this.validar_array();
    }

  ngOnInit() {}




 
  async Registrar_solicitud(){

    this.util.show('Cargando');

 this.lista_itemss.forEach(objeto => {
    delete objeto.estado_color_dd;
  });
  console.log(this.lista_itemss);
  this.lista_itemss.forEach(objeto => {
    objeto.descripcion = "";
  });

this.lista_itemss_cliente=[];
this.lista_itemss_cliente.push(this.persona);


    console.log('ddd '+JSON.stringify(this.lista_itemss));
   this.lista_itemss_aux= this.lista_itemss;
   console.log('ddd 1 '+JSON.stringify(this.lista_itemss_aux));


    const eliminarCampo = (array: Array<{ [key: string]: any }>, campoAEliminar: string) => {
      return array.map(objeto => {
        const { [campoAEliminar]: eliminado, ...resto } = objeto;
        return resto;
      });
    };

    this.lista_itemss_aux = eliminarCampo(this.lista_itemss_aux, 'descripcion');
    this.lista_itemss_aux = eliminarCampo(this.lista_itemss_aux, 'cant');
    this.lista_itemss_aux = eliminarCampo(this.lista_itemss_aux, 'und');
    this.lista_itemss_aux = eliminarCampo(this.lista_itemss_aux, 'peso');
    this.lista_itemss_aux = eliminarCampo(this.lista_itemss_aux, 'precio');
    this.lista_itemss_aux = eliminarCampo(this.lista_itemss_aux, 'codigo');
    this.lista_itemss_aux = eliminarCampo(this.lista_itemss_aux, 'neto');
    this.lista_itemss_aux = eliminarCampo(this.lista_itemss_aux, 'total');
    this.lista_itemss_aux = eliminarCampo(this.lista_itemss_aux, 'estado_detalle_reso');
    this.lista_itemss_aux = eliminarCampo(this.lista_itemss_aux, 'max_descuento_servicio');
    this.lista_itemss_aux = eliminarCampo(this.lista_itemss_aux, 'porcetanje');
    console.log(this.lista_itemss_aux);


    this.validar_dd = this.lista_itemss.filter(objeto => objeto.Estado_Porcentaje === "1").length;
    console.log(this.validar_dd);

     this.hhh=this.validar_dd>0?2:4;
     localStorage.setItem('Estadooo',this.hhh);


    const a={
       nro_oferta_xmobile:this.numero_documento,
       comentario:localStorage.getItem("comentario"),
       lista_item_cliente_array:this.lista_itemss_cliente,
       doc:localStorage.getItem("nombre_documento")+'.pdf',
       user:localStorage.getItem("USER_CODE"),
       empleado_ventas:localStorage.getItem("empleado_ventas"),
       nombre_cliente:this.persona.CardName,
       estado_sp:this.validar_dd>0?2:4,
       nombre_promotor:localStorage.getItem("nombreusuario"),
       version_app:localStorage.getItem("Ultimaversion"),
       tipo_venta_cliente:localStorage.getItem('tipo_venta_solicitud'),
       lista_item_descuento_array:this.lista_itemss_aux
      }






    this.api.insert_datos_json("registrar_solicitud_descuento",a).then((datass: any) => {
      console.log("datos sd "+datass);
          
       const ffg= datass;
         if(ffg>0){
          this.Registrar_solicitud_2();
         }else{
          this.Registrar_solicitud_3();
         }
    },error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });



  }

  async Registrar_solicitud_3(){
    this.util.hide();

    const alert = await this.alertController.create({
      header: 'Registro Detalle',
      subHeader: 'Solicitud de Descuentos',
      message: 'Error en el Regsitro !!!',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
           
          }
        }
      ]
    });
  
    await alert.present();
   
     }




  async Registrar_solicitud_2(){

    this.util.hide();
    const alert = await this.alertController.create({
      header: 'Registro Detalle',
      subHeader: 'Solicitud de Descuentos',
      message: 'Proceso registrado correctamente',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
         
  
            localStorage.removeItem('PDF_Cargado');
            localStorage.removeItem('numero_oferta');
            localStorage.removeItem('Lista_items_pdf');
            localStorage.removeItem('cliente_seleccionado');
            localStorage.removeItem('comentario');
            localStorage.removeItem('nombre_documento');
            localStorage.removeItem('tipo_venta_solicitud');
            localStorage.removeItem('tipo_venta_solicitud_detalle');
            this.util.reloadComponent('');
          }
        }
      ]
    });
  
    await alert.present();
   
     }



  async Registrar_solicitud_1(){


    const alert = await this.alertController.create({
      header: 'Registro Detalle',
      subHeader: 'Solicitud de Descuentos',
      message: 'Esta seguro de guardar la Información?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Alerta cancelada');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            console.log('Nombre ingresado:');
            this.Registrar_solicitud();
          }
        }
      ]
    });
  
    await alert.present();
   
     }
   

  

  validar_array(){
    console.log('ultimo formato '+JSON.stringify(this.lista_itemss));
    this.ceros = this.lista_itemss.filter(objeto => objeto.Estado_Porcentaje === 0).length;
    console.log('Cantidad de ceros '+this.ceros);
    if(this.ceros==0){
         this.isverificar=false;
    }else{
         this.isverificar=true;
    }
  }


  onBack() {
    this.util.onBack();
  }

  lista_estadoo(){
    this.api.getDataParament("listar_estadol_solicitud1").then((datas: any) => {
      if (datas) {
        datas.forEach((elements: any) => {
          this.lista_estado_lista.push(elements);
        })
      //  console.log('lista estado '+JSON.stringify(this.lista_estado_lista));
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



  valii(event: any,items:any, indice:any) {
    console.log('lista estado 11 '+JSON.stringify(this.lista_estado_lista));
    let inputValue = event.target.value;
    console.log(inputValue);

    // Eliminar todos los caracteres no permitidos, permitiendo solo dígitos y un punto decimal
    inputValue = inputValue.replace(/[^0-9.]/g, '');
    // Verificar si el valor es menor a 0
    const numericValue = parseFloat(inputValue);
    if (numericValue < 0) {
      this.mensajeError = 'El número no puede ser menor a 0';
      this.util.showToast(this.mensajeError, 'danger', 'bottom');
      event.target.value = ''; // Limpiar el campo si es negativo
    }
    // Verificar si el número comienza con un cero no permitido
    else if (/^0[0-9]/.test(inputValue) && !/^0\./.test(inputValue)) {
      this.mensajeError = 'Los números no pueden comenzar con 0, a menos que sea decimal';
      this.util.showToast(this.mensajeError, 'danger', 'bottom');
      inputValue = inputValue.replace(/^0+/, ''); // Eliminar ceros no permitidos
    }
    // Verificar si hay más de un punto decimal
    else if ((inputValue.match(/\./g) || []).length > 1) {
      this.mensajeError = 'Solo se permite un punto decimal';
      this.util.showToast(this.mensajeError, 'danger', 'bottom');
      inputValue = inputValue.substring(0, inputValue.length - 1); // Eliminar el último carácter (punto adicional)
    }
    // Limpiar el mensaje de error si el valor es válido
    else {

      this.mensajeError = '';
      console.log('vacio');
  
    }




    this.valor = inputValue;
    event.target.value = inputValue;
    console.log('ggggggggggggg 11 '+this.valor);
 



    if (!this.valor || this.valor.trim() === '') {
      console.log('El valor está vacío');


      this.lista_itemss[indice].estado_detalle_reso='registrar descuento';
      this.lista_itemss[indice].Estado_Porcentaje=0;
      this.lista_itemss[indice].estado_color_dd='#05cedb';
      this.lista_itemss[indice].Porcentaje_base=0;
      console.log('ultimo formato '+JSON.stringify(this.lista_itemss));
      this.validar_array();
    } else {
      console.log('El valor no está vacío');
      console.log(items);

      const ffft =this.valor-items.max_descuento_servicio;
      console.log(ffft);
      if(ffft>0){
        this.estt=1;
        console.log('mayor al descuento maximo');
      }else{
        this.estt=2;
        console.log('menor al descuento maximo');
      }
      const userFound = this.lista_estado_lista.find(user =>  parseInt(user.Id) === this.estt );
      this.lista_itemss[indice].estado_detalle_reso=userFound.Detalle;
      this.lista_itemss[indice].Estado_Porcentaje=userFound.Id;
      this.lista_itemss[indice].estado_color_dd=this.lista_itemss[indice].Estado_Porcentaje==2?"green":"#ff5733";
      this.lista_itemss[indice].Porcentaje_base=this.valor;
      console.log('ultimo formato '+JSON.stringify(this.lista_itemss));
      this.validar_array();
    }






  }




}
