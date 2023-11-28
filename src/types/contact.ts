import { TUser } from './user';

export type TContact = {
  _id: string;
  users: Array<TUser>;
};
