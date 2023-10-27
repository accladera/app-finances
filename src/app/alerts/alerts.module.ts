import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsComponent } from './alerts.component';



@NgModule({
    declarations: [
        AlertsComponent
    ],
    exports: [
        AlertsComponent
    ],
    imports: [
        CommonModule
    ]
})
export class AlertsModule { }
