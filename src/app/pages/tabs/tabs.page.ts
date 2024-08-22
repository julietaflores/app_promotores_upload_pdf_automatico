import { Component } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  cantidad_n:any=0;
  constructor(
    public util: UtilService,

  ) { 
  this.cantidad_n=this.util.cantidad_notificaciones;
  }

  getTranslate(name: any) {
    return this.util.translate(name);
  }

}
