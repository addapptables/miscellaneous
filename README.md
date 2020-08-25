<p align="center">
  <a href="http://addapptables.com/admin/dashboard" target="blank"><img src="http://addapptables.com/assets/images/logo/addaptables.svg" width="120" alt="Nest Logo" /></a>
</p>

  <p align="center">Addapptables microservices is a library for nodejs oriented to microservices with pattern design CQRS</p>
    <p align="center">
<a href="https://badge.fury.io/js/%40addapptables%2Fmicroservice"><img src="https://badge.fury.io/js/%40addapptables%2Fmicroservice.svg" alt="npm version" height="18"></a>
<a href="http://addapptables.com/admin/dashboard" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://circleci.com/gh/addapptables/miscellaneous" target="_blank"><img src="https://circleci.com/gh/addapptables/miscellaneous.svg?style=shield" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
</p>



# Addapptables microservices with cqrs

- Addapptables microservices is a library for nodejs oriented to microservices,
this library is made to work with [nestjs](https://docs.nestjs.com/)

- [Example code](https://github.com/addapptables/boilerplate)

## Getting Started
To get started, let's install the package through npm:

```
npm i @addapptables/microservice
```

If you use rabbitmq install
```
npm i amqplib
```

## How to use
- Available adapters:
- KafkaBusAdapter
- LocalBusAdapter (rx)
- MqttBusAdapter
- NatsBusAdapter
- RabbitMQBusAdapter
- RedisBusAdapter

- Example with rabbitmq
```typescript
import { MicroserviceModule, ManagerAdapterBus, RabbitMQBusAdapter } from '@addapptables/microservice';
@Module({
  imports: [
    MicroserviceModule.withConfig({
      adapter: ManagerAdapterBus.getInstance(RabbitMQBusAdapter)
      .withConfig({
        exchange: 'search-service',
        host: process.env.BUS_URL
      })
      .build(),
      logger: {
        debug: false
      }
    })
  ],
  controllers: [
    ...
  ],
  providers: [
    ...
  ],
})
export class AppModule {}
```

- Create commands

```typescript
import { Command } from '@addapptables/microservice';

export class ClassCommandModel implements ICommandDto {
    id: string;
}

export class CreateUserCommand extends Command<ClassCommandModel> {
    public readonly action = 'action';
    public readonly context = 'context';

    constructor(public readonly data: ClassCommandModel) { super(data); }
}
```

- Create command handlers
```typescript
import { ICommandHandler, CommandHandler, ICommand } from '@addapptables/cqrs';

@CommandHandler(CreateUserCommand)
export class CommandHandler implements ICommandHandler<ClassCommandModel> {

    handle(event: ClassCommandModel): any {
      console.log(event);
      // call your domain service
    }

}

// ChildModule
@Module({
  imports: [
    ...
  ],
  controllers: [
    ...
  ],
  providers: [
    CommandHandler // very important
  ],
})
export class ChildModule {}
```

- Create query

```typescript
export class ClassQueryModel implements IQueryDto {
    id: string;
}

export class CreateUserQuery extends Query<ClassQueryModel> {
    public readonly action = 'action';
    public readonly context = 'context';

    constructor(public readonly data: ClassQueryModel) { super(data); }
}
```

- Create query handlers
```typescript
@QueryHandler(ClassQueryModel)
export class FindOneUserHandler implements IQueryHandler<ClassQueryModel> {

  constructor(private readonly userService: UserDomainService) { }

  handle(event: ClassQueryModel): any {
    return this.userService.findOneByQuery(event.data);
  }

}

// ChildModule
@Module({
  imports: [
    ...
  ],
  controllers: [
    ...
  ],
  providers: [
    FindOneUserHandler // very important
  ],
})
export class ChildModule {}
```

- Create events

```typescript

export class ClassEventModel implements IEventDto {
    id: string;
}

export class UserCreatedEvent extends Command<ClassEventModel> {
    public readonly action = 'action';
    public readonly context = 'context';

    constructor(public readonly data: ClassEventModel) { super(data); }
}
```

```typescript
@EventHandler(UserCreatedEvent)
export class ActionHandler implements IEventHandler<UserCreatedEvent> {

    handle(event: UserCreatedEvent): any {
      console.log(event);
      // call your domain service
    }

}

// ChildModule
@Module({
  imports: [
    ...
  ],
  controllers: [
    ...
  ],
  providers: [
    ActionHandler // very important
  ],
})
export class ChildModule {}
```


