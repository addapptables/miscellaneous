
export interface ISagaAdd {
    end<T = any>(): Promise<T>;
}
