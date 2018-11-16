import { TransformerService } from '../../../../services/transformer.service';
import { WaypointTransformerProvider } from '../../../core/services/waypoint/waypoint-transformer';
import { CareerObjectiveTransformerProvider } from '../../../core/services/career-objective/career-objective-transformer';
import { StorageService } from '../../../../services/storage.service';
import { Entity } from '../../../core/models/entity';
import { WaypointProvider } from '../../../core/services/waypoint/waypoint';
import { CareerObjectiveProvider } from '../../../core/services/career-objective/career-objective';
import { LegProvider } from '../../../core/services/leg/leg';
import { RotationProvider } from '../../../core/services/rotation/rotation';
import { Waypoint } from '../../../core/models/waypoint';
import { CareerObjective } from '../../../core/models/careerObjective';
import { Leg } from '../../../core/models/leg';
import { PncTransformerProvider } from '../../../core/services/pnc/pnc-transformer';
import { OfflineProvider } from '../../../core/services/offline/offline';
import { PncProvider } from '../../../core/services/pnc/pnc';
import { Pnc } from '../../../core/models/pnc';
import { AppConstant } from '../../../app.constant';
import { Component, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { EDossierPncObject } from '../../../core/models/eDossierPncObject';
import * as moment from 'moment';
import { Rotation } from '../../../core/models/rotation';



@Component({
  selector: 'offline-indicator',
  templateUrl: 'offline-indicator.html'
})
export class OfflineIndicatorComponent {

  _object: any;

  constructor(private offlineProvider: OfflineProvider,
    private storageService: StorageService,
    private transformerService: TransformerService) {
  }

  @Input()
  private type: Entity;

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
    const transformedObject: EDossierPncObject = this.transformerService.transformObject(this.type, this._object);

    if (transformedObject) {
      this.storageService.findOneAsync(this.type, transformedObject.getStorageId()).then(offlineObject => {
        const offlineData = this.transformerService.transformObject(this.type, offlineObject);
        this.offlineProvider.flagDataAvailableOffline(transformedObject, offlineData);
        this._object = transformedObject;
      });
    }

  }

}
