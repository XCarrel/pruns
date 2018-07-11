import {Component} from '@angular/core';
import {DateTime, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Parameters} from "../../providers/Parameters";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Storage} from '@ionic/storage';
import {RunModel} from "../../models/runModel";
import {RunnerModel} from "../../models/runnerModel";
import {WaypointModel} from "../../models/waypointModel";
import {RunPage} from "../run/run";
import {LoginPage} from "../login/login";

/**
 * Generated class for the RunsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-runs',
  templateUrl: 'runs.html',
})
export class RunsPage {

  private runs: RunModel[]
  private filteredRuns: RunModel[]
  private userid: number
  private usertoken: string
  private myruns: boolean
  private finished: boolean
  private incomplete: boolean
  private connected: boolean = false // true if the last call to the API was successful
  private dataTimestamp = null

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public storage: Storage) {
    // First get runs from storage in any case
    this.storage.get('runs').then(data => {
      if (data != null) {
        this.buildFromJSON(data)
        this.storage.get('dataTimestamp').then(ts => {
          this.dataTimestamp = ts
        })
      }
      this.storage.get('token').then(token => {
        this.usertoken = token
        this.load(null)
      })
    })
    this.storage.get('userid').then((val) => {
      this.userid = val
    })
  }

  private load(refresher) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.usertoken)
    this.httpClient.get(Parameters.API + "/runs", {headers})
      .subscribe(
        data => {
          this.buildFromJSON(data)
          if (refresher != null) refresher.complete()
          this.storage.set('runs',data)
          this.connected = true
          // build timestamp
          var date = new Date();

          var options = {
            weekday: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          };
          this.dataTimestamp = date.toLocaleDateString("fr", options)
          this.storage.set('dataTimestamp', this.dataTimestamp)
        },
        err => {
          if (err.status == 401) {
            this.storage.clear() // invalid token -> trash all data
            this.toastCtrl.create({message: 'Code invalide', duration:2000, cssClass:'toastMessage'}).present()
            this.navCtrl.setRoot(LoginPage)
          }
          else
            this.toastCtrl.create({message: 'Problème de connexion', duration:2000, cssClass:'toastMessage'}).present()
          console.log('Error retrieving runs from backend')
          if (refresher != null) refresher.complete()
          this.connected = false
        }
      )
  }


  private buildFromJSON(data) {
    this.runs = [] // Empty current list or initialize it
    data.forEach((value) => {
      var r = new RunModel(value.id, value.title, value.nb_passenger, value.status, value.begin_at, value.start_at, value.end_at)
      value.runners.forEach((runner) => {
        let rid: number = (runner.user == null) ? null : runner.user.id // run is incomplete
        let rname: string = (runner.user == null) ? null : runner.user.name // run is incomplete
        let vtype: string = (runner.vehicle_category == null) ? null : runner.vehicle_category.type // run is incomplete
        let vname: string = (runner.vehicle == null) ? null : runner.vehicle.name // run is incomplete
        r.addRunner(new RunnerModel(runner.id,rid, rname, vtype, vname))
      })
      value.waypoints.forEach((waypoint) => {
        r.addWaypoint(new WaypointModel(waypoint.nickname))
      })
      this.runs.push(r)
    })
    this.filter()
  }

  public viewDetails(run) {
    this.navCtrl.push(RunPage, {run: run});
  }

  filter() {
    this.filteredRuns = []
    this.runs.forEach(run => {

      let finishedFilter: boolean
      let mineFilter: boolean
      let incompleteFilter: boolean

      if (!this.finished)
        finishedFilter = (run.status != 'finished')
      else
        finishedFilter = true


      if (this.myruns)
        mineFilter = run.belongsTo(this.userid)
      else
        mineFilter = true

      if (this.incomplete)
        incompleteFilter = (run.status == 'needs_filling')
      else
        incompleteFilter = true

      if (finishedFilter && mineFilter && incompleteFilter) this.filteredRuns.push(run)
    })
  }

}
