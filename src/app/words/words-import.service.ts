import { Injectable, NgZone } from '@angular/core';

import { Subject } from 'rxjs/Subject';

import { nodeRequire } from '../core/utils';

const { ipcRenderer, remote } = nodeRequire('electron');

@Injectable()
export class WordsImportService {

    events = new Subject<string>();

    constructor(private zone: NgZone) {
        this.listenMenuEvents();
    }

    emitEvent(event: string): void {
        this.zone.run(() => this.events.next(event));
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
                filters, defaultPath : `words-${new Date().getTime()}.json`
            });
            if (path) {
                this.exportWords(path);
            }
        });
    }

    private importWords(path: string): void {
        console.log(`Import data from "${path}"`);
        this.emitEvent('import');
        setTimeout(() => this.emitEvent('import-end'), 1000);
    }

    private exportWords(path: string): void {
        console.log(`Export data to "${path}"`);
        this.emitEvent('export');
        setTimeout(() => this.emitEvent('export-end'), 1000);
    }
    
}