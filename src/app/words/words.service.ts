import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import { DBService, DBConnection } from '../core/db.service';

export interface Word {
    id?: string,
    text: string,
    translation?: string,
    createdAt?: Date,
    createdAtRelative?: Date,
    updatedAt?: Date,
    updatedAtRelative?: Date
};

export interface WordsResponse {
    skip: number,
    limit: number,
    total: number,
    data: Word[]
};


@Injectable()
export class WordsService {

    constructor(private dbService: DBService) {
        
    }

    createWord(word: Word): Observable<Word> {
        return this.getDB().mergeMap(conn => {
            return this.toObs( conn.words.create(word) )
                .map((model: any) => model.dataValues);
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
                order: [
                    ['updatedAt', 'DESC']
                ]
            };

            paging = paging || {} as any;
            query.offset = paging.skip || 0;
            query.limit = paging.limit || 10;

            if (filters) {
                query.where = {};
                for (let column in filters) {
                    query.where[column] = this.dbService.getColumnFilter(filters[column]);
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

    updateWord(word: Word): Observable<Word> {
        return this.getDB().mergeMap(conn => {
            return this.toObs( 
                conn.words.update(word, {
                    where: { id: word.id }
                })
            ).mapTo(word);
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