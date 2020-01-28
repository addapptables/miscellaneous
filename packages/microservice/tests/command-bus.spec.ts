// import { Test } from '@nestjs/testing';


// import { RabbitMQBusAdapter, MicroserviceModule } from '../src';
// import { TestCommandHandler } from '../src/utils/_test/command-handler';
// import { HandlerTypes } from '../src/enums/handler-types.enum';

// describe.only('command bus', () => {
//   let _module;

//   before(async () => {
//     _module = await Test.createTestingModule({
//       imports: [
//         MicroserviceModule.withConfig({
//           type: HandlerTypes.ALL,
//           adapter: new RabbitMQBusAdapter('test', 'amqp://local:password@0.0.0.0?heartbeat=30', 'test-service'),
//           // adapter: null,
//         }, [TestCommandHandler]),
//       ],
//       providers: [],
//     }).compile();

//     await _module
//       .get(MicroserviceModule)
//       .onModuleInit();
//   });

//   it('should identify command handle registered', () => {
//     // const commandBus = _module.get(CommandBus);
//     // const handleTarget = commandBus.handlers.get(TestCommand.name);

//     // chai.expect(handleTarget.constructor.name).to.be.equal(TestCommandHandler.name);
//   });

//   // it('should identify adapter handle registered', () => {
//   //   const commandBus = _module.get(CommandBus);

//   //   chai.expect(commandBus.adapter.constructor.name).to.be.equal(LocalBusAdapter.name);
//   // });

//   // it('should publish a command', () => {
//   //   const testCommandData: TestCommand = new TestCommand({ id: '12345', name: 'Test' });
//   //   const testCommandHandler = _module.get(TestCommandHandler);

//   //   sinon.stub(testCommandHandler, 'handle')
//   //     .callsFake(command => chai.expect(command).to.be.equals(testCommandData));

//   //   commandBus.publish(testCommandData);
//   // });


// });
