import { Component, OnDestroy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgForm, FormArray, FormBuilder } from '@angular/forms';

import { MessageService } from 'primeng/components/common/messageservice';

import { WordsService, Word } from '../words.service';
import { RequestHelper, validators } from '../../core/utils';

@Component({
  selector: 'mw-word-add',
  templateUrl: './word-add.component.html',
  styleUrls: ['./word-add.component.less']
})
export class WordAddComponent implements OnDestroy {

  @ViewChild('wordsList') wordsList: ElementRef;

  @Output() complete = new EventEmitter();

  visible: boolean;
  saving: boolean;

  wordsArray: FormArray;

  request: RequestHelper;

  constructor(
    private fb: FormBuilder,
    private wordsService: WordsService,
    private messageService: MessageService
  ) {

    this.request = new RequestHelper();

    this.request.method('createWords', {
      create: () => {
        this.saving = true;
        return this.wordsService.createWords(this.wordsArray.value);
      },
      done: result => {
        this.visible = false;
        this.complete.emit();

        this.messageService.add({
          severity: 'info',
          detail: `Added: ${result.imported}, duplicates: ${result.duplicates}`
        });
      },
      fail: (error: Error) => this.messageService.add({
        severity: 'error', detail: error.message
      })
    });
  }

  ngOnDestroy(): void {
    this.request.cancelAll();
  }

  createWordsArray(): void {
    this.wordsArray = this.fb.array([
      this.fb.group({
        text: ['', validators.required],
        translation: '',
        repeat: false
      })
    ]);
  }

  open(): void {
    this.visible = true;
    this.createWordsArray();
  }

  onHidden(): void {
    this.wordsArray = null;
    this.saving = false;
  }

  onAddWord(): void {
    this.wordsArray.push(
      this.fb.group({
        text: ['', validators.required],
        translation: '',
        repeat: false
      })
    );
    setTimeout(() => {
      const el = this.wordsList.nativeElement;
      el.scrollTop = el.scrollHeight;
    });
  }

  onRemoveWord(index: number): void {
    this.wordsArray.removeAt(index);
  }

  onSave(): void {
    this.request.invoke('createWords');
  }

}
