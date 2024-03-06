import { Component, OnInit, inject } from '@angular/core';
import { Vacacion } from '../models/vacaciones.model';
import { Departamento } from '../models/departamento.model';
import { Usuario } from '../models/usuario.model';
import { Peticion } from '../models/peticion.model';
import {
  ModalController,
  ModalOptions,
  ToastController,
  ToastOptions,
} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  closeCircleOutline,
  documentTextOutline,
  checkboxOutline,
  logOutOutline,
  homeOutline,
  arrowBackOutline,
} from 'ionicons/icons';
import { RechazarPeticionComponent } from '../shared/components/rechazar-peticion/rechazar-peticion.component';

@Component({
  selector: 'app-aprobaciones',
  templateUrl: './aprobaciones.page.html',
  styleUrls: ['./aprobaciones.page.scss'],
})
export class AprobacionesPage implements OnInit {
  toastCtrl = inject(ToastController);
  vacacion: Vacacion = {
    id: '',
    id_usu_asig: '',
    dias_disp: '',
    horas_disp: '',
    minutos_disp: '',
    ultima_actualizacion: '',
  };
  tipoPeticiones = [
    {
      id_tipo: '',
      nombre: '',
    },
  ];
  departamento: Departamento[] = [];
  usuarios: Usuario[] = [];
  idDepartamento = '';
  horaIniDesc = '';
  horaFinDesc = '';
  rol_usuario = '';
  dep_asig_usuario = '';
  peticiones: Peticion[] = [];
  modalCtrl = inject(ModalController);
  constructor(private http: HttpClient, private route: Router) {
    addIcons({
      checkmarkCircleOutline,
      closeCircleOutline,
      documentTextOutline,
      checkboxOutline,
      logOutOutline,
      homeOutline,
      arrowBackOutline,
    });
  }
  ngOnInit(): void {
    this.rol_usuario = localStorage.getItem('userRol') || '';
    this.dep_asig_usuario = localStorage.getItem('userDepartamento') || '';
    if (this.rol_usuario === '1') {
      this.obtenerPeticionesGerente();
      this.obtenerTipoPeticiones();
    } else if (this.rol_usuario === '2') {
      this.obtenerInformacionDepartamentos(this.dep_asig_usuario);
      this.obtenerPeticionesDirector(this.dep_asig_usuario);
      this.obtenerTipoPeticiones();
    }
  }
  /* Obtener peticiones */
  obtenerPeticionesGerente() {
    this.http.get(`http://10.200.200.230:5000/gerente/aprobar`).subscribe({
      next: (data: any) => {
        this.peticiones = data;
        this.obtenerInformacionUsuario();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  obtenerNombreApellidoUsuario(id_usuario: string): string {
    const usuario = this.usuarios.find((u) => u.id === id_usuario);
    if (usuario) {
      return usuario.nombre_usu + ' ' + usuario.apellido_usu;
    } else {
      return 'Usuario no encontrado';
    }
  }
  getNombreTipoPeticion(idTipoPeticion: string): string {
    // Supongamos que tipoPeticiones es un array de objetos con id y nombre
    const tipoPeticion = this.tipoPeticiones.find(
      (tipo) => tipo.id_tipo === idTipoPeticion
    );
    return tipoPeticion ? tipoPeticion.nombre : 'Tipo de petición desconocido';
  }

  backHome() {
    this.route.navigate(['/home']);
  }
  obtenerPeticionesDirector(id_dep_asig: any) {
    this.http
      .get(
        `http://10.200.200.230:5000/peticion/aprobar/departamentos/${id_dep_asig}`
      )
      .subscribe({
        next: (data: any) => {
          this.peticiones = data;
          this.obtenerInformacionUsuario();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  obtenerInformacionUsuario() {
    this.http.get('http://10.200.200.230:5000/usuarios').subscribe({
      next: (data: any) => {
        this.usuarios = data;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  obtenerInformacionDepartamentos(id_dep_asig: any) {
    this.http.get('http://10.200.200.230:5000/departamentos').subscribe({
      next: (data: any) => {
        this.departamento = data;
        const departamentoEncontrado = this.departamento.find(
          (d) => d.id_depa == id_dep_asig
        );
        if (departamentoEncontrado) {
          this.horaIniDesc = departamentoEncontrado.hora_ini_desc;
          this.horaFinDesc = departamentoEncontrado.hora_fin_desc;
        } else {
          return;
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  /* Obtener tipo de peticiones */
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

  /* Actualizar pagina */
  doRefresh(event: any) {
    setTimeout(() => {
      if (this.rol_usuario == '1') {
        this.obtenerPeticionesGerente();
      } else if (this.rol_usuario == '2') {
        this.obtenerPeticionesDirector(this.dep_asig_usuario);
      }
      event.target.complete();
    }, 1000);
  }
  async rechazarPeticion(peticion?: Peticion) {
    let success = await this.presentModal({
      component: RechazarPeticionComponent,
      cssClass: 'add-update-modal',
      componentProps: {
        peticion,
      },
    });
    if (success) {
      if (this.rol_usuario === '1') {
        this.obtenerPeticionesGerente();
      } else if (this.rol_usuario === '2') {
        this.obtenerPeticionesDirector(this.dep_asig_usuario);
      }
    }
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
  /* Aprobar peticion */
  async aprobarPeticion(peticion?: Peticion) {
    if (!peticion) {
      console.error('La petición es indefinida.');
      return;
    }
    if (this.rol_usuario == '1') {
      const usuarioEncontrado = this.usuarios.find(
        (u) => u.id == peticion.id_usu_pet
      );
      const departamentoUsuario = usuarioEncontrado?.id_depa_asig;
      this.obtenerInformacionDepartamentos(departamentoUsuario);
    }

    try {
      await this.http
        .put(`http://10.200.200.230:5000/peticion/aprobar/${peticion.id}`, {})
        .toPromise();
      if (this.rol_usuario === '1') {
        this.obtenerPeticionesGerente();
      } else if (this.rol_usuario === '2') {
        this.obtenerPeticionesDirector(this.dep_asig_usuario);
      }

      this.presentToast({
        message: 'Peticion aprobada',
        duration: 3000,
        color: 'success',
        position: 'bottom',
        icon: 'checkmark-circle-outline',
      });

      const userId = peticion.id_usu_pet;

      if (peticion.id_tipo_pet_asig == '2') {
        return;
      }

      const vacacionData: Vacacion | undefined = await this.http
        .get<Vacacion>(
          `http://10.200.200.230:5000/vacaciones/usuarios/${userId}`
        )
        .toPromise();

      if (vacacionData) {
        this.vacacion = {
          id: vacacionData.id,
          id_usu_asig: vacacionData.id_usu_asig,
          dias_disp: vacacionData.dias_disp,
          horas_disp: vacacionData.horas_disp,
          minutos_disp: vacacionData.minutos_disp,
          ultima_actualizacion: vacacionData.ultima_actualizacion,
        };

        if (parseInt(this.vacacion.dias_disp) === 0) {
          this.presentToast({
            message: 'No cuenta con días disponibles.',
            duration: 3000,
            color: 'danger',
            position: 'bottom',
          });
          return;
        }

        const fechaDiff = this.calcularDiferenciaFechasYHoras(peticion);

        let diasActualizados =
          parseInt(this.vacacion.dias_disp) - fechaDiff.dias;
        let horasActualizadas =
          parseInt(this.vacacion.horas_disp) - fechaDiff.horas;
        let minutosActualizados =
          parseInt(this.vacacion.minutos_disp) - fechaDiff.minutos;

        // Ajustar las horas si los minutos son negativos
        if (minutosActualizados < 0) {
          minutosActualizados += 60; // Sumar 60 minutos
          horasActualizadas--; // Restar una hora
        }

        // Ajustar los días si las horas son negativas
        while (horasActualizadas < 0) {
          horasActualizadas += 8; // Sumar 24 horas
          diasActualizados--; // Restar un día
        }

        // Actualizar las vacaciones del usuario en el servidor
        this.actualizarVacaciones(this.vacacion.id_usu_asig, {
          dias_disp: diasActualizados.toString(),
          horas_disp: horasActualizadas.toString(),
          minutos_disp: minutosActualizados.toString(),
        });
      } else {
        console.error(
          'No se pudo obtener la información de vacaciones del usuario.'
        );
        // Manejar el caso en el que no se pudo obtener la información de vacaciones del usuario
      }
    } catch (error) {
      console.error('Error al aprobar la petición:', error);
    }
  }

  actualizarVacaciones(idUsuario: string, data: any) {
    this.http
      .put(`http://10.200.200.230:5000/vacaciones/${idUsuario}`, data)
      .subscribe({
        next: (response: any) => {
          // Manejar la respuesta, si es necesario
          this.presentToast({
            message: 'Vacaciones actualizadas',
            duration: 3000,
            color: 'primary',
            position: 'bottom',
            icon: 'checkbox-outline',
          });
        },
        error: (error) => {
          console.error('Error al actualizar las vacaciones:', error);
          // Manejar el error, si es necesario
        },
      });
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }
  /* calcularDiferenciaFechasYHoras(peticion: Peticion): {
    dias: number;
    horas: number;
    minutos: number;
  } {
    const horaIniDesc = localStorage.getItem('hora_ini_desc') || '';
    const horaFinDesc = localStorage.getItem('hora_fin_desc') || '';

    const fechaInicio = new Date(
      peticion.fecha_inicio + 'T' + peticion.hora_inicio + 'Z'
    );
    const fechaFin = new Date(
      peticion.fecha_fin + 'T' + peticion.hora_fin + 'Z'
    );

    const almuerzoInicio = new Date(
      peticion.fecha_inicio + 'T' + horaIniDesc + 'Z'
    );
    const almuerzoFin = new Date(
      peticion.fecha_inicio + 'T' + horaFinDesc + 'Z'
    );

    let diferenciaMilisegundos = fechaFin.getTime() - fechaInicio.getTime();

    // Verificar si el rango de tiempo de la solicitud cae dentro del horario de almuerzo
    const dentroDelAlmuerzo =
      (fechaInicio <= almuerzoFin && fechaFin >= almuerzoInicio) ||
      (fechaInicio >= almuerzoInicio && fechaInicio <= almuerzoFin) ||
      (fechaFin >= almuerzoInicio && fechaFin <= almuerzoFin);

    if (dentroDelAlmuerzo) {
      // Restar una hora del total de la diferencia de tiempo
      diferenciaMilisegundos -= 60 * 60 * 1000; // 60 minutos * 60 segundos * 1000 milisegundos
    }

    // Convertir la diferencia de milisegundos a días, horas y minutos
    const dias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
    const horas = Math.floor(
      (diferenciaMilisegundos % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutos = Math.floor(
      (diferenciaMilisegundos % (1000 * 60 * 60)) / (1000 * 60)
    );

    return { dias, horas, minutos };
  } */
  calcularDiferenciaFechasYHoras(peticion: Peticion): {
    dias: number;
    horas: number;
    minutos: number;
  } {
    const fechaInicio = new Date(
      peticion.fecha_inicio + 'T' + peticion.hora_inicio + 'Z'
    );
    const fechaFin = new Date(
      peticion.fecha_fin + 'T' + peticion.hora_fin + 'Z'
    );

    const almuerzoInicio = new Date(
      peticion.fecha_inicio + 'T' + this.horaIniDesc + 'Z'
    );
    const almuerzoFin = new Date(
      peticion.fecha_inicio + 'T' + this.horaFinDesc + 'Z'
    );

    // Calcular la diferencia entre la hora de inicio y la hora de fin del horario de descanso
    const diferenciaAlmuerzoMilisegundos =
      almuerzoFin.getTime() - almuerzoInicio.getTime();

    let diferenciaMilisegundos = fechaFin.getTime() - fechaInicio.getTime();

    // Verificar si el rango de tiempo de la solicitud cae dentro del horario de descanso
    const dentroDelAlmuerzo =
      (fechaInicio <= almuerzoFin && fechaFin >= almuerzoInicio) ||
      (fechaInicio >= almuerzoInicio && fechaInicio <= almuerzoFin) ||
      (fechaFin >= almuerzoInicio && fechaFin <= almuerzoFin);

    if (dentroDelAlmuerzo) {
      // Restar la diferencia del horario de descanso al total de la diferencia de tiempo
      diferenciaMilisegundos -= diferenciaAlmuerzoMilisegundos;
    }

    // Convertir la diferencia de milisegundos a días, horas y minutos
    const dias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
    const horas = Math.floor(
      (diferenciaMilisegundos % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutos = Math.floor(
      (diferenciaMilisegundos % (1000 * 60 * 60)) / (1000 * 60)
    );

    return { dias, horas, minutos };
  }
}
