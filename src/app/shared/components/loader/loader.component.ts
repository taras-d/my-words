import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'mw-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.less']
})
export class LoaderComponent {

  @Input() 
  @HostBinding('class.expand')
  expand: boolean = false;

}
