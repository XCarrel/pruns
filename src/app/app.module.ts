import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LoginPage} from "../pages/login/login";
import {RunPage} from "../pages/run/run";
import {RunsPage} from "../pages/runs/runs";
import {HttpClientModule} from "@angular/common/http";
import {IonicStorageModule} from "@ionic/storage";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RunPage,
    RunsPage
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RunPage,
    RunsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner
  ]
})
export class AppModule {}
