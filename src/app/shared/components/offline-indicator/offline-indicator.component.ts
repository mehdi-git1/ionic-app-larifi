import { Component, Input } from '@angular/core';

import * as moment from 'moment';

import { TransformerService } from '../../../core/services/transformer/transformer.service';
import { StorageService } from '../../../core/storage/storage.service';
import { EntityEnum } from '../../../core/enums/entity.enum';
import { OfflineService } from '../../../core/services/offline/offline.service';
import { AppConstant } from '../../../app.constant';
import { EDossierPncObjectModel } from '../../../core/models/e-dossier-pnc-object.model';


@Component({
  selector: 'offline-indicator',
  templateUrl: 'offline-indicator.component.html'
})
export class OfflineIndicatorComponent {

  _object: any;

  constructor(private offlineProvider: OfflineService,
    private storageService: StorageService,
    private transformerService: TransformerService) {
  }

  @Input()
  private type: EntityEnum;

  get object(): any {
    return this._object;
  }

  @Input()
  set object(val: any) {
    this._object = val;
    this.refreshOffLineDateOnCurrentObject();
  }

  /**
   * Récupère la classe CSS à appliquer pour changer le visuel adéquat
   * @return la classe CSS à appliquer à l'indicateur
   */
  getCssClass(): string {
    // Si aucune date de stockage offline, c'est que l'objet n'est pas en cache
    if (!this._object.offlineStorageDate) {
      return '';
    }

    const now = moment();
    const offlineStorageDate = moment(this._object.offlineStorageDate, AppConstant.isoDateFormat);
    const offlineDuration = moment.duration(now.diff(offlineStorageDate)).asMilliseconds();

    const upToDateThreshold = moment.duration(1, 'days').asMilliseconds();
    const outDatedThreshold = moment.duration(7, 'days').asMilliseconds();

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

  /**
   * Appelle la méthode refresh du provider de l'entité correspondante afin de mettre a jour la date de l'objet en cache sur l'objet online
   */
  refreshOffLineDateOnCurrentObject(): void {
    const transformedObject: EDossierPncObjectModel = this.transformerService.transformObject(this.type, this._object);

    if (transformedObject) {
      this.storageService.findOneAsync(this.type, transformedObject.getStorageId()).then(offlineObject => {
        const offlineData = this.transformerService.transformObject(this.type, offlineObject);
        this.offlineProvider.flagDataAvailableOffline(transformedObject, offlineData);
        this._object = transformedObject;
      });
    }

  }

}
