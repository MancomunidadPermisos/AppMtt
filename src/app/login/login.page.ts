import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, ToastOptions } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { addIcons } from 'ionicons';
import { alertCircleOutline, eyeOffOutline, eyeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @Input() usuario?: Usuario;
  eyeIcon = eyeOutline;
  eyeOffIcon = eyeOffOutline;
  showPassword = false;
  signinForm: FormGroup;
  isLoading: boolean = false;
  toastCtrl = inject(ToastController);
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {
    addIcons({ alertCircleOutline, eyeOutline, eyeOffOutline });
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('userNombre');
    localStorage.removeItem('userApellido');
    localStorage.removeItem('userCedula');
    localStorage.removeItem('userTelefono');
    localStorage.removeItem('userCorreo');
    localStorage.removeItem('userRol');
    localStorage.removeItem('userDepartamento');
    localStorage.removeItem('userContrato');
    localStorage.removeItem('userFechaIngreso');
    localStorage.removeItem('userFechaNacimiento');
    localStorage.removeItem('dias_disponibles');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.signinForm.valid) {
      const loginData = {
        correo: this.signinForm.value.email,
        clave: this.signinForm.value.password,
      };

      // Realiza la petición HTTP al servidor
      this.http
        .post<User>(
          'http://10.200.200.230:5000/usuarios/authenticate',
          loginData
        )
        .subscribe(
          (response: User) => {
            // Maneja la respuesta del servidor
            this.usuario = response.user;
            localStorage.setItem('userId', this.usuario.id);
            localStorage.setItem('userNombre', this.usuario.nombre_usu);
            localStorage.setItem('userApellido', this.usuario.apellido_usu);
            localStorage.setItem('userCedula', this.usuario.cedula_usu);
            localStorage.setItem('userTelefono', this.usuario.telefono_usu);
            localStorage.setItem('userCorreo', this.usuario.correo);
            localStorage.setItem('userRol', this.usuario.rol);
            localStorage.setItem('userDepartamento', this.usuario.id_depa_asig);
            localStorage.setItem('userContrato', this.usuario.id_contra_asig);
            localStorage.setItem(
              'userFechaIngreso',
              this.usuario.fecha_ingreso
            );
            localStorage.setItem(
              'userFechaNacimiento',
              this.usuario.fecha_nacimiento
            );
            this.userService.setUserRol(this.usuario.rol.toString());

            this.router.navigate(['/home']);
          },
          (error) => {
            console.error('Error en la petición:', error);
            this.presentToast({
              message: 'No existe un usuario con esas credenciales',
              duration: 2000,
              color: 'danger',
              position: 'bottom',
              icon: 'alert-circle-outline',
            });
          }
        );
    } else {
      // El formulario no es válido, maneja la lógica según tus requerimientos
      this.presentToast({
        message: 'Verifique que el correo exista',
        duration: 2000,
        color: 'danger',
        position: 'bottom',
        icon: 'alert-circle-outline',
      });
    }
  }
}
