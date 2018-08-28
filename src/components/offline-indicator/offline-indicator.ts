import { WaypointTransformerProvider } from './../../providers/waypoint/waypoint-transformer';
import { CareerObjectiveTransformerProvider } from './../../providers/career-objective/career-objective-transformer';
import { StorageService } from './../../services/storage.service';
import { Entity } from './../../models/entity';
import { WaypointProvider } from './../../providers/waypoint/waypoint';
import { CareerObjectiveProvider } from './../../providers/career-objective/career-objective';
import { LegProvider } from './../../providers/leg/leg';
import { RotationProvider } from './../../providers/rotation/rotation';
import { Waypoint } from './../../models/waypoint';
import { CareerObjective } from './../../models/careerObjective';
import { Leg } from './../../models/leg';
import { PncTransformerProvider } from './../../providers/pnc/pnc-transformer';
import { OfflineProvider } from './../../providers/offline/offline';
import { PncProvider } from './../../providers/pnc/pnc';
import { Pnc } from './../../models/pnc';
import { AppConstant } from './../../app/app.constant';
import { Component, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { EDossierPncObject } from '../../models/eDossierPncObject';
import * as moment from 'moment';
import { Rotation } from '../../models/rotation';



@Component({
  selector: 'offline-indicator',
  templateUrl: 'offline-indicator.html'
})
export class OfflineIndicatorComponent {

  _object: any;

  constructor(private pncProvider: PncProvider, private pncTransformer: PncTransformerProvider, private careerObjectiveTransformer: CareerObjectiveTransformerProvider, private waypointTransformer: WaypointTransformerProvider,
    private careerObjectiveProvider: CareerObjectiveProvider, private waypointProvider: WaypointProvider,
    private offlineProvider: OfflineProvider, private storageService: StorageService) {
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
    const transformedObject: EDossierPncObject = this.transformObject(this.type, this._object);

    if (transformedObject) {
      this.storageService.findOneAsync(this.type, transformedObject.getStorageId()).then(offlineObject => {
        const offlineData = this.transformObject(this.type, offlineObject);
        this.offlineProvider.flagDataAvailableOffline(transformedObject, offlineData);
        this._object = transformedObject;
      });
    }

  }

  /**
   * Appelle le bon transformer et transforme l'objet
   * @param type type de l'objet
   * @param objectToTransform objet a transformer
   */
  private transformObject(type: Entity, objectToTransform: any): EDossierPncObject {
    if (Entity.PNC === this.type) {
      return this.pncTransformer.toPnc(objectToTransform);
    } else if (Entity.CAREER_OBJECTIVE === this.type) {
      return this.careerObjectiveTransformer.toCareerObjective(objectToTransform);
    } else if (Entity.WAYPOINT === this.type) {
      return this.waypointTransformer.toWaypoint(objectToTransform);
    }
  }
}
