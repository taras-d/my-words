import { Injectable } from '@angular/core';

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

}