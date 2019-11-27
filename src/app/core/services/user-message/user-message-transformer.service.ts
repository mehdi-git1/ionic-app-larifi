import { Injectable } from '@angular/core';

import { UserMessageModel } from '../../models/admin/user-message.model';

@Injectable({ providedIn: 'root' })
export class UserMessageTransformerService {

  toUserMessage(object: any): UserMessageModel {
    return !object ?
      null :
      new UserMessageModel().fromJSON(object);
  }
}
