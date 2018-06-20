import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Parameters} from "../../providers/Parameters";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Storage} from '@ionic/storage';
import {RunModel} from "../../models/runModel";
import {RunnerModel} from "../../models/runnerModel";
import {WaypointModel} from "../../models/waypointModel";
import {RunPage} from "../run/run";

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

  private loading: boolean = true
  private runs: RunModel[]
  private filteredRuns: RunModel[]
  private userid: number
  private usertoken: string
  private myruns: boolean
  private finished: boolean
  private incomplete: boolean

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public storage: Storage) {
    this.storage.get('userid').then((val) => {
      this.userid = val
    })
    this.storage.get('token').then(token => {
      this.usertoken = token
      this.load(null)
    })
  }

  ionViewDidLoad() {
  }

  private load(refresher) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.usertoken)
    this.httpClient.get(Parameters.API + "/runs", {headers})
      .subscribe(
        data => {
          this.buildFromJSON(data)
          this.filter()
          this.loading = false
          if (refresher != null) refresher.complete()
        },
        err => {
          console.log('Error')
          if (refresher != null) refresher.complete()
        }
      )
  }


  private buildFromJSON(data) {
    this.runs = [] // Empty current list or initialize it
    data.forEach((value) => {
      var r = new RunModel(value.id, value.title, value.status, value.begin_at, value.start_at, value.end_at)
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
