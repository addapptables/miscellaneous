export interface IHandler<T> {
    handle(event: T): void;
}
