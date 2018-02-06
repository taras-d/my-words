import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/api';

import { WordsService, Word } from '../words.service';
import { WordsImportService } from '../words-import.service';
import { RequestHelper, ellipsis } from '../../core/utils';

import { WordEditComponent } from '../word-edit/word-edit.component';
import { WordAddComponent } from '../word-add/word-add.component';

@Component({
  selector: 'mw-words-collection',
  templateUrl: './words-collection.component.html',
  styleUrls: ['./words-collection.component.less'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService]
})
export class WordsCollectionComponent
  implements OnInit, OnDestroy {

  @ViewChild(WordEditComponent) wordEditCmp: WordEditComponent;
  @ViewChild(WordAddComponent) wordAddCmp: WordAddComponent;

  loading: boolean;

  paging = { skip: 0, limit: 10, total: 0 };
  filters = {};
  words: Word[];

  request: RequestHelper;

  importEnd: Subscription;

  constructor(
    private wordsService: WordsService,
    private wordsImportService: WordsImportService,
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
        return this.wordsService.getWords(this.paging, this.filters);
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

    this.importEnd = this.wordsImportService.events
      .filter(e => e === 'import-end')
      .subscribe(() => this.request.invoke('getWords'));
  }

  ngOnInit(): void {
    this.loadWords();
  }

  ngOnDestroy(): void {
    this.request.cancelAll();
    this.importEnd.unsubscribe();
  }

  loadWords(): void {
    this.request.invoke('getWords');
  }

  onPageChange({ first, rows }): void {
    const paging = this.paging;
    if (paging.skip !== first) {
      paging.skip = first;
      this.loadWords();
    }
  }

  onFilterChange({ filters }): void {
    this.paging.skip = 0;
    this.filters = filters;
    this.loadWords();
  }

  onWordAdd(): void {
    this.wordAddCmp.open();
  }

  onWordAddComplete(): void {
    this.loadWords();
  }

  onWordEdit(word: Word): void {
    this.wordEditCmp.open(word);
  }

  onWordEditComplete(): void {
    this.loadWords();
  }

  onWordDelete(word: Word): void {
    this.confirmationService.confirm({
      message: `Are you really want to delete word "${ellipsis(word.text)}"?`,
      accept: () => this.request.invoke('deleteWord', word.id)
    });
  }

}
