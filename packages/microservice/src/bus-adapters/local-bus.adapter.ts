import { from, Subject } from "rxjs";
import { concatMap, filter, tap } from "rxjs/operators";
import { IBusAdapter } from "../interfaces/bus/bus-adapter.interface";
import { ITransferData } from "../interfaces/transfer-data";
import { TransferDataDto } from "../interfaces/transfer-data-dto.interface";
import { IOnInit, ISetOptions } from "../interfaces";
import { CraftsLogger } from "../logger/services/logger.service";
import { Injectable } from "@nestjs/common";

export interface LocalBusAdapterOptions {
  sequentialProcessing?: boolean;
}

@Injectable()
export class LocalBusAdapter implements IBusAdapter, IOnInit, ISetOptions<LocalBusAdapterOptions> {
  static instance: LocalBusAdapter;

  private bus: Subject<ITransferData<TransferDataDto>>;
  private sequentialProcessing: boolean = false;
  private readonly queues = new Map<string, Promise<void>>();

  constructor(private readonly logger: CraftsLogger) {
    if (!LocalBusAdapter.instance) {
      LocalBusAdapter.instance = this;
      this.bus = new Subject();
    }
    return LocalBusAdapter.instance;
  }

  onInit(): void | Promise<void> {
    this.logger.setContext(LocalBusAdapter.name);
  }

  setOptions(options?: LocalBusAdapterOptions): void {
    this.sequentialProcessing = options?.sequentialProcessing ?? false;
  }

  publish(data: ITransferData<TransferDataDto>): void {
    this.logger.debug({ ...data, sendData: true }, data.context);
    this.bus.next(data);
  }

  subscribe(handle: Function, data: ITransferData<TransferDataDto>, options?: { sequential?: boolean }): void {
    const isSequential = options !== undefined ? (options.sequential ?? false) : this.sequentialProcessing;
    const internalHandle = async (msg: ITransferData<TransferDataDto>) => {
      const run = async () => {
        try {
          await handle(msg);
          this.logger.debug({ ...msg, receivedData: true }, msg.context);
        } catch (error) {
          this.logger.error(
            { message: error.message, msg },
            LocalBusAdapter.name,
            msg.context
          );
        }
      };

      if (isSequential) {
        const key = `${msg.action}:${msg.context}:${msg.cid}`;
        const prev = this.queues.get(key) ?? Promise.resolve();
        const next = prev.then(() => run()).then(() => { }, () => { });
        this.queues.set(key, next);
      } else {
        run();
      }
    };
    this.bus
      .asObservable()
      .pipe(
        filter(
          (filter) =>
            filter.action === data.action && filter.context === data.context
        ),
        concatMap(task => from(internalHandle(task)))
      )
      .subscribe();
  }

  close() {
    this.bus.complete();
    this.bus = new Subject();
    this.queues.clear();
  }
}
