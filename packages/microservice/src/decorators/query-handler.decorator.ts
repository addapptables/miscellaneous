import { QUERY_HANDLER_METADATA } from '../config/constants.config';
import { Query } from '../query';
import { IQueryDto } from '../interfaces';
import { Type } from '@nestjs/common';

export function QueryHandler<T extends Type<Query<IQueryDto>>>(query: T): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata(QUERY_HANDLER_METADATA, query, target);
  };
}
