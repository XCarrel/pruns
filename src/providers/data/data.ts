import { Injectable } from '@angular/core';
//import {Pro} from "@ionic/pro";

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  public timeStamp: string = '?'

  constructor() {

  }

  private zeroPad(x: number) { // returns a zero-right-padded string of a number between 0 and 99
    var v = "0" + x;
    return v.substring(v.length - 2)
  }

  // sets the lastupdate value to now
  private touch() {
    var date = new Date();
    var FormattedDate = date.getFullYear() + "-" + this.zeroPad((date.getMonth() + 1)) + "-" + this.zeroPad(date.getDate()) + " " + this.zeroPad(date.getHours()) + ":" + this.zeroPad(date.getMinutes()) + ":" + this.zeroPad(date.getSeconds());
    this.timeStamp = FormattedDate
  }

  public loadHardcoded() {
    return new Promise((resolve,reject) => {
      this.touch()
      resolve()
    })
  }
}
