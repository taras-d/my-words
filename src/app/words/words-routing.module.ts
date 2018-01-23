import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WordsComponent } from './words.component';
import { WordsCollectionComponent } from './words-collection/words-collection.component';
import { RepeatWordsComponent } from './repeat-words/repeat-words.component';
import { RandomWordComponent } from './random-word/random-word.component';

const routes: Routes = [
  {
    path: 'words',
    component: WordsComponent,
    children: [
      {
        path: '',
        component: WordsCollectionComponent
      },
      {
        path: 'repeat',
        component: RepeatWordsComponent
      },
      {
        path: 'random',
        component: RandomWordComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WordsRoutingModule { }
