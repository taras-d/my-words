import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';

import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/api';

import { WordsService, Word } from '../words.service';
import { RequestHelper } from '../../core/utils';

import { WordEditComponent } from '../word-edit/word-edit.component';

@Component({
  selector: 'mw-words-collection',
  templateUrl: './words-collection.component.html',
  styleUrls: ['./words-collection.component.less'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService]
})
export class WordsCollectionComponent implements OnDestroy {

  @ViewChild(WordEditComponent) wordEditCmp: WordEditComponent;

  loading: boolean = true;

  paging = { skip: 0, limit: 10, total: 0 };
  
  words: Word[];

  request: RequestHelper;

  constructor(
    private wordsService: WordsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {

    this.request = new RequestHelper({
      fail: (method: string, error: Error) => this.messageService.add({
        severity: 'error', detail: error.message
      })
    });

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

  ngOnDestroy(): void {
    this.request.cancelAll();
  }

  onLazyLoad(event: any): void {
    this.paging.skip = event.first;
    this.request.invoke('getWords');
  }

  onWordAdd(): void {
    this.wordEditCmp.open({} as Word);
  }

  onWordEdit(word: Word): void {
    this.wordEditCmp.open(word);
  }

  onWordSaved(word: Word): void {
    this.request.invoke('getWords');
  }

  onWordDelete(word: Word): void {
    this.confirmationService.confirm({
      message: `Are you really want to delete word "${word.text}"?`,
      accept: () => this.request.invoke('deleteWord', word.id)
    });
  }

}
