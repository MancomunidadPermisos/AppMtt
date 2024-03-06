import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  timeOutline,
  calendarNumberOutline,
  textOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  closeCircleOutline,
} from 'ionicons/icons';
import { Peticion } from 'src/app/models/peticion.model';
@Component({
  selector: 'app-add-update-peticion',
  templateUrl: './add-update-peticion.component.html',
  styleUrls: ['./add-update-peticion.component.scss'],
})
export class AddUpdatePeticionComponent implements OnInit {
  toastCtrl = inject(ToastController);
  id_user_log = '';
  dias_disponibles = '';
  hora_inicio = localStorage.getItem('hora_inicio') || '';
  hora_fin = localStorage.getItem('hora_fin') || '';
  hora_inicio_desc = localStorage.getItem('hora_ini_desc') || '';
  hora_fin_desc = localStorage.getItem('hora_fin_desc') || '';
  showDescripcion: boolean = false;
  tipoPeticion = [
    { value: 1, label: 'Particular' },
    { value: 2, label: 'Enfermedad' },
    { value: 3, label: 'Vacaciones' },
    { value: 4, label: 'Otro' },
  ];

  constructor(private http: HttpClient, private modalCtrl: ModalController) {
    addIcons({
      calendarNumberOutline,
      timeOutline,
      textOutline,
      checkmarkCircleOutline,
      alertCircleOutline,
      closeCircleOutline,
    });
  }
  ngOnInit(): void {
    this.dias_disponibles = localStorage.getItem('dias_disponibles') || '';
    this.id_user_log = localStorage.getItem('userId') || '';

    if (this.peticion) {
      this.form.setValue(this.peticion);
      this.toggleDescripcion(); // Llamar a toggleDescripcion() después de establecer el valor del formulario
    }
  }

  @Input() peticion?: Peticion;
  form = new FormGroup({
    id: new FormControl(''),
    id_usu_pet: new FormControl(''),
    fecha_pet: new FormControl(''),
    fecha_inicio: new FormControl('', [
      Validators.required,
      this.fechaEnRangoValidator(this.getCurrentDate()),
    ]),
    fecha_fin: new FormControl('', [
      Validators.required,
      this.fechaEnRangoValidator(this.getCurrentDate()),
    ]),
    hora_inicio: new FormControl('', [
      Validators.required,
      this.horaEnRangoValidator(this.hora_inicio, this.hora_fin),
    ]),
    hora_fin: new FormControl('', [
      Validators.required,
      this.horaEnRangoValidator(this.hora_inicio, this.hora_fin),
    ]),
    id_tipo_pet_asig: new FormControl('', [Validators.required]),
    descripcion_pet: new FormControl('S/N'),
    observacion_pet: new FormControl(''),
    estado_pet: new FormControl(''),
  });
  toggleDescripcion() {
    if (this.form.value.id_tipo_pet_asig == '4') {
      this.showDescripcion = true;
    } else {
      this.showDescripcion = false;
    }
  }
  submit() {
    if (this.form.valid) {
      // Obtener la fecha de inicio y fin del formulario
      const fechaInicioString = this.form.value.fecha_inicio;
      const fechaFinString = this.form.value.fecha_fin;

      // Verificar si las fechas son válidas
      if (!fechaInicioString || !fechaFinString) {
        console.error('Las fechas son inválidas');
        return;
      }

      // Crear objetos Date si las fechas son válidas
      const fechaInicio = new Date(fechaInicioString);
      const fechaFin = new Date(fechaFinString);

      // Verificar si hay días disponibles
      const diasDisponibles = parseInt(this.dias_disponibles) || 0;

      // Calcular la diferencia en días
      const diasDiferencia = Math.ceil(
        (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 3600 * 24)
      );

      // Obtener el control 'fecha_fin' del formulario
      const fechaFinControl = this.form.get('fecha_fin');

      // Verificar si el control 'fecha_fin' existe y no es nulo
      if (fechaFinControl) {
        // Comparar con los días disponibles
        if (diasDiferencia > diasDisponibles) {
          fechaFinControl.setErrors({ diasExcedidos: true });
          return;
        }
        // Verificar si la fecha de fin es menor que la fecha de inicio
        if (fechaFin < fechaInicio) {
          fechaFinControl.setErrors({ fechaInvalida: true });
          console.error('La fecha de fin es menor que la fecha de inicio');
          return;
        }
      } else {
        console.error(
          'El control fecha_fin no está disponible en el formulario'
        );
        return;
      }

      if (this.peticion) {
        this.actualizarPeticion();
      } else {
        this.crearPeticion();
      }
    }
  }

  getCurrentDate(): string {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    return formattedDate;
  }
  horaEnRangoValidator(minHora: string, maxHora: string) {
    return (control: FormControl): { [key: string]: any } | null => {
      const hora = control.value;
      if (hora) {
        const horaMinima = new Date(`2000-01-01T${minHora}`);
        const horaMaxima = new Date(`2000-01-01T${maxHora}`);
        const horaSeleccionada = new Date(`2000-01-01T${hora}`);
        if (horaSeleccionada < horaMinima || horaSeleccionada > horaMaxima) {
          return { horaNoEnRango: true };
        }
      }
      return null;
    };
  }
  fechaEnRangoValidator(minFecha: string) {
    return (control: FormControl): { [key: string]: any } | null => {
      const fecha = control.value;
      if (fecha) {
        const fechaMinima = new Date(minFecha);
        const fechaSeleccionada = new Date(fecha);
        if (fechaSeleccionada < fechaMinima) {
          return { fechaNoEnRango: true };
        }
      }
      return null;
    };
  }

  crearPeticion() {
    const data = {
      id_usu_pet: this.id_user_log,
      fecha_pet: new Date().toISOString().split('T')[0],
      fecha_inicio: this.form.value.fecha_inicio,
      fecha_fin: this.form.value.fecha_fin,
      hora_inicio: this.form.value.hora_inicio,
      hora_fin: this.form.value.hora_fin,
      descripcion_pet: this.form.value.descripcion_pet,
      observacion_pet: 'S/N',
      estado_pet: 'Pendiente',
      id_tipo_pet_asig: this.form.value.id_tipo_pet_asig,
    };
    this.http.post('http://10.200.200.230:5000/peticiones', data).subscribe(
      (response) => {
        // Maneja la respuesta del servidor
        this.dismissModal({
          success: true,
        });
        this.presentToast({
          message: 'Peticion creada con éxito',
          duration: 2000,
          color: 'success',
          position: 'bottom',
          icon: 'checkmark-circle-outline',
        });
        this.form.reset();
      },
      (error) => {
        console.error('Error en la petición:', error);
        this.presentToast({
          message: 'No se pudo registrar la petición',
          duration: 2000,
          color: 'danger',
          position: 'bottom',
          icon: 'alert-circle-outline',
        });
      }
    );
  }
  actualizarPeticion() {
    const data = {
      id: this.peticion?.id,
      id_usu_pet: this.peticion?.id_usu_pet,
      fecha_pet: new Date().toISOString().split('T')[0],
      fecha_inicio: this.form.value.fecha_inicio,
      fecha_fin: this.form.value.fecha_fin,
      hora_inicio: this.form.value.hora_inicio,
      hora_fin: this.form.value.hora_fin,
      descripcion_pet: this.form.value.descripcion_pet,
      observacion_pet: this.peticion?.observacion_pet,
      estado_pet: this.peticion?.estado_pet,
      id_tipo_pet_asig: this.form.value.id_tipo_pet_asig,
    };
    if (data.id_tipo_pet_asig != '4') {
      data.descripcion_pet = 'S/N';
    }
    this.http
      .put(`http://10.200.200.230:5000/peticiones/${this.peticion?.id}`, data)
      .subscribe(
        (response) => {
          // Maneja la respuesta del servidor
          this.dismissModal({
            success: true,
          });
          this.presentToast({
            message: 'Peticion actualizada con éxito',
            duration: 2000,
            color: 'success',
            position: 'bottom',
            icon: 'checkmark-circle-outline',
          });
          this.form.reset();
        },
        (error) => {
          console.error('Error en la petición:', error);
          this.presentToast({
            message: 'No se pudo actualizar la petición',
            duration: 2000,
            color: 'danger',
            position: 'bottom',
            icon: 'alert-circle-outline',
          });
        }
      );
  }

  /* Toast */
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }
  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }

  takeImage() {}
  setNumberInputs() {}
}
