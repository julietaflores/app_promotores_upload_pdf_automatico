import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';



let headers = new HttpHeaders({
  "Access-Control-Allow-Origin":"*",
  "origin":"*"
});


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl: any = '';
  baseUrl_1: any = '';
  mediaURL: any = '';
  constructor(
    private http: HttpClient,
  ) {
    this.baseUrl = environment.baseUrl;
    this.baseUrl_1= environment.baseUrl_1;
    this.mediaURL = environment.archivo_promotores_url;
  }





  
  public getDataParament(nombre: string ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      console.log(' campo 1 '+this.baseUrl_1+nombre);
      this.http.get(this.baseUrl_1+nombre).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });

    });
  }
  public uploadfilee(nombre: any, blobData: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', blobData,'document.pdf');
      this.http.post(this.baseUrl_1+nombre, formData).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }



  public  getDataParamentid(nombre: any, conti:any ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      console.log(' campo 10 '+this.baseUrl_1+nombre+'&'+conti);
     // alert(' campo 10 '+this.baseUrl_1+nombre+'&'+conti);
      const headers = new HttpHeaders();
      const options = {
        headers: headers
      };
      this.http.get(this.baseUrl_1+nombre+'&'+conti,options).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  public  getDataParamentJson(nombre: any, json:any ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      console.log(' campo 10 '+this.baseUrl_1+nombre+'&datos=['+JSON.stringify(json)+']');
      this.http.get(this.baseUrl_1+nombre+'&datos=['+JSON.stringify(json)+']').subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  public  getDataParamentJsonn(nombre: any, json:any ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const ddd=this.baseUrl_1+nombre+'&datos=['+JSON.stringify(json)+']';
      console.log(' campo 10 '+ddd);
      const headers = new HttpHeaders();
      const options = {
        headers: headers
      };
      this.http.get(this.baseUrl_1+nombre+'&datos=['+JSON.stringify(json)+']',options).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }






  public  getDataParamentJson_post(nombre: any, json:any ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      console.log(' campo 10 '+this.baseUrl_1+nombre+'&datos=['+JSON.stringify(json)+']');
      const headers = new HttpHeaders();
      const options = {
        headers: headers
      };
      this.http.post(this.baseUrl_1+nombre+'&datos=['+JSON.stringify(json)+']', options).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
















  
  uploadFile(files: File[]) {
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('userfile', f));
    return this.http.post(this.baseUrl + 'users/upload_image', formData);
  }

  JSON_to_URLEncoded(element: any, key?: any, list?: any) {
    let new_list = list || [];
    if (typeof element === 'object') {
      for (let idx in element) {
        this.JSON_to_URLEncoded(
          element[idx],
          key ? key + '[' + idx + ']' : idx,
          new_list
        );
      }
    } else {
      new_list.push(key + '=' + encodeURIComponent(element));
    }
    return new_list.join('&');
  }

  public post_private(url: any, body: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      };
      const param = this.JSON_to_URLEncoded(body);
      console.log(param);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public post_temp(url: any, body: any, temp: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${temp}`)
      };
      const param = this.JSON_to_URLEncoded(body);
      console.log(param);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }




  public post_public(url: any, body: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      };
      const param = this.JSON_to_URLEncoded(body);
      console.log(param);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  // public uploadPDF(pdfBlob: Blob): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('file', pdfBlob, 'document.pdf');
  //   // Configuración de headers si es necesario
  //   const headers = new HttpHeaders({
  //     'Access-Control-Allow-Origin':'*',
  //   });
  //   return this.http.post(this.mediaURL, formData, { headers });
  // }





  public uploadImage(url: any, blobData: any, ext: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const formData = new FormData();
      formData.append('image', blobData, `image.${ext}`);
      this.http.post(this.baseUrl + url, formData).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public get_public(url: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      };
      this.http.get(this.baseUrl + url, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  public get_private(url: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      };
      this.http.get(this.baseUrl + url, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public externalGet(url: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      };
      this.http.get(url, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  httpGet(url: any, key: any) {
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${key}`)
    };
    return this.http.get(url, header);
  }

  public getLocalAssets(name: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      };
      this.http.get('assets/jsons/' + name, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }





}
