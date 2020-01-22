import { Injectable } from '@nestjs/common';
import { CommandBus } from '../command-bus';
import { EventBus } from '../event-bus';
import { SagaService } from './saga/saga.service';

@Injectable()
export class InitializeMicroservice {

  constructor(
    private readonly eventsBus: EventBus,
    private readonly commandsBus: CommandBus,
    private readonly sagaService: SagaService
  ) { }

  async init() {
    await this.commandsBus.onInit();
    await this.eventsBus.onInit()
    await this.sagaService.onInit();
  }

}