import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AprobacionesPageRoutingModule } from './aprobaciones-routing.module';

import { AprobacionesPage } from './aprobaciones.page';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AprobacionesPageRoutingModule,
    SharedModule,
    HttpClientModule,
  ],
  declarations: [AprobacionesPage],
})
export class AprobacionesPageModule {}
