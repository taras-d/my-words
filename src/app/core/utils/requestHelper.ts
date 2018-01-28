import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

export interface Method {
    create: (...params: any[]) => Observable<any>,
    done?: (result: any, ...params: any[]) => void,
    fail?: (error: any, ...params: any[]) => void
};

export interface Options {
    done?: (name: string, result: any, ...params: any[]) => void,
    fail?: (name: string, error: any, ...params: any[]) => void
};

export class RequestHelper {

    private methods: { [key: string]: Method } = {};

    private subs: { [key: string]: Subscription} = {};

    constructor(private options?: Options) {

    }

    method(name: string, method: Method): void {
        const { methods } = this;

        if (name in methods) {
            throw new Error(`Method with name "${name}" already defined`);
        }

        methods[name] = method;
    }

    invoke(name: string, ...params: any[]): void {
        const method = this.methods[name];

        if (!method) {
            throw new Error(`Method with name "${name}" is not defined`);
        }

        // Cancel previous request
        this.cancel(name);

        // Emit `create` event
        const obs = method.create(...params);

        if (!(obs instanceof Observable)) {
            throw new Error('Create should return Observable');
        }
        
        const options = this.options || {};

        this.subs[name] = obs.subscribe(
            result => {
                // Call `done` event
                this.callEvent(method.done, result, ...params);
                this.callEvent(options.done, name, result, ...params);
            },
            error => {
                // Call `fail` event
                this.callEvent(method.fail, error, ...params);
                this.callEvent(options.fail, name, error, ...params);
            }
        );
    }

    cancel(name: string): void {
        const sub = this.subs[name];
        if (sub instanceof Subscription) {
            sub.unsubscribe();
        }
    }

    cancelAll(): void {
        Object.keys(this.subs).forEach(name => this.cancel(name));
    }

    private callEvent(fn: Function, ...args: any[]): void {
        if (typeof fn === 'function') {
            fn(...args);
        }
    }

}