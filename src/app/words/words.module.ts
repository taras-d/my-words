import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { WordsRoutingModule } from './words-routing.module';
import { WordsComponent } from './words.component';
import { WordsCollectionComponent } from './words-collection/words-collection.component';
import { RepeatWordsComponent } from './repeat-words/repeat-words.component';
import { RandomWordComponent } from './random-word/random-word.component';

import { WordsService } from './words.service';
import { WordEditComponent } from './word-edit/word-edit.component';

@NgModule({
  imports: [
    SharedModule,
    WordsRoutingModule
  ],
  declarations: [
    WordsComponent,
    WordsCollectionComponent,
    RepeatWordsComponent,
    RandomWordComponent,
    WordEditComponent
  ],
  providers: [
    WordsService
  ]
})
export class WordsModule { }
