import { AppVersionModel } from '../../models/admin/app-version.model';
import { Injectable } from '@angular/core';

@Injectable()
export class AppVersionTransformerService {

  toAppVersion(object: any): AppVersionModel {
    return !object ?
      null :
      new AppVersionModel().fromJSON(object);
  }
}
