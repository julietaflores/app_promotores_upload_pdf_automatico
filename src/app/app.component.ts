import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import { UtilService } from './services/util.service';
import { Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { PushNotifications } from '@capacitor/push-notifications';
import { StatusBar } from '@capacitor/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { App } from '@capacitor/app';
import { HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  appVersion: any='';
  currentVersion: any='';
  constructor(
    public util: UtilService,
    public api: ApiService,
    private alertController: AlertController,
    private translate: TranslateService,
  ) {

  this.checkForUpdates();

    this.cargar_notificaciones();
    

    const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
    if (isPushNotificationsAvailable) {
    
      const addListeners = async () => {
        await PushNotifications.addListener('registration', token => {
          console.info('Registration token: ', token.value);
          localStorage.setItem('pushToken', token.value);


          const storedValue1 = localStorage.getItem('idusuario');
          const storedValue4 = localStorage.getItem('pushToken');
 
              const param = {
               id_usuario: storedValue1?.toString() ?? 0,
               token:storedValue4?.toString() ?? 'NA',
              }
   
            
              const params = new HttpParams({ fromObject:param || {} }).toString();;
              this.api.getDataParamentid("actualizar_token_id",params).then((data: any) => {
                console.log('solo la mire '+data);
              }, error => {
                console.log(error);
              }).catch(error => {
                console.log(error);
              });
         




        });

        await PushNotifications.addListener('registrationError', err => {
          console.error('Registration error: ', err.error);
        });

        await PushNotifications.addListener('pushNotificationReceived', notification => {
          console.log('Push notification received: ', notification);
          this.presentAlertConfirm(notification.title, notification.body);
        });

        await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
          console.log('Push notification action performed', notification.actionId, notification.inputValue);
        });
      }

      const registerNotifications = async () => {
        let permStatus = await PushNotifications.checkPermissions();
        if (permStatus.receive == 'prompt') {
          permStatus = await PushNotifications.requestPermissions();
        }
        if (permStatus.receive != 'granted') {
          throw new Error('User denied permissions!');
        }
        await PushNotifications.register();
      }

      addListeners();
      registerNotifications().then(data => {
        console.log('registering data', data);
      }).catch((error: any) => {
        console.log('registering error', error);
      });
    }




    StatusBar.setBackgroundColor({ "color": '#a01c1d' }).then((data: any) => {
      console.log('statusbar data', data);
    }, error => {
     // console.log('statusbar color', error);
    }).catch((error: any) => {
    //  console.log('statusbar color', error);
    });
    const lng = localStorage.getItem('selectedLanguage');
    console.log('cc 1 '+lng);
    if (!lng || lng == null) {
      localStorage.setItem('selectedLanguage', 'es');
      const lng4 = localStorage.getItem('selectedLanguage');
      console.log('cc 11 '+lng4);
      localStorage.setItem('direction', 'ltr');
    }

    const direaction = localStorage.getItem('direction') as string;
    this.translate.use(localStorage.getItem('selectedLanguage') || 'es');
    document.documentElement.dir = direaction;

  }

  async presentAlertConfirm(title: any, body: any) {
    const alert = await this.alertController.create({
      header: this.util.translate('Notification'),
      subHeader: title,
      message: body,
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.util.translate('Okay'),
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }


  async getCurrentAppVersion() {
    const info = await App.getInfo();
    return info.version;
  }


  async cargar_notificaciones(){
    const storedValue2 = localStorage.getItem('USER_CODE');
    const param = {
      usuario: storedValue2?.toString() ?? 'NA',
    }
    console.log(param);
    const params = new HttpParams({ fromObject:param || {} }).toString();
    console.log(params);
   
    this.api.getDataParamentid("listar_notificacion_x_usuario_cantidad",params).then((data: any) => { 

        console.log('cantidad_notif '+JSON.stringify(data));
       // alert('cantidad_notif '+JSON.stringify(data));
        this.util.cantidad_notificaciones=(data[0].cantidad);
        console.log('cantidad_notif '+this.util.cantidad_notificaciones);
   
     
    });
  }

  async checkForUpdates() {
    
    this.api.getDataParament("ultima_version_app").then((data: any) => {
   
     this.appVersion=data;
     localStorage.setItem('Ultimaversion',this.appVersion);
     const latestVersion = this.appVersion;
     const info ='001';
    
   
     if (info !== latestVersion) {
       this.promptUserToUpdate();
     }
    });
  }

  // async getLatestAppVersionFromAPI(): Promise<string> {
  //   this.api.getDataParament("ultima_version_app").then((data: any) => {
  //      alert('gg '+data);

  //    this.appVersion=data;
  //    localStorage.setItem('Ultimaversion',this.appVersion);
  //    return  this.appVersion; 
  //   });
   
  // }


  promptUserToUpdate() {
    if (confirm('Hay una nueva versión de la aplicación disponible. ¿Desea actualizar?')) {
      this.redirectToAppStore();
    }
  } 
  
  redirectToAppStore() {
    const platform = Capacitor.getPlatform();
    window.open('https://drive.google.com/drive/folders/1e10CjOk3HON_0ZHNAlyOvztUf5QoVsrX?usp=drive_link', '_system');
  }

  getUserByID() {
    this.api.post_private('v1/profile/getProfile', { "id": localStorage.getItem('uid') }).then((data: any) => {
      console.log(">>>>><<<<<", data);
      if (data && data.success && data.status === 200) {
        this.util.userInfo = data.data;
      } else {
        localStorage.removeItem('uid');
        localStorage.removeItem('token');
      }
    }, err => {
      localStorage.removeItem('uid');
      localStorage.removeItem('token');
      this.util.userInfo = null;
      console.log(err);
    }).catch((err) => {
      localStorage.removeItem('uid');
      localStorage.removeItem('token');
      this.util.userInfo = null;
      console.log(err);
    });
  }
}
