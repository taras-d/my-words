import { Directive, Input, HostListener } from '@angular/core';

import { openInGoogleTranslate } from '../../../core/utils';

@Directive({
  selector: '[mwOpenInGT]'
})
export class OpenInGTDirective {

  @Input('mwOpenInGT') mwOpenInGT: string;

  @HostListener('click')
  onClick(): void {
    openInGoogleTranslate(this.mwOpenInGT);
  }

}
