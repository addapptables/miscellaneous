import { ICommand } from '../commands/command.interface';
import { IEvent } from '../events/event.interface';
import { ICommandDto } from '../commands/command-dto-interface';
import { IEventDto } from '../events/event-dto.interface';
import { Handler, TypeHandler } from '../../types';

export interface IOnInitAdapter {
  onInit(): Promise<void> | void;
}

export interface IBusAdapter {
  publish(data: ICommand<ICommandDto> | IEvent<IEventDto>): Promise<any> | any;
  subscribe(data: TypeHandler, metadata?: ICommand<ICommandDto> | IEvent<IEventDto>): Promise<any> | any;
}
