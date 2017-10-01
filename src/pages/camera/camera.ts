import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {HttpProvider} from '../../providers/http/http';

/**
 * Generated class for the CameraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
  providers: [HttpProvider]
})
export class CameraPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public camera: Camera, public httpProvider: HttpProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraPage');
  }

  postResponse;
  pingResponse;

  imageData:string;
  json;
  image_base64_display:string;
  image_base64_post:string;
  metadata;
  latitude;
  longitude;


  postRequest() {

    this.httpProvider.getGeoLocation(this.image_base64_post)
      .then(data => {
        this.postResponse = JSON.stringify(data);
      });
  }

  pingServer() {
    this.httpProvider.getApi()
      .then(data => {
        this.pingResponse = data;
      });
  }

  //https://www.npmjs.com/package/cordova-plugin-camera-with-exif
  snapPic_DATAURL_EXIF() {

    //https://www.raymondcamden.com/2015/12/03/ioniccordova-demo-where-did-i-take-that-picture
    //https://www.npmjs.com/package/cordova-plugin-camera-with-exif
    //https://en.wikipedia.org/wiki/Geographic_coordinate_conversion

    const options: CameraOptions = {
      quality: 1,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {

      this.imageData = imageData;

      this.json = JSON.parse(imageData);

      var base64 = this.json.filename;

      let base64ImageDisplay:string = 'data:image/jpeg;base64,' + base64;
      let base64ImagePost:string = base64;
      this.image_base64_display = base64ImageDisplay;
      this.image_base64_post = base64ImagePost;


      this.metadata = this.json.json_metadata

      var metaDataJson =  JSON.parse(this.json.json_metadata);

      var latArray = metaDataJson.gpsLatitude.split(",");
      var lonArray = metaDataJson.gpsLongitude.split(",");
      var latRef = metaDataJson.gpsLatitudeRef || "N";
      var lonRef = metaDataJson.gpsLongitudeRef || "W";

      var latNumber = (eval(latArray[0]) + eval(latArray[1])/60 + eval(latArray[2])/3600);
      var lonNumber = (eval(lonArray[0]) + eval(lonArray[1])/60 + eval(lonArray[2])/3600);

      //handle W/S
      if(latRef=== "S") latNumber = -1 * latNumber;
      if(lonRef === "W") lonNumber = -1 * lonNumber;

      this.latitude = latNumber;
      this.longitude = lonNumber;

    }, (err) => {
      // Handle error
    });
  }

}
