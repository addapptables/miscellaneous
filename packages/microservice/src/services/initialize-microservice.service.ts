import { Injectable } from '@nestjs/common';
import { CommandBus } from '../command-bus';
import { EventBus } from '../event-bus';

@Injectable()
export class InitializeMicroservice {

  constructor(
    private readonly eventsBus: EventBus,
    private readonly commandsBus: CommandBus
  ) { }

  async init() {
    await this.commandsBus.init();
    await this.eventsBus.init()
  }

}