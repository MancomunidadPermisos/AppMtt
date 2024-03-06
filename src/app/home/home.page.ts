import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { checkboxOutline, documentTextOutline, homeOutline, logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterContentInit {
  userNombre: string;
  userApellido: string;
  userRol: string;
  menuItems: any[] = [];
  constructor(private route: Router) {
    //addIcons({ logOutOutline });
    //addIcons({documentTextOutline,checkboxOutline,logOutOutline,homeOutline});
    this.userNombre = '';
    this.userApellido = '';
    this.userRol = '';
  }
  ngOnInit(): void {
    this.userNombre = localStorage.getItem('userNombre') ?? '';
    this.userApellido = localStorage.getItem('userApellido') ?? '';
    
  }

  loadMenuForRole1() {
    this.menuItems = [
      {
        label: 'Inicio',
        icon: 'home-outline',
        link: '/home',
        routerLinkActive: 'active-link',
        exact: true,
      },
      {
        label: 'Aprobaciones',
        icon: 'checkbox-outline',
        link: '/aprobaciones',
        routerLinkActive: 'active-link',
        exact: false,
      },
      // Puedes agregar más elementos según sea necesario
    ];
  }

  loadMenuForRole2() {
    this.menuItems = [
      {
        label: 'Inicio',
        icon: 'home-outline',
        link: '/home',
        routerLinkActive: 'active-link',
        exact: true,
      },
      {
        label: 'Aprobaciones',
        icon: 'checkbox-outline',
        link: '/aprobaciones',
        routerLinkActive: 'active-link',
        exact: false,
      },
      {
        label: 'Peticiones',
        icon: 'document-text-outline',
        link: '/peticiones',
        routerLinkActive: 'active-link',
        exact: false,
      },
      // Puedes agregar más elementos según sea necesario
    ];
  }
  loadMenuForRole3() {
    this.menuItems = [
      {
        label: 'Inicio',
        icon: 'home-outline',
        link: '/home',
        routerLinkActive: 'active-link',
        exact: true,
      },
      {
        label: 'Peticiones',
        icon: 'document-text-outline',
        link: '/peticiones',
        routerLinkActive: 'active-link',
        exact: false,
      },
      // Puedes agregar más elementos según sea necesario
    ];
  }
  loadMenuBasedOnUserRole() {
    this.userRol = localStorage.getItem('userRol') ?? '';

    if (this.userRol === '1') {
      this.loadMenuForRole1();
    } else if (this.userRol === '2') {
      this.loadMenuForRole2();
    } else if (this.userRol === '3') {
      this.loadMenuForRole3();
    }
  }

  ngAfterContentInit() {
    addIcons({
      documentTextOutline,
      checkboxOutline,
      logOutOutline,
      homeOutline,
    });
    this.loadMenuBasedOnUserRole();
    
  }

  logout() {
    this.route.navigate(['/login']);
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
    localStorage.removeItem('hora_inicio');
    localStorage.removeItem('hora_fin');
  }

}
