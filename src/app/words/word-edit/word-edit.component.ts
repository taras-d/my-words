import { Component, Output, EventEmitter } from '@angular/core';

import { WordsService, Word } from '../words.service';

import { RequestHelper } from '../../core/utils';

@Component({
  selector: 'mw-word-edit',
  templateUrl: './word-edit.component.html',
  styleUrls: ['./word-edit.component.less']
})
export class WordEditComponent {

  @Output() saved = new EventEmitter();

  visible: boolean = false;
  header: string = '';
  word: Word;

  request: RequestHelper;

  constructor(private wordsService: WordsService) { 
    this.request = new RequestHelper({
      done: () => {
        // TODO: Show loader
        this.visible = false;
        this.saved.emit(this.word);
      },
      fail: (method, error) => {
        // TODO: Show error message
        console.log(error);
      }
    });

    this.request.method('createWord', {
      create: () => {
        return this.wordsService.createWord(this.word);
      }
    });

    this.request.method('updateWord', {
      create: () => {
        return this.wordsService.updateWord(this.word);
      }
    });
  }

  open(word: Word): void {
    this.visible = true;
    this.header = `${word.id? 'Edit': 'Add'} word`;
    this.word = Object.assign({}, word);
  }

  onCancel(): void {
    this.visible = false;
  }

  onSave(): void {
    const { word } = this;
    if (word && word.text) {
      this.request.invoke(word.id? 'updateWord': 'createWord', word);
    }
  }

}
