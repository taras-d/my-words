import { Component, OnInit } from '@angular/core';

import { WordsService, WordsResponse } from '../words.service';

@Component({
  selector: 'mw-words-collection',
  templateUrl: './words-collection.component.html',
  styleUrls: ['./words-collection.component.less']
})
export class WordsCollectionComponent implements OnInit {

  words: WordsResponse;

  constructor(private wordsService: WordsService) {

  }

  ngOnInit(): void {
    
  }

}
