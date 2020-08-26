import { Module, Global } from '@nestjs/common';
import { CraftsLogger } from './services/logger.service';

@Global()
@Module({
  providers: [
    CraftsLogger,
  ],
  exports: [
    CraftsLogger,
  ],
})
export class LoggerModule { }