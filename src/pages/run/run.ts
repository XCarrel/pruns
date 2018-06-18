import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RunModel} from "../../models/runModel";
import {Storage} from '@ionic/storage';

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
    {internal: 'needs_filling', external: 'Recherche chauffeur', code: 1},
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.storage.get('userid').then((val) => {
      this.userid = val
    })
    this.run = navParams.get("run")

    // Map run status for display and handling
    this.runStatusCode = 0
    this.runStatusDisplay = 'Etat bizarre'
    this.statusMap.forEach(status => {
      if (this.run.status == status.internal) {
        this.runStatusDisplay = status.external
        this.runStatusCode = status.code
      }
    })

    this.runIsMine = this.run.belongsTo(this.userid)
  }

  ionViewDidLoad() {
  }

}
