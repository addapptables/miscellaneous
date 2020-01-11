// import { Test } from '@nestjs/testing';
// import * as chai from 'chai';
// import * as sinon from 'sinon';

// import { CqrsModule, EventBus, LocalBusAdapter } from '.';
// import { TestEventHandler } from './utils/_test/event-handler';
// import { TestEvent } from './utils/_test/event';

// describe('event bus', () => {
//   let _module;
//   let eventBus: EventBus;

//   before(async () => {
//     _module = await Test.createTestingModule({
//       imports: [CqrsModule],
//       providers: [TestEventHandler],
//     }).compile();

//     await _module
//       .get(CqrsModule)
//       .onModuleInit();

//     eventBus = _module.get(EventBus);

//     await eventBus
//       .setAdapter(new LocalBusAdapter())
//       .init();
//   });

//   it('should identify event handle registered', () => {
//     const eventBus = _module.get(EventBus);
//     const handleTarget = eventBus.handlers.get(TestEvent.name);

//     chai.expect(handleTarget.constructor.name).to.be.equal(TestEventHandler.name);
//   });

//   it('should identify event handle registered', () => {
//     const eventBus = _module.get(EventBus);

//     chai.expect(eventBus.adapter.constructor.name).to.be.equal(LocalBusAdapter.name);
//   });

//   it('should publish an event', () => {
//     const testEventData: TestEvent = new TestEvent({ id: '12345', name: 'Test' });
//     const testEventHandler = _module.get(TestEventHandler);

//     sinon.stub(testEventHandler, 'handle')
//       .callsFake(event => chai.expect(event).to.be.equals(testEventData));

//     eventBus.publish(testEventData);
//   });
// });
