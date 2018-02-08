import { Component, Output, EventEmitter, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MessageService } from 'primeng/components/common/messageservice';

import { WordsService, Word } from '../words.service';

import { RequestHelper, validators } from '../../core/utils';

@Component({
  selector: 'mw-word-edit',
  templateUrl: './word-edit.component.html',
  styleUrls: ['./word-edit.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class WordEditComponent implements OnDestroy {

  @Output() complete = new EventEmitter();

  visible = false;
  saving = false;

  word: Word;
  wordForm: FormGroup;

  request: RequestHelper;

  constructor(
    private fb: FormBuilder,
    private wordsService: WordsService,
    private messageService: MessageService
  ) {

    this.request = new RequestHelper();

    this.request.method('updateWord', {
      create: () => {
        this.saving = true;
        return this.wordsService.updateWord(
          this.word.id,
          this.wordForm.value
        );
      },
      done: () => {
        this.visible = false;
        this.complete.emit();
      },
      fail: (error: Error) => {
        this.messageService.add({
          severity: 'error', detail: error.message
        });
        this.saving = false;
      }
    });

    this.createForm();
  }

  createForm(): void {
    this.wordForm = this.fb.group({
      text: ['', validators.required],
      translation: '',
      repeat: false
    });
  }

  ngOnDestroy(): void {
    this.request.cancelAll();
  }

  open(word: Word): void {
    this.visible = true;
    this.word = word;
    this.wordForm.patchValue(word);
  }

  onCancel(): void {
    this.visible = false;
  }

  onSubmit(): void {
    this.request.invoke('updateWord');
  }

  onHidden(): void {
    this.saving = false;
    this.wordForm.reset();
    this.request.cancelAll();
  }

}
