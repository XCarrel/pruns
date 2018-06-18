import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RunPage } from './run';

@NgModule({
  declarations: [
    RunPage,
  ],
  imports: [
    IonicPageModule.forChild(RunPage),
  ],
})
export class RunPageModule {}
