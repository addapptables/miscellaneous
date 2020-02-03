import * as sinon from 'sinon';
import * as chai from 'chai';
import { InitializeMicroservice } from '../../src/services/initialize-microservice.service';
import { EventBus } from '../../src/event-bus';
import { CommandBus } from '../../src/command-bus';
import { SagaService } from '../../src/services/saga/saga.service';

describe('Initialize Microservice Service', () => {

  let initializeMicroserviceInstance;
  const sandbox = sinon.createSandbox();
  let eventBusSpy, commandBusSpy, sagaServiceSpy;
  const eventsBus: EventBus = <EventBus>{ onInit: () => { } };
  const commandsBus: CommandBus = <CommandBus>{ onInit: () => { } };
  const sagaService: SagaService = <SagaService>{ onInit: () => { } };

  before(() => {
    eventBusSpy = sandbox.spy(eventsBus, 'onInit');
    commandBusSpy = sandbox.spy(commandsBus, 'onInit');
    sagaServiceSpy = sandbox.spy(sagaService, 'onInit');

    initializeMicroserviceInstance = new InitializeMicroservice(
      eventsBus, commandsBus, sagaService
    );
  });

  after(() => {
    sandbox.restore();
  });

  it('should call onInit method from all dependencies', async () => {
    await initializeMicroserviceInstance.init();
    chai.expect(eventBusSpy.calledOnce).to.be.true;
    chai.expect(commandBusSpy.calledOnce).to.be.true;
    chai.expect(sagaServiceSpy.calledOnce).to.be.true;
  });

});
