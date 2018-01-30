import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';

import { RequestHelper } from '../../core/utils';
import { WordsService, Word } from '../words.service';

@Component({
  selector: 'mw-random-word',
  templateUrl: './random-word.component.html',
  styleUrls: ['./random-word.component.less']
})
export class RandomWordComponent 
  implements OnInit, OnDestroy {

  loading: boolean;
  hint: boolean;
  
  word: Word;

  request: RequestHelper;

  constructor(
    private el: ElementRef,
    private wordsService: WordsService
  ) {

    this.request = new RequestHelper({
      fail: (method, error) => {
        // TODO: Show error message
      }
    });

    this.request.method('getRandomWord', {
      create: () => {
        this.loading = true;
        return this.wordsService.getRandomWord();
      },
      done: word => {
        this.loading = false;
        this.word = word;
      }
    });

  }

  ngOnInit(): void {
    this.request.invoke('getRandomWord');
  }

  ngOnDestroy(): void {
    this.request.cancelAll();
  }

  onNextWord(): void {
    this.hint = false;
    this.request.invoke('getRandomWord');
  }

}
