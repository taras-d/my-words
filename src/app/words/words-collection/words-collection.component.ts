import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { MessageService } from 'primeng/components/common/messageservice';

import { WordsService, Word } from '../words.service';
import * as utils from '../../core/utils';
import { RequestHelper } from '../../core/utils';

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

  request = new utils.RequestHelper({
    fail: (method, error) => this.messageService.add({
      severity: 'error', detail: error.message
    })
  });

  constructor(
    private wordsService: WordsService,
    private messageService: MessageService
  ) {

    this.request.method('getWords', {
      create: () => {
        this.loading = true;
        return this.wordsService.getWords(this.paging);
      },
      done: result => {
        this.loading = false;
        this.words = result.data;
        this.paging = {
          skip: result.skip, 
          limit: result.limit, 
          total: result.total
        };
      }
    });

    this.request.method('deleteWord', {
      create: id => {
        this.loading = true;
        return this.wordsService.deleteWord(id);
      },
      done: () => {
        const { paging } = this;
        if (this.words.length === 1 && paging.skip > 0) {
          paging.skip = paging.skip - paging.limit;
        }
        this.request.invoke('getWords');
      }
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.request.cancelAll();
  }

  onLazyLoad(event): void {
    this.paging.skip = event.first;
    this.request.invoke('getWords');
  }

  onWordAdd(): void {
    
  }

  onRowClick(): void {
    debugger;
  }

  onEditWord(word: Word): void {
    console.log(word);
  }

  onRemoveWord(word: Word): void {
    this.request.invoke('deleteWord', word.id);
  }

}
