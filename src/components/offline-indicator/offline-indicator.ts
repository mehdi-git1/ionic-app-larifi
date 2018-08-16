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

  _object: EDossierPncObject;

  constructor(private pncProvider: PncProvider, private rotationProvider: RotationProvider, private legProvider: LegProvider,
    private careerObjectiveProvider: CareerObjectiveProvider, private waypointProvider: WaypointProvider) {
  }


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
    if (this._object instanceof Pnc) {
      this.pncProvider.refresh(this._object);
    } else if (this._object instanceof Rotation) {
      this.rotationProvider.refresh(this._object);
    } else if (this._object instanceof Leg) {
      this.legProvider.refresh(this._object);
    } else if (this._object instanceof CareerObjective) {
      this.careerObjectiveProvider.refresh(this._object);
    } else if (this._object instanceof Waypoint) {
      this.waypointProvider.refresh(this._object);
    }
  }

}
