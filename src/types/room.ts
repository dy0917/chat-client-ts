import { TMessage } from '.';
import { TUser } from './user';

export type TRoom = {
  _id: string;
  users: Array<TUser>;
  messages?: Array<TMessage>;
};
