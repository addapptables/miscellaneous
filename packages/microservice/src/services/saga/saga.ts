export class Saga {

    private static instance: Saga;

    private sagas: Map<string, Function>;

    private constructor() {
        this.sagas = new Map<string, Function>();
    }

    static getInstance() {
        if (!Saga.instance) {
            Saga.instance = new Saga();
        }
        return Saga.instance;
    }

    get(cid: string): Function {
        return this.sagas.get(cid);
    }

    add(cid: string, handle: Function): void {
        this.sagas.set(cid, handle);
    }

    delete(cid: string): void {
        this.sagas.delete(cid);
    }

}