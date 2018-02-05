import { Component } from '@angular/core';

import { WordsImportService } from './words/words-import.service';

@Component({
  selector: 'mw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  loading = false;

  constructor(private wordsImportService: WordsImportService) {
    this.wordsImportService.events.subscribe((event: string) => {
      this.loading = (event === 'import' || event === 'export');
    });
  }

}
