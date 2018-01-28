import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabMenuModule } from 'primeng/tabmenu';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { WordsRoutingModule } from './words-routing.module';
import { WordsComponent } from './words.component';
import { WordsCollectionComponent } from './words-collection/words-collection.component';
import { RepeatWordsComponent } from './repeat-words/repeat-words.component';
import { RandomWordComponent } from './random-word/random-word.component';

import { WordsService } from './words.service';
import { WordEditComponent } from './word-edit/word-edit.component';

const primeNgModules = [
  TabMenuModule,
  CardModule,
  MessagesModule,
  TableModule,
  ButtonModule,
  ConfirmDialogModule,
  DialogModule,
  InputTextModule,
  InputTextareaModule
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ...primeNgModules,
    WordsRoutingModule
  ],
  declarations: [
    WordsComponent, 
    WordsCollectionComponent, 
    RepeatWordsComponent, 
    RandomWordComponent, WordEditComponent
  ],
  providers: [
    WordsService
  ]
})
export class WordsModule { }
