import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUpdatePeticionComponent } from './components/add-update-peticion/add-update-peticion.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { HeaderComponent } from './components/header/header.component';
import { RechazarPeticionComponent } from './components/rechazar-peticion/rechazar-peticion.component';

@NgModule({
  declarations: [
    AddUpdatePeticionComponent,
    CustomInputComponent,
    HeaderComponent,
    RechazarPeticionComponent,
  ],
  imports: [CommonModule],
  exports: [
    AddUpdatePeticionComponent,
    CustomInputComponent,
    HeaderComponent,
    RechazarPeticionComponent,
  ],
})
export class SharedModule {}
