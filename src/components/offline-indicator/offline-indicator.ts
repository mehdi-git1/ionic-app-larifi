import { AppConstant } from './../../app/app.constant';
import { Component, Input } from '@angular/core';
import { EDossierPncObject } from '../../models/eDossierPncObject';
import * as moment from 'moment';

@Component({
  selector: 'offline-indicator',
  templateUrl: 'offline-indicator.html'
})
export class OfflineIndicatorComponent {

  @Input()
  object: EDossierPncObject;

  constructor() {
  }

  /**
   * Récupère la classe CSS à appliquer pour changer le visuel adéquat
   * @return la classe CSS à appliquer à l'indicateur
   */
  getCssClass(): string {

    if (this.hasBeenModifiedOffline()) {
      return 'modified-offline';
    }

    const now = moment();
    const offlineStorageDate = moment(this.object.offlineStorageDate, AppConstant.isoDateFormat);
    const offlineDuration = moment.duration(now.diff(offlineStorageDate)).asMilliseconds();

    const upToDateThreshold = moment.duration(12, 'hours').asMilliseconds();
    const outDatedThreshold = moment.duration(2, 'days').asMilliseconds();

    if (offlineDuration < upToDateThreshold) {
      return 'up-to-date';
    }
    if (offlineDuration < outDatedThreshold) {
      return 'out-dated';
    }
    return 'long-dated';
  }

  /**
   * Teste si l'objet a été modifié en offline, pour indiquer s'il est en attente d'uns synchronisation
   * @return vrai si l'objet est en attente de synchro, faux sinon
   */
  hasBeenModifiedOffline(): boolean {
    return this.object.offlineAction !== undefined && this.object.offlineAction !== null;
  }

}
