import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { WordsService, Word } from '../words.service';
import { debug } from 'util';

@Component({
  selector: 'mw-words-collection',
  templateUrl: './words-collection.component.html',
  styleUrls: ['./words-collection.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class WordsCollectionComponent implements OnInit {

  loading: boolean = true;

  paging = { skip: 0, limit: 10, total: 0 };
  
  words: Word[];

  constructor(private wordsService: WordsService) {
    
  }

  ngOnInit(): void {

  }

  loadWords(): void {
    this.loading = true;
    this.wordsService.getWords(this.paging).subscribe(res => {
      this.loading = false;
      this.words = res.data;
      this.paging = {
        skip: res.skip, 
        limit: res.limit, 
        total: res.total
      };
    });
  }

  onLazyLoad(event): void {
    this.paging.skip = event.first;
    this.loadWords();
  }

  onWordAdd(): void {
    this.loading = true;
    this.wordsService.createWord({ text: 'Test word ' + new Date().getTime() }).subscribe(() => {
      this.loadWords();
    });
  }

  onRowClick(): void {
    debugger;
  }

  onEditWord(word: Word): void {
    console.log(word);
  }

  onRemoveWord(word: Word): void {
    this.wordsService.deleteWord(word.id).subscribe(() => this.loadWords());
  }

}
