import { Injectable } from '@angular/core';

import { GenderEnum } from '../../enums/gender.enum';
import { PncModel } from '../../models/pnc.model';
import { DeviceService } from '../device/device.service';

@Injectable({ providedIn: 'root' })
export class GenderService {

  constructor(private deviceService: DeviceService) {

  }

  isMale(pnc: PncModel) {
    return pnc.gender === GenderEnum.M;
  }

  isFemale(pnc: PncModel) {
    return pnc.gender === GenderEnum.F;
  }

  /**
   * renvois l'url de l'avatar selon le sexe du pnc,
   * dans le cas ou le pnc n'a pas de photo
   * @param Male ou Female
   */
  getAvatarPicture(gender: GenderEnum) {
    if (gender === GenderEnum.M) {
      return this.deviceService.isBrowser() ? '../../assets/imgs/man-default-picture.svg' : './assets/imgs/man-default-picture.svg';
    }
    if (gender === GenderEnum.F) {
      return this.deviceService.isBrowser() ? '../../assets/imgs/woman-default-picture.svg' : './assets/imgs/woman-default-picture.svg';
    }
  }

}
