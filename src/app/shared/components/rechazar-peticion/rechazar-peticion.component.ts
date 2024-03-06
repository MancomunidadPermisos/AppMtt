import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { Peticion } from 'src/app/models/peticion.model';

@Component({
  selector: 'app-rechazar-peticion',
  templateUrl: './rechazar-peticion.component.html',
  styleUrls: ['./rechazar-peticion.component.scss'],
})
export class RechazarPeticionComponent {
  toastCtrl = inject(ToastController);
  @Input() peticion?: Peticion;
  modalCtrl = inject(ModalController);
  form = new FormGroup({
    id: new FormControl(''),
    observacion_pet: new FormControl('', Validators.required),
  });
  constructor(private http: HttpClient) {
    addIcons({
      checkmarkCircleOutline,
    });
  }
  submit() {
    if (this.form.valid) {
      this.rechazar();
    }
  }
  rechazar() {
    const data = {
      observacion_pet: this.form.value.observacion_pet,
    };
    this.http
      .put(`http://10.200.200.230:5000/peticion/${this.peticion?.id}`, data)
      .subscribe((response) => {
        // Maneja la respuesta del servidor
        this.dismissModal({
          success: true,
        });
        this.presentToast({
          message: 'Petición rechazada',
          duration: 2000,
          color: 'success',
          position: 'bottom',
          icon: 'checkmark-circle-outline',
        });
        this.form.reset();
      });
  }
  /* Toast */
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }
  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }
}
