import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabMenuModule } from 'primeng/tabmenu';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

import { WordsRoutingModule } from './words-routing.module';
import { WordsComponent } from './words.component';
import { WordsCollectionComponent } from './words-collection/words-collection.component';
import { RepeatWordsComponent } from './repeat-words/repeat-words.component';
import { RandomWordComponent } from './random-word/random-word.component';

import { WordsService } from './words.service';

const primeNgModules = [
  TabMenuModule,
  CardModule,
  MessagesModule,
  TableModule,
  ButtonModule
];

@NgModule({
  imports: [
    CommonModule,
    ...primeNgModules,
    WordsRoutingModule
  ],
  declarations: [
    WordsComponent, 
    WordsCollectionComponent, 
    RepeatWordsComponent, 
    RandomWordComponent
  ],
  providers: [
    WordsService
  ]
})
export class WordsModule { }
