import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WifiPasswordPage } from './wifi-password.page';
import { LoggerModule } from '../../components/logger/logger.module';

const routes: Routes = [
  {
    path: '',
    component: WifiPasswordPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    LoggerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WifiPasswordPage]
})
export class WifiPasswordPageModule {}
