import { Injectable, NgZone } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { MessageService } from 'primeng/components/common/messageservice';

import { nodeRequire, trimValues } from '../core/utils';
import { DBService, DBConnection } from '../core/db.service';
import { Word } from './words.service';

const { ipcRenderer, remote } = nodeRequire('electron');
const fs = nodeRequire('fs');

@Injectable()
export class WordsImportService {

  events = new Subject<string>();

  private db: DBConnection;

  constructor(
    private zone: NgZone,
    private dbService: DBService,
    private messagesService: MessageService
  ) {
    this.db = this.dbService.getConnection();
    this.listenMenuEvents();
  }

  bulkCreate(words: Word[]): Observable<{ imported: number, duplicates: number }> {
    if (!words.length) {
      return Observable.of({ imported: 0, duplicates: 0 });
    }

    // Exclude words with same id or text
    const uniqueWords = [];
    words.forEach(word => {
      if (!word.text) {
        return;
      }

      word = trimValues(word, 'text', 'description') as Word;

      const found = uniqueWords.find(unique => {
        return (
          (word.id && word.id === unique.id) ||
          (word.text.toLowerCase() === unique.text.toLowerCase())
        );
      });

      if (!found) {
        uniqueWords.push(word);
      }
    });

    const db = this.db;
    let imported = 0;

    // Create word if not exist
    const createWord = word => {
      const where: any = {
        [db.Sequelize.Op.or]: {
          text: db.Sequelize.literal(
            `text = '${DBService.escape(word.text)}' ${DBService.collateClause('NOCASE')}`
          )
        }
      };

      if (word.id) {
        where[db.Sequelize.Op.or].id = word.id;
      }

      return this.dbService.toObservable(
        db.words.findOne({ attributes: ['id'], raw: true, where }).then(res => {
          return res ? null : db.words.create(word).then(() => imported++);
        })
      );
    };

    // Defer requests to make sure that all words created sequentially
    const obs = uniqueWords.map(word => Observable.defer(() => createWord(word)));

    // Concatenate requests and wait when last completed
    return Observable.concat(...obs).last().map(() => {
      return { imported, duplicates: words.length - imported };
    });
  }

  private listenMenuEvents(): void {
    const filters = [{ name: 'JSON', extensions: ['json'] }];

    ipcRenderer.on('menu-import', () => {
      const paths = remote.dialog.showOpenDialog({ filters });
      if (paths) {
        this.importWords(paths[0]);
      }
    });

    ipcRenderer.on('menu-export', () => {
      const path = remote.dialog.showSaveDialog({
        filters, defaultPath: `words-${new Date().getTime()}.json`
      });
      if (path) {
        this.exportWords(path);
      }
    });
  }

  private importWords(path: string): void {
    this.zone.run(() => this.events.next('import'));

    const readFile = Observable.bindNodeCallback(fs.readFile) as any;

    readFile(path, 'utf8').mergeMap(data => {
      try {
        data = JSON.parse(data) || [];
      } catch {
        data = [];
      }

      return this.bulkCreate(data);
    }).subscribe(result => {
      this.zone.run(() => {
        this.events.next('import-end');
        this.messagesService.add({
          severity: 'info',
          detail: `Imported: ${result.imported}, duplicates: ${result.duplicates}`
        });
      });
    });
  }

  private exportWords(path: string): void {
    this.zone.run(() => this.events.next('import'));

    const getAllWords = this.db.words.findAll({ 
      raw: true,
      order: [
        ['createdAt', 'DESC']
      ]
    });

    Observable.fromPromise(getAllWords).mergeMap((words: any) => {
      const writeFile = Observable.bindNodeCallback(fs.writeFile) as any;
      return writeFile(
        path, JSON.stringify(words, null, 2)
      ).mapTo(words.length);
    }).subscribe(count => {
      this.zone.run(() => {
        this.events.next('export-end');
        this.messagesService.add({
          severity: 'info',
          detail: `Exported ${count} words`
        });
      });
    });
  }

}
