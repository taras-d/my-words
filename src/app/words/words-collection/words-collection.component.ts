import { Component, OnInit } from '@angular/core';

import { WordsService } from '../words.service';

@Component({
  selector: 'mw-words-collection',
  templateUrl: './words-collection.component.html',
  styleUrls: ['./words-collection.component.less']
})
export class WordsCollectionComponent implements OnInit {

  words: any = [];

  constructor(private wordsService: WordsService) {

  }

  ngOnInit(): void {
    window['W'] = this.wordsService;
    this.wordsService.getWords(
      { skip: 0, limit: 10 },
      {},
      {}
    ).subscribe(res => this.words = res.data);
  }

}
