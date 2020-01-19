import { ICommand } from '../commands/command.interface';
import { IEvent } from '../events/event.interface';
import { ICommandDto } from '../commands/command-dto-interface';
import { IEventDto } from '../events/event-dto.interface';
import { IHandler } from '../handler.interface';

export interface IOnInitAdapter {
  onInit(): Promise<void> | void;
}

export const IOnInitAdapter: keyof IOnInitAdapter = 'onInit';

export interface IBusAdapter {
  publish(data: ICommand<ICommandDto> | IEvent<IEventDto>): Promise<any>;
  subscribe(handle: IHandler<any>, metadata?: ICommand<ICommandDto> | IEvent<IEventDto>): Promise<any>;
  subscribeAll(handle: Function, metadata: ICommand<ICommandDto>[] | IEvent<IEventDto>[]): Promise<void>;
}
