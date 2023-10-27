import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {PageErrorComponent} from "./components/page-error/page-error.component";


const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'error',
    component: PageErrorComponent
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'finanzas',
    loadChildren: () =>
      import('./modules/finanzas-personales/finanzas-personales.module').then(
        (m) => m.FinanzasPersonalesModule
      ),
    // canLoad: [AuthGuard],
    // canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
