import { ICommand } from './interfaces/commands/command.interface';
import { ICommandDto } from './interfaces/commands/command-dto-interface';

export abstract class Command<T extends ICommandDto> implements ICommand<T> {
    context: string;
    action: string;

    constructor(
        readonly data: T,
        readonly cid?: string
    ) { }
}
