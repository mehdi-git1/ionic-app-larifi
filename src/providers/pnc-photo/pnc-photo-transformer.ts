import { PncPhoto } from './../../models/pncPhoto';
import { Injectable } from '@angular/core';

@Injectable()
export class PncPhotoTransformerProvider {

  constructor() {
  }

  toPncPhoto(object: any): PncPhoto {
    return !object ?
      null :
      new PncPhoto().fromJSON(object);
  }
}
