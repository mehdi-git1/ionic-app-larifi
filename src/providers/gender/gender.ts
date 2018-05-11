import { Gender } from './../../models/gender';
import { Pnc } from './../../models/pnc';
import { Injectable } from '@angular/core';


@Injectable()
export class GenderProvider {

  constructor() {

  }

  isMale(pnc: Pnc) {
    return pnc.gender === Gender.M;
  }

  isFemale(pnc: Pnc) {
    return pnc.gender === Gender.F;
  }

  /** 
   * renvois l'url de l'avatar selon le sexe du pnc, 
   * dans le cas ou le pnc n'a pas de photo 
   * */
  getAvatarPicture(gender: Gender) {
    if (gender === Gender.M) {
      return '../../assets/imgs/man-default-picture.png';
    }
    if (gender === Gender.F) {
      return '../../assets/imgs/woman-default-picture.png';
    }
  }

}
