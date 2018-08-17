import { PncPhoto } from './../../models/pncPhoto';
import { Injectable } from '@angular/core';

@Injectable()
export class PncPhotoTransformerProvider {

  constructor() {
  }

  toPncPhotoFromBlob(object: Blob, matricule: string): PncPhoto {
    const pncPhoto = new PncPhoto();
    pncPhoto.matricule = matricule;
    pncPhoto.photo = object;
    return pncPhoto;
  }

  toPncPhoto(object: any): PncPhoto {
    return !object ?
      null :
      new PncPhoto().fromJSON(object);
  }
}
