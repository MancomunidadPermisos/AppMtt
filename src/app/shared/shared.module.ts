import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUpdatePeticionComponent } from './components/add-update-peticion/add-update-peticion.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { HeaderComponent } from './components/header/header.component';
import { RechazarPeticionComponent } from './components/rechazar-peticion/rechazar-peticion.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AddUpdatePeticionComponent,
    CustomInputComponent,
    HeaderComponent,
    RechazarPeticionComponent,
  ],
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  exports: [
    AddUpdatePeticionComponent,
    CustomInputComponent,
    HeaderComponent,
    RechazarPeticionComponent,
  ],
})
export class SharedModule {}
