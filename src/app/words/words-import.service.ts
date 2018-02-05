import { Injectable, NgZone } from '@angular/core';

import { Subject } from 'rxjs/Subject';

@Injectable()
export class WordsImportService {

    events = new Subject<string>();

    constructor(private zone: NgZone) {

    }

    emitEvent(event: string): void {
        this.zone.run(() => this.events.next(event));
    }
    
}