import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'aprobaciones',
    loadChildren: () =>
      import('./aprobaciones/aprobaciones.module').then(
        (m) => m.AprobacionesPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'peticiones',
    loadChildren: () =>
      import('./peticiones/peticiones.module').then(
        (m) => m.PeticionesPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'informacion',
    loadChildren: () => import('./informacion/informacion.module').then( m => m.InformacionPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
