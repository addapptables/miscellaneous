// import { Test } from '@nestjs/testing';
// import * as chai from 'chai';
// import * as sinon from 'sinon';

// import { CqrsModule, CommandBus, LocalBusAdapter } from './';
// import { TestCommand } from './utils/_test/command';
// import { TestCommandHandler } from './utils/_test/command-handler';

// describe('command bus', () => {
//   let _module;
//   let commandBus: CommandBus;

//   before(async () => {
//     _module = await Test.createTestingModule({
//       imports: [CqrsModule],
//       providers: [TestCommandHandler],
//     }).compile();

//     await _module
//       .get(CqrsModule)
//       .onModuleInit();

//     commandBus = _module.get(CommandBus);

//     await commandBus
//       .setAdapter(new LocalBusAdapter())
//       .init();
//   });

//   it('should identify command handle registered', () => {
//     const commandBus = _module.get(CommandBus);
//     const handleTarget = commandBus.handlers.get(TestCommand.name);

//     chai.expect(handleTarget.constructor.name).to.be.equal(TestCommandHandler.name);
//   });

//   it('should identify adapter handle registered', () => {
//     const commandBus = _module.get(CommandBus);

//     chai.expect(commandBus.adapter.constructor.name).to.be.equal(LocalBusAdapter.name);
//   });

//   it('should publish a command', () => {
//     const testCommandData: TestCommand = new TestCommand({ id: '12345', name: 'Test' });
//     const testCommandHandler = _module.get(TestCommandHandler);

//     sinon.stub(testCommandHandler, 'handle')
//       .callsFake(command => chai.expect(command).to.be.equals(testCommandData));

//     commandBus.publish(testCommandData);
//   });
// });
