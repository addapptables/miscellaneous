import { COMMAND_HANDLER_METADATA } from '../config/constants.config';
import { ICommandDto } from '../interfaces';
import { Command } from '../command';
import { Type } from '@nestjs/common';

export function CommandHandler<T extends Type<Command<ICommandDto>>>(command: T): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(COMMAND_HANDLER_METADATA, command, target);
    };
}
