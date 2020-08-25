import { TestingModule, Test } from '@nestjs/testing';
import { LoggerModule } from '../../src/logger/logger.module';
import { CraftsLogger } from '../../src/logger';
import { MICROSERVICE_CONFIG_PROVIDER } from '../../src/config/constants.config';
import { Scope } from '@nestjs/common';

describe('logger', () => {

    let testingModule: TestingModule;
    let loggerService: CraftsLogger;

    before(async () => {
        testingModule = await Test.createTestingModule({
            imports: [
                LoggerModule
            ],
            providers: [
                {
                    provide: MICROSERVICE_CONFIG_PROVIDER,
                    useValue: {
                        logger: {
                            debug: true,
                            error: true,
                            warn: true,
                            verbose: true
                        }
                    },
                    scope: Scope.TRANSIENT
                }
            ]
        })
        .compile();
        await testingModule.init();
        loggerService = await testingModule.resolve<CraftsLogger>(CraftsLogger);
    })

    after(async () => {
        await testingModule.close();
    })

    it('should print debug message', () => {
        loggerService.debug('Debug crafts');
    });

    it('should not print debug message', () => {
        loggerService.configuration.logger.debug = false;
        loggerService.debug('Debug crafts');
    });

    it('should print warn message', () => {
        loggerService.warn('Warn crafts');
    });

    it('should not print warn message', () => {
        loggerService.configuration.logger.warn = false;
        loggerService.warn('Warn crafts');
    });

    it('should print error message', () => {
        loggerService.error('Error crafts');
    });

    it('should not print error message', () => {
        loggerService.configuration.logger.error = false;
        loggerService.error('Error crafts');
    });

    it('should print verbose message', () => {
        loggerService.verbose('Verbose crafts');
    });

    it('should not print verbose message', () => {
        loggerService.configuration.logger.verbose = false;
        loggerService.verbose('Verbose crafts');
    });
});