import { 
  Component, OnInit, OnDestroy, ViewChildren, QueryList, 
  Output, EventEmitter 
} from '@angular/core';
import { NgForm } from '@angular/forms';

import { WordsService, Word } from '../words.service';

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

  constructor() {
    // TODO: create request
  }

  ngOnInit(): void {
    this.reset();
  }

  ngOnDestroy(): void {
    // TODO: cancel request
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

  onSave(): void {
    const valid = !this.forms.some(form => form.invalid);
    if (valid) {
      // TODO: invoke request
      console.log(this.words);
    }
  }

  onRemoveWord(index: number): void {
    this.words.splice(index, 1);
  }

}
