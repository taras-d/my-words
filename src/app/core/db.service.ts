import { Injectable, NgZone } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { isElectron } from './utils';

export interface DBConnection {
    Sequelize: any,
    sequelize: any,
    words: any
};

@Injectable()
export class DBService {

    private connection: any;

    constructor(private zone: NgZone) {

    }

    // Get database connection
    getConnection(): Observable<DBConnection> {
        if (this.connection) {
            return Observable.of(this.connection);
        }

        if (isElectron()) {
            this.connection = eval("require('../db/models')");
            return Observable.of(this.connection);
        } else {
            return Observable.throw(new Error('Cannot connect to database outside Electron'));
        }
    }

    // Convert database promise to observable and run within Angular zone
    primiseToObservable(promise: Promise<any>): Observable<any> {
        return new Observable(obs => {
            promise.then(val => {
                this.zone.run(() => {
                    obs.next(val);
                    obs.complete();
                });
            }).catch(err => {
                this.zone.run(() => {
                    obs.error(err)
                });
            });
        });
    }

}