import { Injectable, NgZone } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { MessageService } from 'primeng/components/common/messageservice';

import { nodeRequire } from './utils';

export interface DBConnection {
    Sequelize: any;
    sequelize: any;
    words: any;
}

@Injectable()
export class DBService {

    private connection: DBConnection;

    constructor(
        private zone: NgZone,
        private messageService: MessageService
    ) {
    
    }

    getConnection() {
        if (!this.connection) {
            this.connection = nodeRequire('../db/models');
        }
        return this.connection;
    }

    // Convert database promise to observable that runs within Angular zone
    toObservable(promise: Promise<any>): Observable<any> {
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
        const { Op, literal } = this.connection.Sequelize,
            { escape, escapeClause } = DBService;

        switch (matchMode) {
            case 'startsWith':
                return { [Op.like]: literal(`'${escape(value, true)}%' ${escapeClause()}`) };
            case 'endsWith':
                return { [Op.like]: literal(`'%${escape(value, true)}' ${escapeClause()}`) };
            case 'contains':
                return { [Op.like]: literal(`'%${escape(value, true)}%' ${escapeClause()}`) };
            case 'equals':
            default:
                return { [Op.eq]: value };
        }
    }

    static escape(value: string, like: boolean = false): string {
        if (like) {
            value = value.replace(/(%|_)/g, '\\$1');
        }
        value = value.replace(/\'/g, '\'\'$1');
        return value;
    }

    static escapeClause(): string {
        return `ESCAPE '\\'`;
    };

    static collateClause(collate: string): string {
        return `COLLATE ${collate}`;
    }

}