import { UserMessageModel } from './../../models/admin/user-message.model';
import { Injectable } from '@angular/core';

@Injectable()
export class UserMessageTransformerService {

  constructor() {
  }

  toUserMessage(object: any): UserMessageModel {
    return !object ?
      null :
      new UserMessageModel().fromJSON(object);
  }
}
