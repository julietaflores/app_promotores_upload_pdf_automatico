import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { login } from 'src/app/interfaces/login';
import { mobile } from 'src/app/interfaces/mobile';
import { mobileLogin } from 'src/app/interfaces/mobileLogin';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { VerifyPage } from '../verify/verify.page';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ModalController } from '@ionic/angular';
import { SelectCountryPage } from '../select-country/select-country.page';
import { TranslateService } from '@ngx-translate/core';
import { App } from '@capacitor/app';
import { HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  login: login = { usuario: '', password: '' };
  mobileLogin: mobile = { country_code: '', mobile: '', password: '' };
  mobileOTPLogin: mobileLogin = { country_code: '', mobile: '' };
  submitted = false;
  isLogin: boolean = false;
  viewPassword: boolean = false;
  armo_array:any ='';
  selectedLanguages: any = 'es';
  appVersion: any='';
  constructor(
    public util: UtilService,
    public api: ApiService,
    private chMod: ChangeDetectorRef,
    private modalController: ModalController,
    private iab: InAppBrowser,
    private translate: TranslateService,
  ) {
    this.selectedLanguages = localStorage.getItem('selectedLanguage');
    setTimeout(() => {
      console.log('cc '+ this.selectedLanguages);
    }, 1000);
  }


  ngOnInit() {
  }

  onRegister() {
    this.util.navigateRoot('register');
  }

  resetPassword() {
    this.util.navigateRoot('reset-password');
  }

  changeType() {
    this.viewPassword = !this.viewPassword;
  }

  onSocial() {

  }

  onLogin(form: NgForm) {


  
    console.log('form', form);
    this.submitted = true;
    this.chMod.detectChanges();
    if (form.valid) {

      console.log('login');
      this.isLogin = true;


      this.armo_array='user='+this.login.usuario+'&pase='+this.login.password;
   
      this.api.getDataParamentid("login_aa",this.armo_array).then((data: any) => {
        this.isLogin = false;
        console.log(data);
        console.log(data.length);
    

        if (data.length>0) {

           this.api.getDataParament("ultima_version_app").then((data2: any) => {
            this.appVersion=data2;
            localStorage.setItem('Ultimaversion',this.appVersion);
            localStorage.setItem('idusuario', data[0].idusuario);
            localStorage.setItem('USER_CODE', data[0].USER_CODE);
            localStorage.setItem('nombreusuario', data[0].nombreusuario);
            localStorage.setItem('totaldescuento', data[0].totaldescuento);
            localStorage.setItem('email', data[0].email);
            localStorage.setItem('empleado_ventas', data[0].empleado_ventas);
            localStorage.setItem('tipousuario', data[0].tipousuario);
            localStorage.setItem('Descripcion', data[0].Descripcion);
            localStorage.setItem('InicioEstado', data[0].InicioEstado);
            localStorage.setItem('JSON', data[0].JSON);
            localStorage.setItem('data1', data[0].data1);
            this.updateFCMToken();
            this.util.navigateRoot('');

           });

      
        } else if (data.length==0) {
          this.util.errorToast(this.util.translate('Access denied'), 'danger');
        } else {
          this.util.errorToast(this.util.translate('Something went wrong'), 'danger');
         
        }


      }, error => {
        this.isLogin = false;
        console.log('Error', error);
      
        this.util.apiErrorHandler(error);
      }).catch(error => {
        this.isLogin = false;
        console.log('Err', error);
     
        this.util.apiErrorHandler(error);
      });
    }


  }



  async  updateFCMToken() {
    // const info = await App.getInfo();
   //  this.appVersion = info.version; // Obtén la versión de la aplicación
     const storedValue1 = localStorage.getItem('idusuario');
     const storedValue2 = localStorage.getItem('USER_CODE');
     const storedValue3 = localStorage.getItem('data1');
     const storedValue4 = localStorage.getItem('pushToken');
 
     const param = {
       id: storedValue1?.toString() ?? 0,
       usuario: storedValue2?.toString() ?? 'NA',
       token_acceso:storedValue3?.toString() ?? 'NA',
       fcm_token: storedValue4?.toString() ?? 'NA',
       version:this.appVersion 
     }
     console.log(param);
     const params = new HttpParams({ fromObject:param || {} }).toString();
     console.log(params);
     this.api.getDataParamentid("actualizar_token",params).then((data: any) => {
       console.log(data);
       if(data>0){
        this.util.showToast('Bienvenid@, '+localStorage.getItem('nombreusuario'), 'success', 'bottom');
       }
     }, error => {
       console.log(error);
     }).catch(error => {
       console.log(error);
     });
   }
 

  onMobilePassword(form: NgForm) {
    console.log('form', form);
    this.submitted = true;
    this.chMod.detectChanges();
    if (form.valid) {
      console.log('login');
      this.isLogin = true;

      this.api.post_public('v1/auth/loginWithPhonePassword', this.mobileLogin).then((data: any) => {
        this.isLogin = false;
        console.log(data);
        if (data && data.status && data.status == 200 && data.user && data.user.type == 'driver') {
          this.util.userInfo = data.user;
          localStorage.setItem('uid', data.user.id);
          localStorage.setItem('token', data.token);
          localStorage.setItem('cover', data.user.cover);
          this.updateFCMToken();
          this.util.navigateRoot('tabs');
        } else if (data && data.status == 401 && data.error.error) {
          this.util.errorToast(data.error.error, 'danger');
        } else if (data && data.user && data.user.type != 'driver') {
          this.util.errorToast(this.util.translate('Access denied'), 'danger');
        } else {
          this.util.errorToast(this.util.translate('Something went wrong'), 'danger');
        }
      }, error => {
        this.isLogin = false;
        console.log('Error', error);
        this.util.apiErrorHandler(error);
      }).catch(error => {
        this.isLogin = false;
        console.log('Err', error);
        this.util.apiErrorHandler(error);
      });

    }
  }

  onMobileOTPLogin(form: NgForm) {
    console.log('form', form);
    this.submitted = true;
    this.chMod.detectChanges();
    if (form.valid) {
      console.log('login');
      this.isLogin = true;

      if (this.util.settingInfo.sms_name == '2') {
        console.log('firebase verification');
        this.api.post_public('v1/auth/verifyPhoneForFirebase', this.mobileOTPLogin).then((data: any) => {
          this.isLogin = false;
          console.log(data);
          if (data && data.status && data.status == 200 && data.data) {
            console.log('open firebase modal');
            this.openFirebaseAuthModal();
          } else if (data && data.status == 401 && data.error.error) {
            this.util.errorToast(data.error.error, 'danger');
          } else if (data && data.user && data.user.type != 'driver') {
            this.util.errorToast(this.util.translate('Access denied'), 'danger');
          } else {
            this.util.errorToast(this.util.translate('Something went wrong'), 'danger');
          }
        }, error => {
          this.isLogin = false;
          console.log('Error', error);
          this.util.apiErrorHandler(error);
        }).catch(error => {
          this.isLogin = false;
          console.log('Err', error);
          this.util.apiErrorHandler(error);
        });
      } else {
        console.log('other otp');
        this.api.post_public('v1/otp/verifyPhone', this.mobileOTPLogin).then((data: any) => {
          this.isLogin = false;
          console.log(data);
          if (data && data.status && data.status == 200 && data.data) {
            this.openVerificationModal(data.otp_id, this.mobileOTPLogin.country_code + this.mobileOTPLogin.mobile);
          } else if (data && data.status == 401 && data.error.error) {
            this.util.errorToast(data.error.error, 'danger');
          } else if (data && data.user && data.user.type != 'driver') {
            this.util.errorToast(this.util.translate('Access denied'), 'danger');
          } else {
            this.util.errorToast(this.util.translate('Something went wrong'), 'danger');
          }
        }, error => {
          this.isLogin = false;
          console.log('Error', error);
          this.util.apiErrorHandler(error);
        }).catch(error => {
          this.isLogin = false;
          console.log('Err', error);
          this.util.apiErrorHandler(error);
        });
      }
    }
  }

  async openFirebaseAuthModal() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const param = {
      mobile: this.mobileOTPLogin.country_code + this.mobileOTPLogin.mobile
    }
    const browser = this.iab.create(this.api.baseUrl + 'v1/auth/firebaseauth?' + this.api.JSON_to_URLEncoded(param), '_blank', options);
    console.log('opended');
    console.log('browser=>');
    browser.on('loadstop').subscribe(event => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      if (navUrl.includes('success_verified')) {
        const urlItems = new URL(event.url);
        console.log(urlItems);
        console.log('ok login now');
        this.loginWithPhoneOTPVerified();
        browser.close();
      }
    });
    console.log('browser=> end');
  }

  async openVerificationModal(id: any, to: any) {
    const modal = await this.modalController.create({
      component: VerifyPage,
      backdropDismiss: false,
      componentProps: {
        'id': id,
        'to': to
      }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data.data, data.role);
      if (data && data.data && data.role && data.role == 'ok') {
        console.log('ok login now');
        this.loginWithPhoneOTPVerified();
      }
    })
    return await modal.present();
  }

  loginWithPhoneOTPVerified() {
    this.isLogin = true;
    this.api.post_public('v1/auth/loginWithMobileOtp', this.mobileOTPLogin).then((data: any) => {
      this.isLogin = false;
      console.log(data);
      if (data && data.status && data.status == 200 && data.user && data.user.type == 'driver') {
        this.util.userInfo = data.user;
        localStorage.setItem('uid', data.user.id);
        localStorage.setItem('token', data.token);
        localStorage.setItem('cover', data.user.cover);
        this.updateFCMToken();
        this.util.navigateRoot('tabs');
      } else if (data && data.status == 401 && data.error.error) {
        this.util.errorToast(data.error.error, 'danger');
      } else if (data && data.user && data.user.type != 'driver') {
        this.util.errorToast(this.util.translate('Access denied'), 'danger');
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'), 'danger');
      }
    }, error => {
      this.isLogin = false;
      console.log('Error', error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.isLogin = false;
      console.log('Err', error);
      this.util.apiErrorHandler(error);
    });
  }

  async onCountryCode() {
    const modal = await this.modalController.create({
      component: SelectCountryPage,
      backdropDismiss: false,
      showBackdrop: true,
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data && data.role == 'selected') {
        console.log('ok');
        this.mobileLogin.country_code = '+' + data.data;
        this.mobileOTPLogin.country_code = '+' + data.data;
      }
    });
    return await modal.present();
  }

  // updateFCMToken() {
  //   const param = {
  //     id: localStorage.getItem('uid'),
  //     fcm_token: localStorage.getItem('pushToken') && localStorage.getItem('pushToken') != null ? localStorage.getItem('pushToken') : 'NA'
  //   }
  //   this.api.post_private('v1/profile/update', param).then((data: any) => {
  //     console.log(data);
  //   }, error => {
  //     console.log(error);
  //   }).catch(error => {
  //     console.log(error);
  //   });
  // }

  translateApp() {
    console.log(this.selectedLanguages);
    const selected = this.util.allLanguages.filter(x => x.code == this.selectedLanguages);
    console.log(selected);
    if (selected && selected.length > 0) {
      localStorage.setItem('selectedLanguage', this.selectedLanguages);
      localStorage.setItem('direction', selected[0].direction);
      this.translate.use(localStorage.getItem('selectedLanguage') || 'es');
      document.documentElement.dir = selected[0].direction;
    }
  }

}
