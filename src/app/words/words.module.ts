import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WordsRoutingModule } from './words-routing.module';
import { WordsComponent } from './words.component';
import { WordsCollectionComponent } from './words-collection/words-collection.component';
import { RepeatWordsComponent } from './repeat-words/repeat-words.component';
import { RandomWordComponent } from './random-word/random-word.component';

@NgModule({
  imports: [
    CommonModule,
    WordsRoutingModule
  ],
  declarations: [WordsComponent, WordsCollectionComponent, RepeatWordsComponent, RandomWordComponent]
})
export class WordsModule { }
