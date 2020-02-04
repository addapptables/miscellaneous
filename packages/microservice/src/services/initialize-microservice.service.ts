import { Injectable } from '@nestjs/common';
import { CommandBus } from '../command-bus';
import { EventBus } from '../event-bus';
import { BrokerService } from './broker/broker.service';

@Injectable()
export class InitializeMicroservice {

  constructor(
    private readonly eventsBus: EventBus,
    private readonly commandsBus: CommandBus,
    private readonly brokerService: BrokerService
  ) { }

  async init() {
    await this.eventsBus.onInit();
    await this.commandsBus.onInit();
    await this.brokerService.onInit();
  }

}