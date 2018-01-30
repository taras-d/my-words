import { Injectable, NgZone } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { isElectron, requireNM } from './utils';

export interface DBConnection {
    Sequelize: any;
    sequelize: any;
    words: any;
}

@Injectable()
export class DBService {

    private connection: DBConnection;

    constructor(private zone: NgZone) {

    }

    // Get database connection
    getConnection(): Observable<DBConnection> {
        if (this.connection) {
            return Observable.of(this.connection);
        }

        if (isElectron()) {
            this.connection = requireNM('../db/models');
            return Observable.of(this.connection);
        } else {
            return Observable.throw(new Error('Cannot connect to database'));
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
                    obs.error(err);
                });
            });
        });
    }

    getColumnFilter({ matchMode, value }): { [key: string]: any } {
        const { Op, literal } = this.connection.Sequelize;
        switch (matchMode) {
            case 'startsWith':
                return { [Op.like]: literal(`'${this.escapeLike(value)}%' ESCAPE '\\'`) };
            case 'endsWith':
                return { [Op.like]: literal(`'%${this.escapeLike(value)}' ESCAPE '\\'`) };
            case 'contains':
                return { [Op.like]: literal(`'%${this.escapeLike(value)}%' ESCAPE '\\'`) };
            case 'equals':
            default:
                return { [Op.eq]: value };
        }
    }

    private escapeLike(value: string): string {
        return value.replace(/(%|_)/g, '\\$1');
    }

}
