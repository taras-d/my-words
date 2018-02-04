import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import { DBService, DBConnection } from '../core/db.service';
import { trimValues } from '../core/utils';

export interface Word {
    id?: string;
    text: string;
    translation?: string;
    repeat?: boolean;
    createdAt?: Date;
    createdAtRelative?: Date;
    updatedAt?: Date;
    updatedAtRelative?: Date;
}

export interface WordsResponse {
    skip: number;
    limit: number;
    total: number;
    data: Word[];
}


@Injectable()
export class WordsService {

    constructor(private dbService: DBService) {

    }

    createWord(word: Word): Observable<any> {
        word = trimValues(word, 'text', 'translation') as Word;

        return this.getDB().mergeMap(db => {
            const exist = db.words.findOne({
                raw: true,
                attributes: ['id'],
                where: {
                    text: db.Sequelize.literal(
                        `text = '${DBService.escape(word.text)}' ${DBService.collateClause('NOCASE')}`
                    )
                }
            });

            return this.toObs(exist).mergeMap(existWord => {
                if (existWord) {
                    return this.throwWordExistError(word);
                } else {
                    return this.toObs(db.words.create(word)).mapTo(null);
                }
            })
        });
    }

    createWords(words: Word[]): Observable<{ added: number, skipped: number }> {
        if (!words.length) {
            return Observable.of({ added: 0, skipped: 0 });
        }

        let unique = [];
        words.forEach(w => {
            if (!unique.find(u => u.text.toLowerCase() === w.text.toLowerCase())) {
                unique.push(w);
            }
        });

        let added = 0;

        return Observable.forkJoin(
            unique.map(word => {
                return this.createWord(word)
                    .do(() => added++)
                    .catch(err => Observable.of(null));
            })
        ).mergeMap(() => {
            return Observable.of({ 
                added,
                skipped: words.length - added
            });
        });
    }

    getWords(
        paging?: { skip: number, limit: number },
        filters?: { [key: string]: any },
        sort?: { column: string, order: number }[]
    ): Observable<WordsResponse> {
        return this.getDB().mergeMap(db => {
            const query: any = {
                raw: true,
                where: {},
                order: [
                    ['createdAt', 'DESC']
                ]
            };

            paging = paging || {} as any;
            query.offset = paging.skip || 0;
            query.limit = paging.limit || 10;

            if (filters) {
                for (const column of Object.keys(filters)) {
                    const filter = filters[column];
                    if (column === 'repeat') {
                        if (filter.value.val !== undefined) {
                            query.where[column] = this.dbService.getColumnFilter({
                                matchMode: filter.matchMode,
                                value: filter.value.val
                            });
                        }
                    } else {
                         query.where[column] = this.dbService.getColumnFilter(filter);
                    }
                }
            }

            return this.toObs( db.words.findAndCountAll(query) ).map((res: any) => {
                res.rows.forEach(row => {
                    row.createdAtRelative = moment( new Date(row.createdAt) ).fromNow();
                    row.updatedAtRelative = moment( new Date(row.updatedAt) ).fromNow();
                });

                return {
                    skip: query.offset,
                    limit: query.limit,
                    total: res.count,
                    data: res.rows
                };
            });
        });
    }

    getRandomWord(): Observable<Word> {
        return this.getDB().mergeMap(db => {
            return this.toObs(
                db.sequelize.query('SELECT * FROM words ORDER BY RANDOM() LIMIT 1')
            ).map((response: any) => response[0][0] || null);
        });
    }

    updateWord(word: Word): Observable<null> {
        word = trimValues(word, 'text', 'translation') as Word;
        
        return this.getDB().mergeMap(db => {
            const exist = db.words.findOne({
                attributes: ['id'],
                raw: true,
                where: {
                    text: db.Sequelize.literal(
                        `text = '${DBService.escape(word.text)}' ${DBService.collateClause('NOCASE')}`
                    ),
                    id: {
                        [db.Sequelize.Op.ne]: word.id
                    }
                }
            });

            return this.toObs(exist).mergeMap(existWord => {
                if (existWord) {
                    return this.throwWordExistError(word);
                } else {
                    return this.toObs(
                        db.words.update(word, { where: { id: word.id } })
                    ).mapTo(null);
                }
            });
        });
    }

    deleteWord(id: string): Observable<null> {
        return this.getDB().mergeMap(db => {
            return this.toObs(
                db.words.destroy({ where: { id } })
            ).mapTo(null);
        });
    }

    private getDB(): Observable<DBConnection> {
        return this.dbService.getConnection();
    }

    private toObs(promise: Promise<any>): Observable<any> {
        return this.dbService.toObservable(promise);
    }

    private throwWordExistError(word: Word): Observable<Error> {
        return Observable.throw(new Error(`Word "${word.text}" already exist`));
    };

}
