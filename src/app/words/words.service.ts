import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import { DBService, DBConnection } from '../core/db.service';
import { trimValues } from '../core/utils';
import { WordsImportService } from './words-import.service';

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

    private db: DBConnection;

    constructor(
        private dbService: DBService,
        private wordsImportService: WordsImportService
    ) {
        this.db = this.dbService.getConnection();
    }


    createWords(words: Word[]): Observable<{ imported: number, duplicates: number }> {
        return this.wordsImportService.bulkCreate(words);
    }

    getWords(
        paging?: { skip: number, limit: number },
        filters?: { [key: string]: any },
        sort?: { column: string, order: number }[]
    ): Observable<WordsResponse> {
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

        return this.toObs( this.db.words.findAndCountAll(query) ).map((res: any) => {
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
    }

    getRandomWord(): Observable<Word> {
        const sql = 'SELECT * FROM words ORDER BY RANDOM() LIMIT 1';
        return this.toObs(this.db.sequelize.query(sql))
            .map((response: any) => response[0][0] || null);
    }

    updateWord(id: string, word: Word): Observable<null> {
        word = trimValues(word, 'text', 'translation') as Word;

        const db = this.db;

        const exist = db.words.findOne({
            attributes: ['id'],
            raw: true,
            where: {
                text: db.Sequelize.literal(
                    `text = '${DBService.escape(word.text)}' ${DBService.collateClause('NOCASE')}`
                ),
                id: { [db.Sequelize.Op.ne]: id }
            }
        });

        return this.toObs(exist).mergeMap(existWord => {
            if (existWord) {
                return this.throwWordExistError(word);
            } else {
                return this.toObs(
                    db.words.update(word, { where: { id } })
                ).mapTo(null);
            }
        });
    }

    deleteWord(id: string): Observable<null> {
        return this.toObs(
            this.db.words.destroy({ where: { id } })
        ).mapTo(null);
    }

    private toObs(promise: Promise<any>): Observable<any> {
        return this.dbService.toObservable(promise);
    }

    private throwWordExistError(word: Word): Observable<Error> {
        return Observable.throw(new Error(`Word "${word.text}" already exist`));
    }

}
