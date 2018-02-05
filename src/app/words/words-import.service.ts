import { Injectable, NgZone } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { MessageService } from 'primeng/components/common/messageservice';

import { nodeRequire } from '../core/utils';
import { DBService, DBConnection } from '../core/db.service';

const { ipcRenderer, remote } = nodeRequire('electron'),
    fs = nodeRequire('fs');

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
        console.log(`Import data from "${path}"`);
        this.runZone(() => this.events.next('import'));
        setTimeout(() => this.runZone(() => { 
            this.events.next('import-end');
            this.messagesService.add({
                severity: "info", detail: `Imported 0 word(s)`
            });
        }), 1000);
    }

    private exportWords(path: string): void {
        this.runZone(() => this.events.next('export'));

        const getWords = Observable.fromPromise( 
            this.db.words.findAll({ raw: true })
        );

        getWords.mergeMap((words: any) => {
            const writeFile = Observable.bindNodeCallback(fs.writeFile) as any;
            return writeFile(
                path, JSON.stringify(words, null, 2)
            ).mapTo(words.length);
        }).subscribe(count => {
            this.runZone(() => {
                this.events.next('export-end');
                this.messagesService.add({
                    severity: "info", detail: `Exported ${count} word(s)`
                });
            });
        });
    }

    private runZone(fn: () => void): any {
        return this.zone.run(fn);
    }
    
}