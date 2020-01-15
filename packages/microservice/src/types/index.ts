import { Type } from '@nestjs/common';
import { IHandler } from '../interfaces';

export type TypeHandler = Type<IHandler<any>>;
export type Handler = IHandler<any>;
export type Class<T = any> = { new(...args: any[]): T; }