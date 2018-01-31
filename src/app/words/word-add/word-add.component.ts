import { 
  Component, OnInit, OnDestroy, ViewChildren, QueryList, 
  Output, EventEmitter 
} from '@angular/core';
import { NgForm } from '@angular/forms';

import { MessageService } from 'primeng/components/common/messageservice';

import { WordsService, Word } from '../words.service';

import { RequestHelper } from '../../core/utils';

@Component({
  selector: 'mw-word-add',
  templateUrl: './word-add.component.html',
  styleUrls: ['./word-add.component.less']
})
export class WordAddComponent
  implements OnInit, OnDestroy {

  @ViewChildren(NgForm) forms: QueryList<NgForm>;

  @Output() complete = new EventEmitter();

  visible: boolean;
  saving: boolean;

  words: Word[];

  request: RequestHelper;

  constructor(
    private wordsService: WordsService,
    private messageService: MessageService
  ) {
    
    this.request = new RequestHelper();

    this.request.method('createWords', {
      create: () => {
        this.saving = true;
        return this.wordsService.createWords(this.words);
      },
      done: () => {
        this.visible = false;
        this.complete.emit();
      },
      fail: (error: Error) => this.messageService.add({
        severity: 'error', detail: error.message
      })
    });
  }

  ngOnInit(): void {
    this.reset();
  }

  ngOnDestroy(): void {
    this.request.cancelAll();
  }

  open(): void {
    this.visible = true;
  }

  reset(): void {
    this.saving = false;
    this.words = [{ text: '', translation: '', repeat: false }];
  }

  onHidden(): void {
    this.reset();
  }

  onAddWord(): void {
    this.words.push({ text: '', translation: '', repeat: false });
  }

  onRemoveWord(index: number): void {
    this.words.splice(index, 1);
  }

  onSave(): void {
    if (this.valid()) {
      this.request.invoke('createWords');
    }
  }

  valid(): boolean {
    return this.forms && !this.forms.some(f => f.invalid);
  }

}
