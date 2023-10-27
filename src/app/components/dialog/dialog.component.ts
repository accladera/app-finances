import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { enumDialogType } from '../../enums/enumDialogType';
import {Dialog} from "../../interfaces/Dialog";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  buttonName = '';
  buttonColor = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Dialog,
    private dialogRef: MatDialogRef<any>
  ) {
    this.setButtonName(data.type);
  }

  ngOnInit(): void {}

  setButtonName(notificationType: string): void {
    switch (notificationType) {
      case enumDialogType.delete: {
        this.buttonName = 'Eliminar';
        this.buttonColor = 'accent';
        break;
      }
      case enumDialogType.ok:{
        this.buttonName= 'ok';
        this.buttonColor='secondary';
        break;
      }
      default: {
        this.buttonName = 'Confirmar';
        this.buttonColor = 'primary';
        break;
      }
    }
  }

  continue(): void {
    this.dialogRef.close();
  }
}
