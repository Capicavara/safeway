import { Component, ElementRef , ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AlertController , NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {

  @ViewChild('map', {static: true}) mapElement: ElementRef;
  map: any;
  address:string;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({
    suppressMarkers: false,
    polylineOptions: {
      strokeColor: "green"
    },
    markerOptions: {
      icon : {
       url: "assets/icon/woman.png",
       scaledSize: new google.maps.Size(40, 40),
      }
    }
  });
  directionForm: FormGroup;
  public popup : boolean = false;
  public pop_socorro : boolean = false;
  public destino : Text;
  public items : Array<any> = [];
  public waypoints : Array<any> = [];
  private baseURI               : string  = "http://191.239.245.234/php/pi/";

  constructor(private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private fb: FormBuilder,
    public alertController: AlertController,
    public http   : HttpClient,
    public navCtrl: NavController)
    { this.createDirectionForm();
      this.load(); }

  ngOnInit() {
    this.load();
    this.loadMap();
  }

  socorro(b : boolean){
    this.pop_socorro = b;
    //this.navCtrl.navigateRoot('/socorro');
  }

  navegar(p){
    this.navCtrl.navigateRoot(p);
  }

  load() : void
  {
     this.http
     .get('http://191.239.245.234/php/pi/retrieve.php')
     .subscribe((data : any) =>
     {
      for (var i in data) // for acts as a foreach  
      {   
        //console.log(JSON.stringify(data[i].tipo));
          if (JSON.stringify(data[i].tipo) == '"safe"'){
            this.safe('assets/icon/safe.png', 'Local Seguro', JSON.parse(data[i].lat), JSON.parse(data[i].longi));
            this.waypoints.push({'location': new google.maps.LatLng(JSON.parse(data[i].lat), JSON.parse(data[i].longi)), 'stopover' : true});
            console.log(this.waypoints);
            //console.log('Seguro');
          }
          else {
            this.safe('assets/icon/danger.png', 'Local Inseguro', JSON.parse(data[i].lat), JSON.parse(data[i].longi));
            //console.log('Inseguro');
          }

      }  
        //console.dir(data);
        this.items = data;
     },
     (error : any) =>
     {
        console.dir(error);
     });

  }

  updateEntry(lat : string, long: string, tipo: string) : void
  {
     let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
         options 	: any		= { "key" : "update", "lat" : lat, "longi" : long, "tip" : tipo},
         url       : any      	= this.baseURI + "manage.php";

     this.http
     .post(url, JSON.stringify(options), headers)
     .subscribe(data =>
     {
        console.log('foi');
     },
     (error : any) =>
     {
        console.log(error);
     });
  }

  adicionar(info,seg){

    this.presentAlertConfirm(info,seg);
    this.popup = false;
    
    //this.updateEntry(info,seg);
  }

  menu(bool){
    this.popup = bool;
  }

  mysql(tipo: string){
    let info = this.map.center.lat();
    let longi = this.map.center.lng();
    this.updateEntry(info,longi,tipo);
  }

  async presentAlertConfirm(info,seg) {
    const alert = await this.alertController.create({
      header: 'Confirmar!',
      message: '<strong>Deseja classificar este local como '+ seg + '</strong>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            if (seg == 'seguro?'){
              this.addMarker(info,'assets/icon/safe.png');
              this.mysql('safe');
              //this.load();
            }
            else {
              this.addMarker(info,'assets/icon/danger.png');
              this.mysql('danger');
              //this.load();
            }
            
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  calculateAndDisplayRoute(formValues) {

    const that = this;

    this.directionsService.route({

      origin: this.address,

      provideRouteAlternatives: false,

      waypoints: this.waypoints,

      optimizeWaypoints: true,

      destination: formValues,

      travelMode: 'WALKING'

    }, (response, status) => {

      if (status === 'OK') {

        that.directionsDisplay.setDirections(response);

      } else {

        window.alert('Directions request failed due to ' + status);

      }

    });

    console.log(formValues);

  }

  
  createDirectionForm() {

    this.directionForm = this.fb.group({

      //source: ['', Validators.required],

      destination: ['', Validators.required]

    });

  }
  
  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      }

      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.map.addListener('tilesloaded', () => {
        console.log('accuracy',this.map);
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
      });
      this.directionsDisplay.setMap(this.map);
      this.load();

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  safe(icone,info,lat,long){
    let myLatlng = new google.maps.LatLng(lat,long);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: myLatlng,
      icon:{
        url: icone,
        scaledSize: new google.maps.Size(40, 40)
      },
      optimized: true
    });

    let content = '<strong>'+info+'</strong>';

    this.addInfoWindow(marker, content);

  }

  addMarker(info,icone){

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter(),
      icon:{
        url: icone,
        scaledSize: new google.maps.Size(40, 40)
      },
      optimized: true
    });

    let content = info;

    this.addInfoWindow(marker, content);

  }

  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }


  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords "+lattitude+" "+longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderReverseResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if(value.length>0)
          responseAddress.push(value);

        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value+", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) =>{ 
        this.address = "Address Not Available!";
      });

  }

}
