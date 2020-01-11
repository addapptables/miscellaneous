import { ICommandDto } from './command-dto-interface';

export interface ICommand<T extends ICommandDto> {
    context: string;
    action: string;
    data: T;
    cid?: string;
}
