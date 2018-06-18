import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Parameters} from "../../providers/Parameters";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RunsPage} from "../runs/runs";
import {DriverModel} from "../../models/driverModel";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public httpClient: HttpClient, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.attemptLogin()
  }

  private attemptLogin() {
    this.storage.get('token').then(token => {
      if (token != null) {
        let headers = new HttpHeaders().set('Authorization','Bearer '+token)
        this.httpClient.get(Parameters.API+"/me",{headers})
          .subscribe(
            data => {
              let me = data as DriverModel
              this.storage.set('userid',me.id)
              this.toastCtrl.create({message: 'Salut '+me.firstname, duration:2000, cssClass:'toastMessage'}).present()
              this.navCtrl.setRoot(RunsPage)
            },
            err => {
              this.storage.remove('token') // invalid token -> trash it
              this.toastCtrl.create({message: 'Code invalide', duration:1000, cssClass:'toastMessage'}).present()
            }
          )
      }
    })
  }

  manually(e): void {
    e.preventDefault()

    const key = e.target.key.value
    this.storage.set('token',key).then(() => {
      this.attemptLogin()
    })
  }

}
