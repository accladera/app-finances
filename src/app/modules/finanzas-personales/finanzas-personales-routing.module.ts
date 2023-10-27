import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ControlPanelComponent} from "./components/control-panel/control-panel.component";
import {AccountComponent} from "./components/account/account.component";
import {TransactionsComponent} from "./components/transactions/transactions.component";
import {CategoryComponent} from "./components/category/category.component";


const routes: Routes = [
  {
    path: '',
    component: ControlPanelComponent,
  },
  {
    path: 'cuenta',
    component: AccountComponent,
  },
  {
    path: 'movimiento',
    component: TransactionsComponent,
  },
  {
    path: 'categorias',
    component: CategoryComponent,
  },



]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanzasPersonalesRoutingModule { }
