import { Pnc } from './../../models/pnc';
import { CareerObjectiveProvider } from './../career-objective/career-objective';
import { WaypointProvider } from './../waypoint/waypoint';
import { PncProvider } from './../pnc/pnc';
import { Injectable } from '@angular/core';

@Injectable()
export class OfflineProvider {

  constructor(private pncProvider: PncProvider,
    private careerObjectiveProvider: CareerObjectiveProvider,
    private waypointProvider: WaypointProvider) {
  }

  /**
   * Charge toutes les ressources nécessaires à la consultation hors ligne d'un eDossier
   * @param pnc le pnc dont on souhaite récupérer le eDossier
   */
  downloadPncEdossier(pnc: Pnc) {
    this.pncProvider.getPnc(pnc.matricule, true);
    this.careerObjectiveProvider.getCareerObjectiveList(pnc.matricule, true).then(careerObjectiveList => {
      for (const careerObjective of careerObjectiveList) {
        this.careerObjectiveProvider.getCareerObjective(careerObjective.techId, true);
        this.waypointProvider.getCareerObjectiveWaypoints(careerObjective.techId, true).then(waypointList => {
          for (const waypoint of waypointList) {
            this.waypointProvider.getWaypoint(waypoint.techId, true);
          }
        }, error => { });
      }
    }, error => { });
  }

}
