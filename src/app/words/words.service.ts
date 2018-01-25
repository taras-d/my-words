import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

export interface Word {
    id?: string,
    text: string,
    createdAt?: Date,
    updatedAt?: Date
};

export interface WordsResponse {
    skip: number,
    limit: number,
    total: number,
    data: Word[]
};

const words: Word[] = [];
for (let i = 0; i < 10; ++i) {
    words.push({ id: `${i}`, text: `Word ${i}`, createdAt: new Date(), updatedAt: new Date() });
}

@Injectable()
export class WordsService {

    createWord(word: Word): Observable<Word> {
        words.push(word);
        return of(word);
    }

    getWords(
        paging: { skip: number, limit: number },
        filter: { [key: string]: any },
        sort: { [key: string]: any }
    ): Observable<WordsResponse> {
        const result = {
            skip: paging.skip,
            limit: paging.limit,
            total: words.length,
            data: words.slice(paging.skip, paging.skip + paging.limit)
        } as WordsResponse
        return of(result);
    }

    getRandomWord(): Observable<Word> {
        return of( words[ Math.floor(Math.random() * words.length) ] );
    }

    updateWord(id: string, word: Word): Observable<Word> {
        const index = words.findIndex(word => word.id === id);
        if (index !== -1) {
            words[index] = word;
            return of(word);
        } else {
            return _throw('Not found');
        }
    }
    
    deleteWord(id: string): Observable<null> {
        const index = words.findIndex(word => word.id === id);
        if (index !== -1) {
            words.splice(index, 1);
            return of(null);
        } else {
            return _throw('Not found');
        }
    }

} 