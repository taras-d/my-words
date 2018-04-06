import { AbstractControl } from '@angular/forms';

export const required = (control: AbstractControl) => {
  return (!control.value || /^\s+$/.test(control.value)) ?
    { required: true } : null;
};