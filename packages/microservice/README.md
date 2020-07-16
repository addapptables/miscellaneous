# Addapptables microservices with cqrs

- Addapptables microservices is a library for nodejs oriented to microservices,
this library is made to work with [nestjs](https://docs.nestjs.com/)

- [Example code](https://github.com/addapptables/example-service)

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

- Configuration rabbitmq
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
      .withSagaConfig({
        exchange: 'saga-search',
        host: process.env.BUS_URL
      })
      .build()
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
```


