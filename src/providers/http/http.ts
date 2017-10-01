import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the HttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpProvider {

  constructor(public http: Http) {
    console.log('Hello HttpProvider Provider');
  }

  getApi() {
    return new Promise(resolve => {
      this.http.get('https://image-metadata-extractor.herokuapp.com/api/')
        .map(res => res.text())
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  getGeoLocation(image){

    var headers = new Headers();
    headers.append('Accept', '*/*');
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({headers: headers});

    return new Promise(resolve => {

      this.http.post('https://image-metadata-extractor.herokuapp.com/api/geolocation/base64', image, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          resolve(error);
        });

    })
  }

}
