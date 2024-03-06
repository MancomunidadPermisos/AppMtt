import { Component, Input, OnInit, inject } from '@angular/core';
import { AlertController, AlertOptions, ModalController, ModalOptions } from '@ionic/angular';
import { Peticion } from '../models/peticion.model';
import { Departamento } from '../models/departamento.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  addOutline,
  createOutline,
  trashOutline,
  documentTextOutline,
  checkboxOutline,
  logOutOutline,
  homeOutline,
  arrowBackOutline,
} from 'ionicons/icons';
import { AddUpdatePeticionComponent } from '../shared/components/add-update-peticion/add-update-peticion.component';

@Component({
  selector: 'app-peticiones',
  templateUrl: './peticiones.page.html',
  styleUrls: ['./peticiones.page.scss'],
})
export class PeticionesPage implements OnInit {
  @Input() peticion?: Peticion;
  id_user_log = '';
  departamentoAsignado = '';
  peticiones: Peticion[] = [];
  peticionesFiltradas: any[] = [];
  estadoSeleccionado: string = 'Pendiente';
  departamento: Departamento = {
    id_depa: '',
    nombre_depa: '',
    hora_inicio: '',
    hora_fin: '',
    hora_ini_desc: '',
    hora_fin_desc: '',
  };
  tipoPeticiones = [
    {
      id_tipo: '',
      nombre: '',
    },
  ];
  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private route: Router
  ) {
    addIcons({
      addOutline,
      createOutline,
      trashOutline,
      documentTextOutline,
      checkboxOutline,
      logOutOutline,
      homeOutline,
      arrowBackOutline,
    });
  }
  ngOnInit(): void {
    this.id_user_log = localStorage.getItem('userId') || '';
    this.obtenerInformacionUsuario(this.id_user_log);

    this.departamentoAsignado = localStorage.getItem('userDepartamento') || '';

    this.obtenerTipoPeticiones();
    this.obtenerPeticiones(this.id_user_log);

    localStorage.removeItem('dias_disponibles');
  }
  /* Obtener informacion de vacaciones del usuario */
  obtenerInformacionUsuario(id_user_log: any) {
    // Realiza la petición HTTP al servidor
    this.http
      .get(`http://10.200.200.230:5000/vacaciones/usuarios/${id_user_log}`)
      .subscribe({
        next: (data: any) => {
          localStorage.setItem('dias_disponibles', data.dias_disp);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  obtenerTipoPeticiones() {
    this.http
      .get('http://10.200.200.230:5000/peticiones/tipo_Peticiones')
      .subscribe({
        next: (data: any) => {
          this.tipoPeticiones = data;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  getNombreTipoPeticion(idTipoPeticion: string): string {
    // Supongamos que tipoPeticiones es un array de objetos con id y nombre
    const tipoPeticion = this.tipoPeticiones.find(
      (tipo) => tipo.id_tipo === idTipoPeticion
    );
    return tipoPeticion ? tipoPeticion.nombre : 'Tipo de petición desconocido';
  }
  obtenerDepartamento(id_depa: any) {
    this.http
      .get<Departamento>(`http://10.200.200.230:5000/departamentos/${id_depa}`)
      .subscribe(
        (response: Departamento) => {
          // Maneja la respuesta del servidor
          this.departamento = response;
          localStorage.setItem('hora_inicio', this.departamento.hora_inicio);
          localStorage.setItem('hora_fin', this.departamento.hora_fin);
        },
        (error) => {
          console.error('Error en la petición:', error);
        }
      );
  }
  backHome() {
    this.route.navigate(['/home']);
  }
  ionViewDidEnter() {
    /* this.getProducts(); */
    this.obtenerPeticiones(this.id_user_log);
  }
  modalCtrl = inject(ModalController);
  /* AGREGAR O ACTUALIZAR PRODUCTO */
  async addUpdatePeticion(peticion?: Peticion) {
    let success = await this.presentModal({
      component: AddUpdatePeticionComponent,
      cssClass: 'add-update-modal',
      componentProps: {
        peticion,
      },
    });
    if (success) this.obtenerPeticiones(this.id_user_log);
  }
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
  /* Filtrar las peticiones */
  filtrarPeticiones() {
    this.peticionesFiltradas = this.peticiones.filter(
      (peticion) => peticion.estado_pet === this.estadoSeleccionado
    );
  }
  // Método para manejar el cambio de segmento
  segmentChanged(event: any) {
    this.estadoSeleccionado = event.detail.value;
    this.filtrarPeticiones(); // Filtrar peticiones basadas en el estado seleccionado
  }
  /* Obtener peticiones */
  obtenerPeticiones(id_usu_pet: any) {
    this.http
      .get(`http://10.200.200.230:5000/peticion/${id_usu_pet}`)
      .subscribe({
        next: (data: any) => {
          this.peticiones = data;
          this.filtrarPeticiones();
        },
        error: (error) => {
          console.error(error);
        },
      });
    this.obtenerDepartamento(this.departamentoAsignado);
  }
  /* Eliminar peticiones */
  eliminarPeticion(peticion: Peticion) {
    this.http
      .delete(`http://10.200.200.230:5000/peticiones/${peticion.id}`)
      .subscribe({
        next: (data: any) => {
          this.obtenerPeticiones(this.id_user_log);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  /* cOLOR ESTADOS */
  getColor(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'aprobada':
        return '#17c964'; // verde
      case 'pendiente':
        return '#fbbc05'; // amarillo
      case 'rechazada':
        return '#d34336'; // rojo
      default:
        return '#000000'; // color predeterminado (negro)
    }
  }
  /* Actualizar pagina */
  doRefresh(event: any) {
    setTimeout(() => {
      /* this.getProducts(); */
      this.obtenerPeticiones(this.id_user_log);
      event.target.complete();
    }, 1000);
  }
  /* Confirmar eliminar */
  async confirmDeletePeticion(peticion: Peticion) {
    this.presentAlert({
      header: 'Eliminar Petición',
      message: '¿Estas seguro que quieres eliminar esta petición ?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Si, eliminar',
          handler: () => {
            /* this.deleteProduct(product); */
            this.eliminarPeticion(peticion);
          },
        },
      ],
    });
  }
  //=========ALERT=======
  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
    await alert.present();
  }
}
