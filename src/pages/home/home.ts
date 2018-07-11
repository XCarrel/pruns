import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Parameters} from "../../providers/Parameters";
import {LoginPage} from "../login/login";
import {RunsPage} from "../runs/runs";
import {Storage} from '@ionic/storage';
import {DriverModel} from "../../models/driverModel";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public httpClient: HttpClient, public storage: Storage) {
      this.attemptLogin()
  }

  private attemptLogin() {
    this.storage.get('token').then(token => {
      if (token == null)
        this.navCtrl.setRoot(LoginPage)
      else
        setTimeout(x => {
          this.navCtrl.setRoot(RunsPage)
        },1000)
    })
  }

  private go() {

  }


}
