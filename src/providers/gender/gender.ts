import { Gender } from './../../models/gender';
import { Pnc } from './../../models/pnc';
<<<<<<< HEAD
=======
import { HttpClient } from '@angular/common/http';
>>>>>>> refs/remotes/origin/release/sprint1
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

  getAvatarPicture(gender: Gender) {
    if (gender === Gender.M) {
      return "../../assets/imgs/man-default-picture.png";
    }
    if (gender === Gender.F) {
      return "../../assets/imgs/woman-default-picture.png";
    }
  }

}
