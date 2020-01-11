import { ICommand } from './command.interface';
import { ICommandDto } from './command-dto-interface';

export interface ICommandHandler<T extends ICommand<ICommandDto>> {
  handle(event: T): void;
}
