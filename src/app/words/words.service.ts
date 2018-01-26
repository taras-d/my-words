import { Injectable, NgZone } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { DBService, DBConnection } from '../core/db.service';

export interface Word {
    id?: string,
    text: string,
    translation?: string,
    createdAt?: Date,
    updatedAt?: Date
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
        filter?: { [key: string]: any },
        sort?: { column: string, order: number }[]
    ): Observable<WordsResponse> {
        return this.getDB().mergeMap(conn => {
            const query: any = {
                raw: true,
                order: []
            };

            paging = paging || {} as any;
            query.offset = paging.skip || 0;
            query.limit = paging.limit || 10;

            if (filter) {
                for (let column in filter) {

                }
            }

            if (sort) {
                sort.forEach(item => {
                    if (item.order) {
                        query.order.push([item.column, item.order === 1? 'ASC': 'DESC'])
                    }
                });
            }

            return this.toObs( conn.words.findAndCountAll(query) ).map((res: any) => {
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

    updateWord(id: string, word: Word): Observable<Word> {
        return this.getDB()
            .mergeMap(conn => {
                return this.toObs( conn.words.findById(id) );
            })
            .mergeMap((model: any) => {
                return model? Observable.of(model): 
                    Observable.throw(`Word with id "${id}" not found`);
            })
            .mergeMap((model: any) => {
                return this.toObs( model.update(word) )
                    .map((model: any) => model.dataValues);
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