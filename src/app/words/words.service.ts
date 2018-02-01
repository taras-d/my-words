import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import { DBService, DBConnection } from '../core/db.service';

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

    createWords(words: Word[]): Observable<{ added: number, skipped: number }> {
        if (!words.length) {
            return Observable.of(null);
        }

        // Trim word text and skip duplicated words
        let unique = [];
        words.forEach(w => {
            w.text = w.text.trim();
            if (!unique.find(u => u.text === w.text)) {
                unique.push(w);
            }
        });

        return this.getDB().mergeMap(conn => {
            return Observable.fromPromise(
                conn.words.findAll({
                    raw: true,
                    attributes: ['text'],
                    where: {
                        text: {
                            [conn.Sequelize.Op.in]: unique.map(u => u.text)
                        }
                    }
                })
            ).mergeMap((exists: Word[]) => {
                unique = unique.filter(u => !exists.find(e => e.text === u.text));
                return this.toObs( conn.words.bulkCreate(unique) )
                    .map(added => {
                        return { 
                            added: added.length, 
                            skipped: words.length - added.length
                        }
                    });
            });
        });
    }

    getWords(
        paging?: { skip: number, limit: number },
        filters?: { [key: string]: any },
        sort?: { column: string, order: number }[]
    ): Observable<WordsResponse> {
        return this.getDB().mergeMap(conn => {
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

            return this.toObs( conn.words.findAndCountAll(query) ).map((res: any) => {
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
        return this.getDB().mergeMap(conn => {
            return this.toObs(
                conn.sequelize.query('SELECT * FROM words ORDER BY RANDOM() LIMIT 1')
            ).map((response: any) => response[0][0] || null);
        });
    }

    updateWord(word: Word): Observable<null> {
        word.text = word.text.trim();
        return this.getDB().mergeMap(conn => {
            return this.toObs(
                conn.words.update(word, {
                    where: { id: word.id }
                })
            ).mapTo(null);
        });
    }

    deleteWord(id: string): Observable<null> {
        return this.getDB().mergeMap(conn => {
            return this.toObs(
                conn.words.destroy({ where: { id } })
            ).mapTo(null);
        });
    }

    private getDB(): Observable<DBConnection> {
        return this.dbService.getConnection();
    }

    private toObs(promise: Promise<any>): Observable<any> {
        return this.dbService.primiseToObservable(promise);
    }

}
