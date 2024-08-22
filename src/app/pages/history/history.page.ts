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
import { validar_form1 } from 'src/app/interfaces/validar_form1';
import { PDFDocument } from 'pdf-lib';
import * as XLSX from 'xlsx';
import { ViewChild, ElementRef } from '@angular/core';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef<HTMLInputElement>;
  items_auxx: items_aux = { numero: '', codigo: '', descripcion: '' , und: '', cant: '', precio: '', porcetanje: '', neto: '', total: '', peso: ''};
  validar_formm:validar_form1 = { pdf_cargado: false, codigo_cliente: false};
  PDF_CARGADO:any=0;
  t_limit_home:any=0;
  limit_t:any=10;
  limit_home:any=1;
  armo_array:any ='';
  currentId: any = 'new';
  text_area_mensaje: any = ''; 
  usuario: any='';
  tipo_usuario:any=0;
  items_estado:any[] = [];
  items_tipo_venta_lo:any[] = [];
  cargo_usuario: any='';
  dummy: any[] = [];
  newOrders: any[] = [];
  oldOrders: any[] = [];
 numero_documento: any=0;
  lista_items_aux: any[] = [];
  lista_items_aux_new_v: any[] = [];
  personaString:any='';
  persona:any;
  selectedFruit:any='2';
  cover: any = '';
  isverificar: boolean = true;
  selectedFile: any;
  lista_estado_lista: any[] = [];
  constructor(
    public util: UtilService,
    public api: ApiService,
    private actionSheetController: ActionSheetController,
  ) {
  
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    this.util.retriveChanges().subscribe(() => {
      this.dummy = Array(15);
    })

  }




  ngOnInit() {

 //  localStorage.setItem('Estadooo','4');

    this.selectedFruit= localStorage.getItem('Estadooo')== undefined?'2':localStorage.getItem('Estadooo');

    this.lista_estadoo();

    this.newOrders = [];
    moment.locale('es');
    this.personaString = localStorage.getItem('cliente_seleccionado');
    this.persona = JSON.parse(this.personaString);
    console.log(this.persona);
    if(this.persona){
      this.currentId='old';

      this.text_area_mensaje=localStorage.getItem('comentario')== undefined?'sin comentario':localStorage.getItem('comentario');

      this.lista_items_aux=JSON.parse(localStorage.getItem('Lista_items_pdf')||"[]");
      console.log('lista push objeto 4 nueva version arriba '+localStorage.getItem('Lista_items_pdf'));

//lista push objeto 4 nueva version

      console.log('vasiolna ' +JSON.stringify(this.lista_items_aux));
      this.validar_formm.pdf_cargado=this.lista_items_aux.length>0?true:false;
      this.validar_formm.codigo_cliente=true;
      console.log('vali formulario '+JSON.stringify(this.validar_formm));

      this.isverificar= Object.values(this.validar_formm).every(value => value === true);
      this.isverificar=!this.isverificar;
      console.log('vali formulario '+this.isverificar);






      this.lista_tipo_venta();
      this.cargar_max_descuento();



    }

    this.PDF_CARGADO= localStorage.getItem('PDF_Cargado')== undefined?0:localStorage.getItem('PDF_Cargado');
    this.numero_documento= localStorage.getItem('numero_oferta')== undefined?0:localStorage.getItem('numero_oferta');
    console.log('numero de documento '+this.numero_documento);
    console.log('pdf cargado '+this.PDF_CARGADO);
    this.usuario=  localStorage.getItem('nombreusuario');
    this.cargo_usuario= localStorage.getItem('Descripcion');
    this.tipo_usuario=localStorage.getItem('tipousuario');
    console.log(this.cargo_usuario);
    this.lista_estados();
    this.getOrders1('', false);
  }


  onSelectChange_tv(event: any) {
    console.log('Selected tv:', this.util.tipo_venta_solicitud); // Logs the selected value
    console.log(JSON.stringify(this.items_tipo_venta_lo));
     const userFound = this.items_tipo_venta_lo.find(user =>  parseInt(user.Id) === parseInt(this.util.tipo_venta_solicitud) );
     this.util.tipo_venta_solicitud_detalle=userFound.Detalle;

     localStorage.setItem('tipo_venta_solicitud', this.util.tipo_venta_solicitud);
     localStorage.setItem('tipo_venta_solicitud_detalle', this.util.tipo_venta_solicitud_detalle);
     console.log(userFound.Detalle);
  }

  onSelectChange(event: any) {
    console.log('Selected:', this.selectedFruit); // Logs the selected value
    this.newOrders = [];
    this.limit_home=1;
    this.getOrders1('', false);
  }

  doRefresh(event: any) {
    console.log('cargar '+event);
    this.getOrders1(event, true);
  }

  getOrders1(event: any, haveRefresh: any) {
    console.log('nuevo cc 1 '+this.limit_home);
    console.log('nuevo cc 2 '+this.limit_t);
    this.t_limit_home=this.limit_home*this.limit_t;
    console.log('nuevo cc 3 '+this.t_limit_home);
    this.limit_home= this.limit_home+1;
    console.log('nuevo cc 4 '+this.limit_home);
     this.armo_array='estado='+this.selectedFruit+'&tipoempleado='+localStorage.getItem("tipousuario")+'&promotor='+localStorage.getItem("empleado_ventas")+'&limit='+this.t_limit_home+'&limitt='+this.limit_t+'&valor=&user='+localStorage.getItem("USER_CODE");
    console.log(this.armo_array);
    this.api.getDataParamentid("estado_lectura_new_v",this.armo_array).then((data: any) => {
      this.dummy = [];
      if (data) {
        console.log('antiguo order '+this.newOrders);
        data.forEach((element: any) => {
          element.FechaRegistro = moment(element.FechaRegistro).format('LL');
          this.newOrders.push(element);
        });
      }
      if (haveRefresh) {
        event.target.complete();
      }
      console.log(this.newOrders);
    }, error => {
      console.log(error);
      this.dummy = [];
      this.newOrders = [];
      if (haveRefresh) {
        event.target.complete();
      }
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.dummy = [];
      this.newOrders = [];
      if (haveRefresh) {
        event.target.complete();
      }
      this.util.apiErrorHandler(error);
    });
  }

  openDetails(items: any) {

    console.log(items);
    const param: NavigationExtras = {
      queryParams: {
        "id": items.Id,
        "Codigo": items.Codigo,
        "n_oferta":items.nro_oferta_xmobile,
        "Estado_soli":this.selectedFruit
      }
    };
    this.util.navigateToPage('detalle-estado-solicitud', param);
  }


  segmentChanged(event: any) {

  }
  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  

  lista_estados(){
    this.api.getDataParament("listar_estadol1").then((data: any) => {
       if (data.length>0) {
        this.items_estado=data;
       } else if (data.length==0) {
         this.util.errorToast(this.util.translate('Access denied'), 'danger');
       } else {
         this.util.errorToast(this.util.translate('Something went wrong'), 'danger');
       }
    }, error => {
      console.log('Error', error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log('Err', error);
      this.util.apiErrorHandler(error);
    });
  }



  lista_tipo_venta(){
    this.api.getDataParament("listar_estado_tipo_venta").then((data: any) => {
       if (data.length>0) {
        this.items_tipo_venta_lo=data;
        const userFound = this.items_tipo_venta_lo.find(user =>  parseInt(user.Id) === parseInt(this.util.tipo_venta_solicitud) );
        this.util.tipo_venta_solicitud_detalle=userFound.Detalle;

        localStorage.setItem('tipo_venta_solicitud', this.util.tipo_venta_solicitud);
        localStorage.setItem('tipo_venta_solicitud_detalle', this.util.tipo_venta_solicitud_detalle);


        console.log(userFound.Detalle);
       } else if (data.length==0) {
         this.util.errorToast(this.util.translate('Access denied'), 'danger');
       } else {
         this.util.errorToast(this.util.translate('Something went wrong'), 'danger');
       }
    }, error => {
      console.log('Error', error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log('Err', error);
      this.util.apiErrorHandler(error);
    });

  }



  async updateProfile() {
    const actionSheet = await this.actionSheetController.create({
      header: this.util.translate('Opciones de PDF'),
      buttons: [{
        text: this.util.translate('Abrir PDF'),
        icon: 'document',
        handler: () => {
         // this.userInputElement.click();
        }
      }, {
        text: this.util.translate('Cancel'),
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }





  triggerFileInput() {
  if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }


  
  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
          const file = input.files[0];
        //  alert(input.files.length);
          console.log('Selected file:', file);

          if (file) {
            this.fileToBase64(file).then(base64String => {
              console.log('Base64 String:', base64String);
              this.util.show('Cargando');
              this.processPdfBase64(base64String);
            }).catch(error => {
              console.error('Error converting file to Base64:', error);
            });
          }

      }
  }




  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        // Convert the result to Base64 string
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }




  async uploadPDF(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        source,
        quality: 50,
        resultType: CameraResultType.DataUrl,
      });
      console.log('image output', image);
      const pdfBase644 = image.dataUrl;
      console.log('Imagen capturada:', pdfBase644);
      const pdfBase64: string | undefined = image.dataUrl; // Asigna tu base64 aquí
      this.processPdfBase64(pdfBase64);
    } catch (error) {
      console.log(error);
      alert(error);
      this.util.apiErrorHandler(error);
    }
  }





   processPdfBase64(pdfBase64: string | undefined) {
    if (pdfBase64) {
      try {
        if (pdfBase64) {
          const binaryString = atob(pdfBase64);
          const arrayBuffer = new ArrayBuffer(binaryString.length);
          const uint8Array = new Uint8Array(arrayBuffer);
          for (let i = 0; i < binaryString.length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([uint8Array], { type: 'application/pdf' });
            this.api.uploadfilee('uploadArchivo_new_v',blob).then((data_pdf) => {

              console.log('image upload', data_pdf);
              localStorage.setItem("nombre_documento",data_pdf.nombre_archivo );
            
              this.util.showToast(this.util.translate(data_pdf.message), data_pdf.status, 'bottom');
              this.PDF_CARGADO=1;
              localStorage.setItem('PDF_Cargado',this.PDF_CARGADO);
              this.lista_items_aux=[];
              localStorage.setItem('Lista_items_pdf',JSON.stringify(this.lista_items_aux));

               console.log('julieta  flores 1 '+JSON.stringify(localStorage.getItem('Lista_items_pdf')));


              this.extraer_table(blob);
            }, error => {
              console.log(error);
              this.util.hide();
              this.util.apiErrorHandler(error);
            }).catch(error => {
              console.log('error', error);
              this.util.hide();
              this.util.apiErrorHandler(error);
            });
          console.log('PDF cargado exitosamente.');
        } else {
          console.error('No se pudo extraer datos base64 del PDF.');
        }
      } catch (error) {
        console.error('Error al procesar pdfBase64:', error);
      }
    } else {
      console.error('pdfBase64 es undefined o vacío.');
    }
  }


  async extraer_table(pdfBlob: Blob) {
   await this.extractTextFromPdf_informacion(pdfBlob);
  }


  async  extractTextFromPdf_informacion(pdfBlob: Blob): Promise<void> {
    const pdfArrayBuffer = await pdfBlob.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: pdfArrayBuffer }).promise;
    const numPages = pdf.numPages;
    for (let pageIndex = 1; pageIndex <= numPages; pageIndex++) {
      const page = await pdf.getPage(pageIndex);
      const content = await page.getTextContent();

      const filteredData_doc = content.items.filter((person : any) => person.width >0  && person.height== 10);
      const filteredData_doc1 = filteredData_doc.splice(1, 1); // Elimina el objeto en el índice 2
      filteredData_doc1.forEach((element: any,index:any) => {
        var campo = element.str;
        console.log('vv '+campo);
        var textoSinEspacios = campo.replace(/\s+/g, '');
        console.log(textoSinEspacios); // Imprime: "Hola,TypeScript!"
        var subcadena = textoSinEspacios.substring(5); // Empieza desde el índice 5 hasta el final
        console.log(subcadena); // Imprime: "TypeScript!"
        var textoSinBarras = subcadena.replace(/\//g, '');
        console.log(textoSinBarras); // Imprime: "Hola,TypeScript!"
        textoSinBarras = textoSinBarras.replace(/\-/g, '');
        console.log(textoSinBarras); // Imprime: "Hola,TypeScript!"
        textoSinBarras = textoSinBarras.replace(/\:/g, '');
        console.log(textoSinBarras); // Imprime: "Hola,TypeScript!"
        var textoSinNumerosFinales = textoSinBarras.replace(/\d+$/, '');
        console.log(textoSinNumerosFinales); // Imprime: "Hola"
        var textoSinLetrasFinales = textoSinNumerosFinales.replace(/[a-zA-Z]+$/, '');
        console.log(textoSinLetrasFinales); // Imprime: "12345"
        textoSinNumerosFinales = textoSinLetrasFinales.replace(/\d+$/, '');
        console.log(textoSinNumerosFinales); // Imprime: "Hola"
        textoSinLetrasFinales = textoSinNumerosFinales.replace(/[a-zA-Z]+$/, '');
        console.log('dd '+textoSinLetrasFinales); // Imprime: "12345"
        this.numero_documento=parseInt(textoSinLetrasFinales);
        console.log('dd1  '+this.numero_documento); // Imprime: "12345"
        localStorage.setItem('numero_oferta', this.numero_documento);
      });

      const filteredData = content.items.filter((person : any) => person.width >0   && person.height== 8);
      console.log(filteredData);
      const filteredArray1 = filteredData.splice(2, filteredData.length); // Elimina el objeto en el índice 2
      console.log(filteredArray1);
      this.lista_items_aux= [];
      this.lista_items_aux_new_v=[];
      var cor=0;
      var ff='';
      filteredArray1.forEach((element: any,index:any) => {
        console.log(element);
        console.log(index);
        let variable: any = element.str;
        if(element.hasEOL==true){
            ff=ff+' '+element.str;
        }else{
          if(ff===''){
            switch (cor) {
              case 0:
                this.items_auxx.numero=element.str;
                cor++;
                break;
              case 1:
                this.items_auxx.codigo=element.str;
                cor++;
                break;
              case 2:
                this.items_auxx.descripcion=element.str;
                cor++;
                break;
              case 3:
                this.items_auxx.und=element.str;
                cor++;
                break;
              case 4:
                this.items_auxx.cant=element.str;
                cor++;
                break;
              case 5:
                this.items_auxx.precio=element.str;
                cor++;
                break;
              case 6:
                this.items_auxx.porcetanje=element.str;
                cor++;
                break;
              case 7:
                this.items_auxx.neto=element.str;
                cor++;
                break;
              case 8:
                this.items_auxx.total=element.str;
                cor++;
                break;
              case 9:
                this.items_auxx.peso=element.str;
                cor=0;
                console.log('julieta  flores 1 '+JSON.stringify(this.items_auxx));
                this.lista_items_aux.push(this.items_auxx);
                console.log('julieta  flores 1 '+JSON.stringify(this.lista_items_aux));
                this.items_auxx= { numero: '', codigo: '' , descripcion: '' , und: '', cant: '', precio: '', porcetanje: '', neto: '', total: '', peso: ''};
                break;
            }
          }else{
            switch (cor) {
              case 0:
                this.items_auxx.numero=ff;
                ff='';
                cor++;
                break;
              case 1:
                this.items_auxx.codigo=ff;
                ff='';
                cor++;
                break;
              case 2:
                this.items_auxx.descripcion=ff;
                ff='';
                cor++;
                break;
              case 3:
                this.items_auxx.und=ff;
                ff='';
                cor++;
                break;
              case 4:
                this.items_auxx.cant=ff;
                ff='';
                cor++;
                break;
              case 5:
                this.items_auxx.precio=ff;
                ff='';
                cor++;
                break;
              case 6:
                this.items_auxx.porcetanje=ff;
                ff='';
                cor++;
                break;
              case 7:
                this.items_auxx.neto=ff;
                ff='';
                cor++;
                break;
              case 8:
                this.items_auxx.total=ff;
                ff='';
                cor++;
                break;
              case 9:
                this.items_auxx.peso=ff;
                ff='';
                cor=0;
                console.log('julieta  flores 1 '+JSON.stringify(this.items_auxx));
                this.lista_items_aux.push(this.items_auxx);
                console.log('julieta  flores 1 '+JSON.stringify(this.lista_items_aux));
                this.items_auxx= { numero: '', codigo: '' , descripcion: '' , und: '', cant: '', precio: '', porcetanje: '', neto: '', total: '', peso: ''};
                break;
               
            }
  

          
            switch (cor) {
              case 0:
                this.items_auxx.numero=element.str;
                cor++;
                break;
              case 1:
                this.items_auxx.codigo=element.str;
                cor++;
                break;
              case 2:
                this.items_auxx.descripcion=element.str;
                cor++;
                break;
              case 3:
                this.items_auxx.und=element.str;
                cor++;
                break;
              case 4:
                this.items_auxx.cant=element.str;
                cor++;
                break;
              case 5:
                this.items_auxx.precio=element.str;
                cor++;
                break;
              case 6:
                this.items_auxx.porcetanje=element.str;
                cor++;
                break;
              case 7:
                this.items_auxx.neto=element.str;
                cor++;
                break;
              case 8:
                this.items_auxx.total=element.str;
                cor++;
                break;
              case 9:
                this.items_auxx.peso=element.str;
                cor=0;
                console.log('julieta  flores 1 '+JSON.stringify(this.items_auxx));
                this.lista_items_aux.push(this.items_auxx);
                console.log('julieta  flores 1 '+JSON.stringify(this.lista_items_aux));
                this.items_auxx= { numero: '', codigo: '' , descripcion: '' , und: '', cant: '', precio: '', porcetanje: '', neto: '', total: '', peso: ''};
                break;
            }

          }
        }

      });

      console.log('julieta  flores 1 '+JSON.stringify(this.lista_items_aux));
      localStorage.setItem('Lista_items_pdf',JSON.stringify(this.lista_items_aux));
      console.log('julieta  flores 1 '+localStorage.getItem('Lista_items_pdf'));
      


    
  

      this.validar_formm.pdf_cargado=this.lista_items_aux.length>0?true:false;
      this.validar_formm.codigo_cliente=localStorage.getItem('cliente_seleccionado')== undefined?false:true;
      console.log('vali formulario 111 '+JSON.stringify(this.validar_formm));
      

      this.isverificar= Object.values(this.validar_formm).every(value => value === true);
      this.isverificar=!this.isverificar;
      console.log('vali formulario 1111 '+this.isverificar);
    
      this.cargar_max_descuento();
      this.util.hide();

      
    }
  }




  cargar_max_descuento(){

    console.log('ccccccccccccccccccccc');
    console.log('ccccccccccccccccccccc'+JSON.stringify(this.validar_formm));


    if(this.validar_formm.codigo_cliente && this.validar_formm.pdf_cargado){
    this.lista_items_aux=JSON.parse(localStorage.getItem("Lista_items_pdf")||"[]");
    this.personaString = localStorage.getItem('cliente_seleccionado');
    this.persona = JSON.parse(this.personaString);
    console.log('ggg '+JSON.stringify(this.lista_items_aux));
    console.log(this.persona.CardCode);


      this.lista_items_aux.forEach((elementt: any) => {
      console.log('ccccccccccccccccccccc '+elementt.codigo);
      const storedValue1 = this.persona.CardCode;
      const storedValue2 = elementt.codigo;
      const storedValue3 = elementt.cant;
      const param = {
        cliente: storedValue1?.toString() ??'NA',
        item: storedValue2?.toString() ?? 'NA',
        cantidad:storedValue3?.toString() ?? 'NA',
      }
      console.log(param);
      const params = new HttpParams({ fromObject:param || {} }).toString();
      console.log('ccccccccccccccccccccc '+params);
      this.api.getDataParamentid("sacar_max_descuento",params).then((data_d: any) => {
        if (data_d.length>0) {
           console.log(data_d[0].U_MAXDescuento);


           console.log('lista estado 11 '+JSON.stringify(this.lista_estado_lista));

           const userFound1 = this.lista_estado_lista.find(user =>  parseInt(user.Id) === 2 );
     



           elementt.max_descuento_servicio= data_d[0].U_MAXDescuento;
           elementt.estado_detalle_reso= userFound1.Detalle;
           elementt.Estado_Porcentaje= 2;
           elementt.estado_color_dd='green';
           elementt.Porcentaje_base=0;
           elementt.ItemCode=elementt.codigo;
           elementt.ItemName='';
           elementt.SalUnitMsr=elementt.und;
           elementt.U_MaxDescuento=data_d[0].U_MAXDescuento;
           elementt.Cantidad_base=elementt.cant;
           this.lista_items_aux_new_v.push(elementt);
           console.log('lista new v '+JSON.stringify(this.lista_items_aux_new_v));
           localStorage.setItem('Lista_items_pdf',JSON.stringify(this.lista_items_aux_new_v));
           console.log('lista push objeto 4 nueva version '+localStorage.getItem('Lista_items_pdf'));


          

           this.validar_formm.pdf_cargado=this.lista_items_aux_new_v.length>0?true:false;
           this.validar_formm.codigo_cliente=localStorage.getItem('cliente_seleccionado')== undefined?false:true;
           console.log('vali formulario 11111 '+JSON.stringify(this.validar_formm));
           
       
           this.isverificar= Object.values(this.validar_formm).every(value => value === true);
           this.isverificar=!this.isverificar;
           console.log('vali formulario 111111 '+this.isverificar);
       
       
       
       


        } else if (data_d.length==0) {
          this.util.errorToast(this.util.translate('Access denied'), 'danger');
        } else {
          this.util.errorToast(this.util.translate('Something went wrong'), 'danger');
        }
      }, error => {
       console.log('Error', error);
       this.util.apiErrorHandler(error);
      }).catch(error => {
       console.log('Err', error);
       this.util.apiErrorHandler(error);
      });
      });


    }

   

  }



  lista_estadoo(){
    this.api.getDataParament("listar_estadol_solicitud1").then((datas: any) => {
      if (datas) {
        datas.forEach((elements: any) => {
          this.lista_estado_lista.push(elements);
        })
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


  async  processPdfBlobToExcel(pdfBlob: Blob) {
    const textContent: string[] = await this.extractTextFromPdf(pdfBlob);
    // const tableData = this.convertTextToCells(textContent);
    // console.log(tableData);
    // this.generateExcelFileh(tableData, 'output.xlsx');
  }
 
  async  extractTextFromPdf(pdfBlob: Blob): Promise<string[]> {
    const pdfArrayBuffer = await pdfBlob.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: pdfArrayBuffer }).promise;
    const numPages = pdf.numPages;
    console.log(numPages);
    const textContent: string[] = [];
    for (let pageIndex = 1; pageIndex <= numPages; pageIndex++) {
      const page = await pdf.getPage(pageIndex);
      console.log('vali 1 '+page);
      const content = await page.getTextContent();
      console.log('vali 2 '+JSON.stringify(content));
   
      const filteredData = content.items.filter((person : any) => person.width > 0 && person.height== 8);
      console.log(filteredData);

     const filteredArray = filteredData.splice(2, filteredData.length); // Elimina el objeto en el índice 2
     console.log(filteredArray);

      // console.log(filteredArray[1]);
 

      // const pageText = content.items.map((item: any) => item.str).join(' ');
      // console.log('vali 3 '+pageText);
    //  textContent.push(pageText);
    }
    return textContent;
  }


  convertTextToCells(textContent: string[]): string[][][] {
    return textContent.map(pageText => {
      // Suponiendo que las filas están separadas por saltos de línea y las celdas por espacios
      return pageText.split('\n').map(line => 
        line.split(/\s+/) // Divide las celdas por espacios o tabulaciones
      );
    });
  }

  generateExcelFileh(cellsData: string[][][], fileName: string) {
    const wb = XLSX.utils.book_new();
    cellsData.forEach((tableData, index) => {
      const ws = XLSX.utils.aoa_to_sheet(tableData);
      XLSX.utils.book_append_sheet(wb, ws, `Sheet${index + 1}`);
    });
    XLSX.writeFile(wb, fileName);
  }
  convertTextToTable(textContent: string[]): any[][] {
    return textContent.map(pageText => 
      pageText.split('\n').map(line => 
        line.split(/\s+/) // Divide las columnas por espacios o tabulaciones
      )
    ).flat();
  }

  generateExcelFile(data: any[][], fileName: string) {
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
  }






  Lista_Cliente_X_promotor() {
    this.util.navigateToPage('/checkout');
  }

  

  Verificar_solicitud(){
    console.log(this.text_area_mensaje);
    localStorage.setItem('comentario',this.text_area_mensaje);
    this.util.navigateToPage('/registro-formulario2');
  }
  
}
