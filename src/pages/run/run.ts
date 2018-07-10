import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController} from 'ionic-angular';
import {RunModel} from "../../models/runModel";
import {Storage} from '@ionic/storage';
import {Parameters} from "../../providers/Parameters";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {WaypointModel} from "../../models/waypointModel";
import {RunnerModel} from "../../models/runnerModel";
import {CarModel} from "../../models/carModel";

/**
 * Generated class for the RunPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-run',
  templateUrl: 'run.html',
})
export class RunPage {

  private statusMap: Array<any> = [
    {internal: 'needs_filling', external: 'Incomplet', code: 1},
    {internal: 'ready', external: 'Prêt au départ', code: 2},
    {internal: 'gone', external: 'En cours', code: 3},
    {internal: 'finished', external: 'Terminé', code: 4},
    {internal: 'error', external: 'Problème...', code: 5}
  ]
  private run: RunModel
  private userid: number
  private runStatusDisplay: string // This is the displayed status
  private runStatusCode: number // used to build the UI with the right controls
  private runIsMine: boolean
  private usertoken: string
  private cars: CarModel[] // All cars
  private vehicle: number

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public httpClient: HttpClient, public toastCtrl: ToastController, public alertCtrl: AlertController, public loadCtrl: LoadingController) {
    this.run = navParams.get("run")
    this.storage.get('token').then(token => {
      this.usertoken = token
      this.getCars()
    })


    this.storage.get('userid').then((val) => {
      this.userid = val
      this.runIsMine = this.run.belongsTo(this.userid)
    })
    this.mapStatus()
  }

  private mapStatus() {
    // Map run status for display and handling
    this.runStatusCode = 0
    this.runStatusDisplay = 'Etat bizarre'
    this.statusMap.forEach(status => {
      if (this.run.status == status.internal) {
        this.runStatusDisplay = status.external
        this.runStatusCode = status.code
      }
    })
  }

  private parseResponse(data) {
    this.run = new RunModel(data.id, data.title, data.nb_passenger, data.status, data.begin_at, data.start_at, data.end_at)
    data.runners.forEach((runner) => {
      let rid: number = (runner.user == null) ? null : runner.user.id // run is incomplete
      let rname: string = (runner.user == null) ? null : runner.user.name // run is incomplete
      let vtype: string = (runner.vehicle_category == null) ? null : runner.vehicle_category.type // run is incomplete
      let vname: string = (runner.vehicle == null) ? null : runner.vehicle.name // run is incomplete
      this.run.addRunner(new RunnerModel(runner.id, rid, rname, vtype, vname))
    })
    data.waypoints.forEach((waypoint) => {
      this.run.addWaypoint(new WaypointModel(waypoint.nickname))
    })
    this.mapStatus()
    this.runIsMine = this.run.belongsTo(this.userid) // maybe it's mine now
  }

  getCars() {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.usertoken)
    this.httpClient.get(Parameters.API + "/vehicles", {headers})
      .subscribe(
        data => {
          this.cars = [] // Empty current list or initialize it
          let cars = data as Array<any>
          cars.forEach((value) => {
            var c = new CarModel(value.id, value.name, value.type.type)
            this.cars.push(c)
          })
        },
        err => {
          console.log('Error load cars:' + JSON.stringify(err))
        }
      )
  }

  // Select a vehicle for a runner in a run
  selectCar(runner) {
    let inputs = []
    this.cars.forEach(car => {
      if (car.type == runner.vehicleType)
        inputs.push({type: 'radio', label: car.name, value: car.id})
    })
    let prompt = this.alertCtrl.create({
      title: 'Choisis ton char',
      inputs: inputs,
      buttons: [
        {
          text: "Annuler",
          handler: data => {
          }
        },
        {
          text: "Ok",
          handler: data => {
            let loading = this.loadCtrl.create({content: 'Un instant ...'})
            loading.present()
            let headers = new HttpHeaders()
              .set('Authorization', 'Bearer ' + this.usertoken)
              .set('X-Requested-With', 'XMLHttpRequest')
            this.httpClient.patch(Parameters.API + "/runners/" + runner.id + "/car", {car_id: data}, {headers})
              .subscribe(
                data => {
                  this.parseResponse(data)
                  this.mapStatus()
                  loading.dismiss()
                },
                err => {
                  this.toastCtrl.create({
                    message: 'Ils ont pas voulu...',
                    duration: 1000,
                    cssClass: 'toastMessage'
                  }).present()
                  loading.dismiss()
                }
              )
          }
        }]
    });
    prompt.present();
  }

  start() {
    let loading = this.loadCtrl.create({content: 'Un instant ...'})
    loading.present()
    let headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.usertoken)
      .set('X-Requested-With', 'XMLHttpRequest')
    this.httpClient.post(Parameters.API + "/runs/" + this.run.id + "/start", {}, {headers})
      .subscribe(
        data => {
          this.parseResponse(data)
          this.mapStatus()
          loading.dismiss()
        },
        err => {
          loading.dismiss()
          this.toastCtrl.create({message: 'Ils ont pas voulu...', duration: 1000, cssClass: 'toastMessage'}).present()
        }
      )
  }

  stop() {
    let loading = this.loadCtrl.create({content: 'Un instant ...'})
    loading.present()
    let headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.usertoken)
      .set('X-Requested-With', 'XMLHttpRequest')
    this.httpClient.post(Parameters.API + "/runs/" + this.run.id + "/stop", {}, {headers})
      .subscribe(
        data => {
          this.parseResponse(data)
          this.mapStatus()
          loading.dismiss()
        },
        err => {
          loading.dismiss()
          this.toastCtrl.create({message: 'Ils ont pas voulu...', duration: 1000, cssClass: 'toastMessage'}).present()
        }
      )
  }

  take(rid) {
    let loading = this.loadCtrl.create({content: 'Un instant ...'})
    loading.present()
    let headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.usertoken)
      .set('X-Requested-With', 'XMLHttpRequest')
    this.httpClient.patch(Parameters.API + "/runners/" + rid + "/driver", {}, {headers})
      .subscribe(
        data => {
          this.parseResponse(data)
          this.mapStatus()
          loading.dismiss()
        },
        err => {
          loading.dismiss()
          this.toastCtrl.create({message: 'Ils ont pas voulu...', duration: 1000, cssClass: 'toastMessage'}).present()
        }
      )
  }

}
