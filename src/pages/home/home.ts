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
    console.log('login')
    this.storage.get('token').then(token => {
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + token)
      this.httpClient.get(Parameters.API + "/me", {headers})
        .subscribe(
          data => {
            let me= data as DriverModel
            this.storage.set('userid', me.id)
            this.navCtrl.setRoot(RunsPage)
          },
          err => {
            if (err.status == 401) // API rejected us
            {
              this.navCtrl.setRoot(LoginPage)
            }
            else
              setTimeout(() => {
                this.attemptLogin()
              }, 3000)
          }
        )
    })
  }


}
