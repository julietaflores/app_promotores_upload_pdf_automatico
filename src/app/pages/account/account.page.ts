import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  constructor(
    public util: UtilService,
    public api: ApiService
  ) { }

  ngOnInit() {
  }

  desconectar() {


    console.log('desconectar');
    localStorage.removeItem('idusuario');
    localStorage.removeItem('USER_CODE');
    localStorage.removeItem('nombreusuario');
    localStorage.removeItem('totaldescuento');
    localStorage.removeItem('email');
    localStorage.removeItem('empleado_ventas');
    localStorage.removeItem('tipousuario');
    localStorage.removeItem('Descripcion');
    localStorage.removeItem('InicioEstado');
    localStorage.removeItem('JSON');
    localStorage.removeItem('data1');
    localStorage.removeItem('PDF_Cargado');
    localStorage.removeItem('numero_oferta');
    localStorage.removeItem('Lista_items_pdf');
    localStorage.removeItem('cliente_seleccionado');


    localStorage.removeItem('comentario');
    localStorage.removeItem('nombre_documento');
    localStorage.removeItem('Ultimaversion');
    localStorage.removeItem('tipo_venta_solicitud');
    localStorage.removeItem('tipo_venta_solicitud_detalle');
    localStorage.removeItem('Estadooo');

    
    this.util.navigateRoot('/login');


  }

  onLanguage() {
    this.util.navigateToPage('/languages');
  }

  onContact() {
    this.util.navigateToPage('/contact-us');
  }

  onOrders() {
    this.util.navigateRoot('/tabs/history');
  }

  onResetPassword() {
    this.util.navigateRoot('reset-password');
  }

  editProfile() {
    this.util.navigateToPage('edit-profile');
  }

  onChats() {
    this.util.navigateToPage('/chats');
  }

  logout() {
    this.util.show();
    this.api.post_private('v1/auth/logout', {}).then((data: any) => {
      console.log(data);
      this.util.hide();
      this.util.userInfo = null;
      localStorage.removeItem('uid');
      localStorage.removeItem('token');
      this.util.navigateRoot('/login');
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }

  openPage(title: any, id: any) {
    console.log(title, id);
    const param: NavigationExtras = {
      queryParams: {
        "name": this.util.translate(title),
        "id": id
      }
    };
    this.util.navigateToPage('app-pages', param);
  }

  Lista_notificaciones(){
    this.util.navigateToPage('/notificaciones');
  }
}
