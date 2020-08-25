import { Injectable, Scope, Logger } from '@nestjs/common';
import { MicroserviceOptions } from '../../interfaces/microservice-options.interface';
import { MICROSERVICE_CONFIG_PROVIDER } from '../../config/constants.config';
import { ModuleRef } from '@nestjs/core';

@Injectable({ scope: Scope.TRANSIENT })
export class CraftsLogger extends Logger {

  public readonly configuration: MicroserviceOptions;

  constructor(
    moduleRef: ModuleRef
  ) {
    super();
    this.configuration = moduleRef.get(MICROSERVICE_CONFIG_PROVIDER, { strict: false });
  }

  debug(message: any, context?: string): void {
    if (this.configuration?.logger?.debug === false) {
      return;
    }
    super.debug(message, context);
  }

  error(message: any, trace?: string, context?: string) {
    if (this.configuration?.logger?.error === false) {
      return;
    }
    super.error(message, trace, context);
  };

  warn(message: any, context?: string) {
    if (this.configuration?.logger?.warn === false) {
      return;
    }
    super.warn(message, context);
  }

  verbose(message: any, context?: string) {
    if (this.configuration?.logger?.verbose === false) {
      return;
    }
    super.verbose(message, context);
  }

}