import { Injectable } from '@nestjs/common';
import { CommandBus } from '../command-bus';
import { EventBus } from '../event-bus';
import { Saga } from './saga.service';

@Injectable()
export class InitializeMicroservice {

  constructor(
    // private readonly eventsBus: EventBus,
    private readonly commandsBus: CommandBus,
    private readonly saga: Saga
  ) { }

  async init() {
    await this.commandsBus.init();
    await this.saga.onInit();
    // TODO: apply logic that asks for the config based on that init the buses
    // await this.eventsBus.init()
  }

}