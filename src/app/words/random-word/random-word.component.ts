import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';

import { MessageService } from 'primeng/components/common/messageservice';

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
    private wordsService: WordsService,
    private messageService: MessageService
  ) {

    this.request = new RequestHelper({
      fail: (method: string, error: Error) => {
        this.messageService.add({
          severity: 'error', detail: error.message
        });
      }
    });

    this.request.method('getRandomWord', {
      create: () => {
        this.hint = false;
        this.loading = true;
        return this.wordsService.getRandomWord();
      },
      done: word => {
        this.loading = false;
        this.word = word;
      },
      fail: (error: Error) => this.messageService.add({
        severity: 'error', detail: error.message
      })
    });

  }

  ngOnInit(): void {
    this.getRandomWord();
  }

  ngOnDestroy(): void {
    this.request.cancelAll();
  }

  getRandomWord(): void {
    this.request.invoke('getRandomWord');
  }

  onNextWord(): void {
    this.getRandomWord();
  }

}
