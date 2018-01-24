import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DatingPage } from './dating';

@NgModule({
  declarations: [
    DatingPage,
  ],
  imports: [
    IonicPageModule.forChild(DatingPage),
  ],
})
export class DatingPageModule {}
