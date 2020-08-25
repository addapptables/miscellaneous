import * as sinon from 'sinon';
import * as chai from 'chai';
import { InitializeMicroservice } from '../../src/services/initialize-microservice.service';
import { EventBus } from '../../src/event-bus';
import { CommandBus } from '../../src/command-bus';
import { BrokerService } from '../../src/services/broker/broker.service';
import { QueryBus } from '../../src/query-bus';
import { ModuleRef } from '@nestjs/core';
import { CraftsLoggerMock } from '../mocks/crafts-logger.mock';
import { Class } from '../../src/types';

describe('Initialize Microservice Service', () => {

  let initializeMicroserviceInstance;
  const sandbox = sinon.createSandbox();
  let eventBusSpy, commandBusSpy, queryBusSpy, brokerServiceSpy, moduleRefSpy;
  const eventsBus: EventBus = <EventBus>{ onInit: (bus) => { } };
  const commandsBus: CommandBus = <CommandBus>{ onInit: (bus) => { } };
  const queryBus: QueryBus = <QueryBus>{ onInit: (bus) => { } };
  const brokerService: BrokerService = <BrokerService>{ onInit: (config) => { } };
  const moduleRef: ModuleRef = <ModuleRef>{
    get: (options) => { return { adapter: { adapterPrototype: new CraftsLoggerMock({}) } } }, resolve(type: Class<any>) {
      return <any>new CraftsLoggerMock({});
    }
  };

  before(() => {
    eventBusSpy = sandbox.spy(eventsBus, 'onInit');
    commandBusSpy = sandbox.spy(commandsBus, 'onInit');
    queryBusSpy = sandbox.spy(queryBus, 'onInit');
    brokerServiceSpy = sandbox.spy(brokerService, 'onInit');
    moduleRefSpy = sandbox.spy(moduleRef, 'get');

    initializeMicroserviceInstance = new InitializeMicroservice(
      eventsBus, commandsBus, queryBus, brokerService, moduleRef
    );
  });

  after(() => {
    sandbox.restore();
  });

  it('should call onInit method from all dependencies', async () => {
    await initializeMicroserviceInstance.init();
    chai.expect(eventBusSpy.calledOnce).to.be.true;
    chai.expect(commandBusSpy.calledOnce).to.be.true;
    chai.expect(queryBusSpy.calledOnce).to.be.true;
    chai.expect(brokerServiceSpy.calledOnce).to.be.true;
    chai.expect(moduleRefSpy.calledOnce).to.be.true;
  });

});
