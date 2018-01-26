import { Component, OnInit, ViewEncapsulation } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {

  }

}
