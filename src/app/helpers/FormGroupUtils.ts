import {FormArray, FormGroup} from '@angular/forms';

export function enableOrDisableControls(form: FormGroup, state: boolean): void {
  if (state) {
    Object.keys(form.controls).forEach((controlName) => {
      form.controls[controlName].enable();
    });
  } else {
    Object.keys(form.controls).forEach((controlName) => {
      form.controls[controlName].disable();
    });
  }

}


export function enableOrDisableControlsFormArray(formArray: FormArray, state: boolean): void {
  if (state) {
    formArray.controls.forEach((controlName, index: number) => {
      formArray.controls[index].enable();
    });
  } else {
    formArray.controls.forEach((controlName, index: number) => {
      formArray.controls[index].disable();
    });
  }

}


