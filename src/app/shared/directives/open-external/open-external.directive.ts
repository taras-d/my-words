import { Directive, Input, HostListener } from '@angular/core';

import { nodeRequire } from '../../../core/utils';

const { shell } = nodeRequire('electron');

@Directive({
  selector: '[mwOpenExternal]'
})
export class OpenExternalDirective {

  @Input('mwOpenExternal') mwOpenExternal: string;

  @HostListener('click')
  onClick(): void {
    shell.openExternal(this.mwOpenExternal);
  }

}
