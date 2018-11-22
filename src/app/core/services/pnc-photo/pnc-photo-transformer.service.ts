import { Injectable } from '@angular/core';

import { PncPhotoModel } from '../../models/pnc-photo.model';

@Injectable()
export class PncPhotoTransformerService {

  constructor() {
  }

  toPncPhoto(object: any): PncPhotoModel {
    return !object ?
      null :
      new PncPhotoModel().fromJSON(object);
  }
}
