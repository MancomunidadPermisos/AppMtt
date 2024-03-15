import { Usuario } from './../models/usuario.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vacacion } from '../models/vacaciones.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {
  vacacion: Vacacion = {
    id: '',
    id_usu_asig: '',
    dias_disp: '',
    horas_disp: '',
    minutos_disp: '',
    ultima_actualizacion: '',
  };
  id_usuario = '';
  usuario: Usuario = {
    id: '',
    nombre_usu: '',
    apellido_usu: '',
    cedula_usu: '',
    fecha_ingreso: '',
    fecha_nacimiento: '',
    id_contra_asig: '',
    id_depa_asig: '',
    clave: '',
    correo: '',
    rol: '',
    telefono_usu: '',
  };

  constructor(private http: HttpClient, private route: Router) {}

  ngOnInit() {
    this.id_usuario = localStorage.getItem('userId') || '';
    console.log(this.id_usuario);

    this.obtenerVacaciones();
    this.obtenerUsuario();
  }
  backHome() {
    this.route.navigate(['/home']);
  }

  obtenerVacaciones() {
    console.log(this.id_usuario);

    this.http
      .get(`http://10.200.200.230:5000/vacaciones/usuarios/${this.id_usuario}`)
      .subscribe({
        next: (data: any) => {
          this.vacacion = data;
          console.log(this.vacacion);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  obtenerUsuario() {
    console.log(this.id_usuario);

    this.http
      .get(`http://10.200.200.230:5000/usuario/${this.id_usuario}`)
      .subscribe({
        next: (data: any) => {
          this.usuario = data;
          console.log(this.usuario);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  doRefresh(event: any) {
    setTimeout(() => {
      this.obtenerVacaciones();
      this.obtenerUsuario();

      event.target.complete();
    }, 1000);
  }
}
