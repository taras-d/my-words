import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { isElectron } from '../utils';

@Component({
  selector: 'mw-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class WordsComponent implements OnInit {

  tabs = [
    { 
      label: 'Words', 
      icon: 'fa-list', 
      routerLink: '/words', 
      routerLinkActiveOptions: { exact: true }
    },
    { 
      label: 'Repeat', 
      icon: 'fa-repeat', 
      routerLink: '/words/repeat'
    },
    { 
      label: 'Random',
      icon: 'fa-random',
      routerLink: '/words/random'
    }
  ];

  browserWarn = null;

  constructor() { }

  ngOnInit(): void {
    if (!isElectron()) {
      this.browserWarn = [{
        severity: 'warn',
        detail: 'Looks like you are running app in the browser. App will not work correctly!' 
      }];
    }
  }

}
