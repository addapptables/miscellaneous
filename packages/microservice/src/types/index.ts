import { Type } from '@nestjs/common';

import { ICommandHandler } from '../interfaces/commands/command-handler.interface';
import { ICommandDto } from '../interfaces/commands/command-dto-interface';
import { IEventHandler } from '../interfaces/events/event-handler.interface';
import { IEventDto } from '../interfaces/events/event-dto.interface';
import { ICommand, IEvent } from '../interfaces';

export type TypeHandler = Type<ICommandHandler<ICommand<ICommandDto>> | IEventHandler<IEvent<IEventDto>>>;
export type Handler = ICommandHandler<ICommand<ICommandDto>> | IEventHandler<IEvent<IEventDto>>;
