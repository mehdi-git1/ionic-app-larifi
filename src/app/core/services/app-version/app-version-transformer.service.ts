import { Injectable } from '@angular/core';

import { AppVersionModel } from '../../models/admin/app-version.model';


@Injectable()
export class AppVersionTransformerService {

  toAppVersion(object: any): AppVersionModel {
    return !object ?
      null :
      new AppVersionModel().fromJSON(object);
  }
}
