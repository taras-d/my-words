import { Component, OnInit } from '@angular/core';

import { WordsService, Word } from '../words.service';

@Component({
  selector: 'mw-words-collection',
  templateUrl: './words-collection.component.html',
  styleUrls: ['./words-collection.component.less']
})
export class WordsCollectionComponent implements OnInit {

  loading: boolean = true;

  paging = { skip: 0, limit: 2, total: 0 };
  
  words: Word[];

  constructor(private wordsService: WordsService) {
    
  }

  ngOnInit(): void {
    this.loadWords();
  }

  onPageChange(event: any) {
    this.paging.skip = event.first;
    this.loading = true;
    this.loadWords();
  }

  loadWords(): void {
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

}
