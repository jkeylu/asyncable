interface Dictionary<T> { [key: string]: T; }

interface Thenable<T> {
    then<R>(onfulfilled: (value: T) => Thenable<R>|R, onrejected?: (reason: any) => any): Thenable<R>;
}

interface ThenableFunction<T, R> {
    (...args: T[]): Thenable<R>|R;
}

interface AsyncableQueue<T> {
    length(): number;
    started: boolean;
    running(): number;
    idle(): boolean;
    concurrency: number;
    push(task: T): Thenable<void>;
    push(task: T[]): Thenable<void>;
    unshift(task: T): Thenable<void>;
    unshift(task: T[]): Thenable<void>;
    saturated: () => any;
    empty: () => any;
    drain: () => any;
    paused: boolean;
    pause(): void
    resume(): void;
    kill(): void;
}

interface AsyncPriorityQueue<T> {
    length(): number;
    concurrency: number;
    started: boolean;
    paused: boolean;
    push(task: T, priority: number): Thenable<T[]>;
    push(task: T[], priority: number): Thenable<T[]>;
    saturated: () => any;
    empty: () => any;
    drain: () => any;
    running(): number;
    idle(): boolean;
    pause(): void;
    resume(): void;
    kill(): void;
}

interface AsyncCargo {
    length(): number;
    payload: number;
    push(task: any): Thenable<void>;
    push(task: any[]): Thenable<void>;
    saturated(): void;
    empty(): void;
    drain(): void;
    idle(): boolean;
    pause(): void;
    resume(): void;
    kill(): void;
}

interface Asyncable {
    // Collections
    each<T>(arr: T[], iterator: (item: T) => Thenable<void>|void): Thenable<void>;
    forEach<T>(arr: T[], iterator: (item: T) => Thenable<void>|void): Thenable<void>;
    eachSeries<T>(arr: T[], iterator: (item: T) => Thenable<void>|void): Thenable<void>;
    forEachSeries<T>(arr: T[], iterator: (item: T) => Thenable<void>|void): Thenable<void>;
    eachLimit<T>(arr: T[], limit: number, iterator: (item: T) => Thenable<void>|void): Thenable<void>;
    forEachLimit<T>(arr: T[], limit: number, iterator: (item: T) => Thenable<void>|void): Thenable<void>;

    eachOf(obj: any, iterator: (item: any, key: string|number) => Thenable<void>|void): Thenable<void>;
    eachOf<T>(obj: T[], iterator: (item: T, key: number) => Thenable<void>|void): Thenable<void>;
    forEachOf(obj: any, iterator: (item: any, key: string|number) => Thenable<void>|void): Thenable<void>;
    forEachOf<T>(obj: T[], iterator: (item: T, key: number) => Thenable<void>|void): Thenable<void>;
    eachOfSeries(obj: any, iterator: (item: any, key: string|number) => Thenable<void>|void): Thenable<void>;
    eachOfSeries<T>(obj: T[], iterator: (item: T, key: number) => Thenable<void>|void): Thenable<void>;
    forEachOfSeries(obj: any, iterator: (item: any, key: string|number) => Thenable<void>|void): Thenable<void>;
    forEachOfSeries<T>(obj: T[], iterator: (item: T, key: number) => Thenable<void>|void): Thenable<void>;
    eachOfLimit(obj: any, limit: number, iterator: (item: any, key: string|number) => Thenable<void>|void): Thenable<void>;
    eachOfLimit<T>(obj: T[], limit: number, iterator: (item: T, key: number) => Thenable<void>|void): Thenable<void>;
    forEachOfLimit(obj: any, limit: number, iterator: (item: any, key: string|number) => Thenable<void>|void): Thenable<void>;
    forEachOfLimit<T>(obj: T[], limit: number, iterator: (item: T, key: number) => Thenable<void>|void): Thenable<void>;

    map<T, R>(arr: T[], iterator: (item: T) => Thenable<R>|R): Thenable<R[]>;
    mapSeries<T, R>(arr: T[], iterator: (item: T) => Thenable<R>|R): Thenable<R[]>;
    mapLimit<T, R>(arr: T[], limit: number, iterator: (item: T) => Thenable<R>|R): Thenable<R[]>;

    filter<T>(arr: T[], iterator: (item: T) => Thenable<boolean>|boolean): Thenable<T[]>;
    select<T>(arr: T[], iterator: (item: T) => Thenable<boolean>|boolean): Thenable<T[]>;
    filterSeries<T>(arr: T[], iterator: (item: T) => Thenable<boolean>|boolean): Thenable<T[]>;
    selectSeries<T>(arr: T[], iterator: (item: T) => Thenable<boolean>|boolean): Thenable<T[]>;
    filterLimit<T>(arr: T[], limit: number, iterator: (item: T) => Thenable<boolean>|boolean): Thenable<T[]>;
    selectLimit<T>(arr: T[], limit: number, iterator: (item: T) => Thenable<boolean>|boolean): Thenable<T[]>;

    reject<T>(arr: T[], iterator: (item: T) => Thenable<boolean>|boolean): Thenable<T[]>;
    rejectSeries<T>(arr: T[], iterator: (item: T) => Thenable<boolean>|boolean): Thenable<T[]>;
    rejectLimit<T>(arr: T[], limit: number, iterator: (item: T) => Thenable<boolean>|boolean): Thenable<T[]>;

    reduce<T, R>(arr: T[], memo: R, iterator: (memo: R, item: T) => Thenable<R>|R): Thenable<R>;
    foldl<T, R>(arr: T[], memo: R, iterator: (memo: R, item: T) => Thenable<R>|R): Thenable<R>;
    inject<T, R>(arr: T[], memo: R, iterator: (memo: R, item: T) => Thenable<R>|R): Thenable<R>;

    reduceRight<T, R>(arr: T[], memo: R, iterator: (memo: R, item: T) => Thenable<R>|R): Thenable<R>;
    foldr<T, R>(arr: T[], memo: R, iterator: (memo: R, item: T) => Thenable<R>|R): Thenable<R>;

    detect<T>(arr: T[], iterator: (item: T) => Thenable<boolean>|boolean): Thenable<T>;
    detectSeries<T>(arr: T[], iterator: (item: T) => Thenable<boolean>|boolean): Thenable<T>;
    detectLimit<T>(arr: T[], limit: number, iterator: (item: T) => Thenable<boolean>|boolean): Thenable<T>;

    sortBy<T, V>(arr: T[], iterator: (item: T) => Thenable<V>|V): Thenable<T[]>;

    some<T>(arr: T[], iterator: (item: T) => Thenable<boolean>|boolean): Thenable<boolean>;
    any<T>(arr: T[], iterator: (item: T) => Thenable<boolean>|boolean): Thenable<boolean>;
    someLimit<T>(arr: T[], limit: number, iterator: (item: T) => Thenable<boolean>|boolean): Thenable<boolean>;

    every<T>(arr: T[], iterator: (item: T) => Thenable<boolean>|boolean): Thenable<boolean>;
    all<T>(arr: T[], iterator: (item: T) => Thenable<boolean>|boolean): Thenable<boolean>;
    everyLimit<T>(arr: T[], limit: number, iterator: (item: T) => Thenable<boolean>|boolean): Thenable<boolean>;

    concat<T, R>(arr: T[], iterator: (item: T) => Thenable<R[]>|R[]): Thenable<R[]>;
    concatSeries<T, R>(arr: T[], iterator: (item: T) => Thenable<R[]>|R[]): Thenable<R[]>;

    // Control Flow
    series<T>(tasks: Array<() => Thenable<T>|T>): Thenable<T[]>;
    series<T>(tasks: Dictionary<() => Thenable<T>|T>): Thenable<Dictionary<T>>;

    parallel<T>(tasks: Array<() => Thenable<T>|T>): Thenable<T[]>;
    parallel<T>(tasks: Dictionary<() => Thenable<T>|T>): Thenable<Dictionary<T>>;
    parallelLimit<T>(tasks: Array<() => Thenable<T>|T>, limit: number): Thenable<T[]>;
    parallelLimit<T>(tasks: Dictionary<() => Thenable<T>|T>, limit: number): Thenable<Dictionary<T>>;

    whilst(test: () => boolean, fn: () => void): Thenable<any>;
    doWhilst(fn: () => void, test: () => boolean): Thenable<any>;

    until(test: () => boolean, fn: () => void): Thenable<any>;
    doUntil(fn: () => void, test: () => boolean): Thenable<any>;

    during(test: () => Thenable<boolean>|boolean, fn: () => void): Thenable<any>;
    doDuring(fn: () => void, test: () => Thenable<boolean>|boolean): Thenable<any>;

    forever(fn: () => Thenable<void>): Thenable<void>;

    waterfall(tasks: (...args: any[]) => Thenable<any[]>|any[]): Thenable<any[]>;

    compose(...fns: Array<(arg: any) => Thenable<any>|any>): Thenable<any>;
    seq(...fns: Array<(arg: any) => Thenable<any>|any>): Thenable<any>;

    applyEach(fns: Array<(...args: any[]) => Thenable<any>|any>, ...args: any[]): Thenable<any>;
    applyEachSeries(fns: Array<(...args: any[]) => Thenable<any>|any>, ...args: any[]): Thenable<any>;

    queue<T>(worker: (task: T) => Thenable<void>|void, concurrency?: number): AsyncableQueue<T>;
    priorityQueue<T>(worker: (task: T) => Thenable<void>|void, concurrency?: number): AsyncPriorityQueue<T>;
    cargo(worker: (tasks: any) => Thenable<void>|void, payload?: number): AsyncCargo;

    auto(tasks: Array<(...args: any[]) => Thenable<any>|any>): Thenable<any>;

    retry<T>(opts: number|{ times: number, interval: number }, task: (results: any) => Thenable<T>|T): Thenable<any>;
    iterator(tasks: Function[]): Function;

    times<T>(n: number, iterator: (item: number) => Thenable<T>|T): Thenable<T[]>;
    timesSeries<T>(n: number, iterator: (item: number) => Thenable<T>|T): Thenable<T[]>;
    timesLimit<T>(n: number, limit: number, iterator: (item: number) => Thenable<T>|T): Thenable<T[]>;

    // Utils
    apply(fn: (...args: any[]) => Thenable<any>, ...args: any[]): Thenable<any>;
    memoize<T extends ThenableFunction<any, any>>(fn: T, hasher?: (...args: any[]) => any): T;
    unmemoize<T extends ThenableFunction<any, any>>(fn: T): T;
    log(fn: Array<(...args: any[]) => Thenable<any>|any>, ...args: any[]): Thenable<void>;
    dir(fn: Array<(...args: any[]) => Thenable<any>|any>, ...args: any[]): Thenable<void>;

    delay(delay: number): () => Thenable<void>;
    thenable(fn: Function): (...args: any[]) => Thenable<any>;
}

declare var asyncable: Asyncable;

export = asyncable;
