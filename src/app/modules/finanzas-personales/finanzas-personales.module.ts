import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlPanelComponent } from './components/control-panel/control-panel.component';
import {FinanzasPersonalesRoutingModule} from "./finanzas-personales-routing.module";
import {
  AggregateService,
  ContextMenuService,
  ExcelExportService,
  GridModule,
  PagerModule,
  PageService,
  ResizeService, SearchService,
  ToolbarService
} from "@syncfusion/ej2-angular-grids";
import {ButtonModule} from "@syncfusion/ej2-angular-buttons";
import {AccountComponent} from "./components/account/account.component";
import { TransactionsComponent } from './components/transactions/transactions.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NumericTextBoxModule, TextBoxModule} from "@syncfusion/ej2-angular-inputs";
import {ComboBoxModule, DropDownListModule} from "@syncfusion/ej2-angular-dropdowns";
import {MatIconModule} from "@angular/material/icon";
import { CategoryComponent } from './components/category/category.component';
import {DatePickerModule, DateRangePickerModule} from "@syncfusion/ej2-angular-calendars";



@NgModule({
  declarations: [
    ControlPanelComponent,
    AccountComponent,
    TransactionsComponent,
    CategoryComponent
  ],
  imports: [

    FinanzasPersonalesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TextBoxModule,
    ComboBoxModule,
    NumericTextBoxModule,
    CommonModule,
    GridModule,
    PagerModule,
    ButtonModule,
    MatIconModule,
    DateRangePickerModule,
    DatePickerModule,
    DropDownListModule
  ],
  providers:[
    ContextMenuService,
    PageService,
    ResizeService,
    ToolbarService,
    ExcelExportService,
    SearchService,
    AggregateService,
  ]
})
export class FinanzasPersonalesModule { }
