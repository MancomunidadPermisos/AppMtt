import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PeticionesPageRoutingModule } from './peticiones-routing.module';

import { PeticionesPage } from './peticiones.page';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PeticionesPageRoutingModule,
    SharedModule,
    HttpClientModule,
  ],
  declarations: [PeticionesPage],
})
export class PeticionesPageModule {}
