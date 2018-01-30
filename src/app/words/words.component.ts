import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mw-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class WordsComponent {

  tabs = [
    {
      label: 'Words',
      icon: 'fa-list',
      routerLink: '/words',
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'Random',
      icon: 'fa-random',
      routerLink: '/words/random'
    },
    {
      label: 'Stats',
      icon: 'fa-bar-chart',
      routerLink: '/words/stats'
    }
  ];

}
