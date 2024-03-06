import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  AlertOptions,
  LoadingController,
  ModalController,
  ModalOptions,
  ToastController,
  ToastOptions,
} from '@ionic/angular';
/* import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; */

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  router = inject(Router);
  alertCtrl = inject(AlertController);

  /* async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Selecciona una imagen',
      promptLabelPicture: 'Tomar una foto',
    });
  } */
  //=========ALERT=======
  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
    await alert.present();
  }

  //=========LOADING=======
  loading() {
    return this.loadingCtrl.create({
      message: 'Cargando...',
      spinner: 'crescent',
      showBackdrop: true,
    });
  }
  //=========TOAST=====
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }
  //=====Enruta a cualquier pagina=====
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }
  //=====Guardar un elemento en localStorage=====
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }
  /* //====Obtiene un elemento en localStorage=====
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  } */
  //=====Modal ========
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) return data;
  }
  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }
}
