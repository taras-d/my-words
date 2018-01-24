import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabMenuModule } from 'primeng/tabmenu';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';

import { WordsRoutingModule } from './words-routing.module';
import { WordsComponent } from './words.component';
import { WordsCollectionComponent } from './words-collection/words-collection.component';
import { RepeatWordsComponent } from './repeat-words/repeat-words.component';
import { RandomWordComponent } from './random-word/random-word.component';

const primeNgModules = [
  TabMenuModule,
  CardModule,
  MessagesModule
];

@NgModule({
  imports: [
    CommonModule,
    ...primeNgModules,
    WordsRoutingModule
  ],
  declarations: [WordsComponent, WordsCollectionComponent, RepeatWordsComponent, RandomWordComponent]
})
export class WordsModule { }
