import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidationErrors, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[mwNotEmpty]',
  providers: [{
    provide: NG_VALIDATORS, useExisting: NotEmptyValidatorDirective, multi: true
  }]
})
export class NotEmptyValidatorDirective implements Validator {

  private enabled: boolean;
  private onChange: () => void;

  @Input()
  set mwNotEmpty(value: string|boolean) {
    this.enabled = value === '' || value === true || value === 'true';
    if (this.onChange) {
      this.onChange();
    }
  }

  validate(control: AbstractControl): ValidationErrors {
    return this.enabled && (!control.value || /^\s+$/.test(control.value)) ?
      { notEmpty: true } : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn;
  }

}
