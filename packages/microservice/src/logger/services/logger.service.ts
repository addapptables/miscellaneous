import { Injectable, Scope, Logger } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class CraftsLogger extends Logger {

  debug(message: any, context?: string): void {
    if (!process.env.LOGGER_DEBUG) {
      return;
    }
    super.debug(message, context);
  }

  error(message: any, trace?: string, context?: string) {
    if (!process.env.LOGGER_ERROR) {
      return;
    }
    super.error(message, trace, context);
  };

  warn(message: any, context?: string) {
    if (!process.env.LOGGER_WARN) {
      return;
    }
    super.warn(message, context);
  }

  verbose(message: any, context?: string) {
    if (!process.env.LOGGER_VERBOSE) {
      return;
    }
    super.verbose(message, context);
  }

}