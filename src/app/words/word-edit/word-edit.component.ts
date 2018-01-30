import { Component, Output, EventEmitter, OnDestroy, ViewEncapsulation } from '@angular/core';

import { MessageService } from 'primeng/components/common/messageservice';

import { WordsService, Word } from '../words.service';

import { RequestHelper } from '../../core/utils';

@Component({
  selector: 'mw-word-edit',
  templateUrl: './word-edit.component.html',
  styleUrls: ['./word-edit.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class WordEditComponent implements OnDestroy {

  @Output() saved = new EventEmitter();

  visible = false;
  saving = false;
  header = '';
  word: Word = null;

  request: RequestHelper;

  constructor(
    private wordsService: WordsService,
    private messageService: MessageService
  ) {

    this.request = new RequestHelper({
      done: () => {
        this.visible = false;
        this.saved.emit(this.word);
      },
      fail: (method: string, error: Error) => {
        this.messageService.add({
          severity: 'error', detail: error.message
        });
      }
    });

    this.request.method('createWord', {
      create: () => {
        this.saving = true;
        return this.wordsService.createWord(this.word);
      }
    });

    this.request.method('updateWord', {
      create: () => {
        this.saving = true;
        return this.wordsService.updateWord(this.word);
      }
    });
  }

  ngOnDestroy(): void {
    this.request.cancelAll();
  }

  open(word: Word): void {
    this.visible = true;
    this.header = `${word.id ? 'Edit' : 'Add'} word`;
    this.word = Object.assign({}, word);
  }

  onCancel(): void {
    this.visible = false;
  }

  onSave(): void {
    const word = this.word;
    if (!this.saving && word.text && word.text.trim()) {
      this.request.invoke(word.id ? 'updateWord' : 'createWord', word);
      return;
    }
  }

  onHidden(): void {
    setTimeout(() => this.reset());
  }

  reset(): void {
    this.saving = false;
    this.word = null;
    this.header = '';
    this.request.cancelAll();
  }

}
