
export interface ISagaProcess {
    [key: string]: {
        handle<T>(data: T): void;
    };
}