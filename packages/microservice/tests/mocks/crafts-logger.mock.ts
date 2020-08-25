import { Logger, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CraftsLogger } from '../../src/logger/services/logger.service';

@Injectable()
export class CraftsLoggerMock extends CraftsLogger {

  constructor(moduleRef) {
    super({ get: () => { return {}; } } as any);
  }

  log(message: string) {
  }
  error(message: string, trace: string) {
  }
  warn(message: string) {
  }
  debug(message: string) {
  }
  verbose(message: string) {
  }
}