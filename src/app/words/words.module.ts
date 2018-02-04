import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { WordsRoutingModule } from './words-routing.module';
import { WordsComponent } from './words.component';
import { WordsCollectionComponent } from './words-collection/words-collection.component';
import { RandomWordComponent } from './random-word/random-word.component';
import { WordEditComponent } from './word-edit/word-edit.component';
import { WordAddComponent } from './word-add/word-add.component';

import { WordsService } from './words.service';

@NgModule({
  imports: [
    SharedModule,
    WordsRoutingModule
  ],
  declarations: [
    WordsComponent,
    WordsCollectionComponent,
    RandomWordComponent,
    WordEditComponent,
    WordAddComponent
  ],
  providers: [
    WordsService
  ]
})
export class WordsModule { }
