import { CareerObjectiveTransformerProvider } from './../career-objective/career-objective-transformer';
import { StorageService } from './../../services/storage.service';
import { Injectable, EventEmitter } from '@angular/core';
import { Entity } from '../../models/entity';
import { OnlineCareerObjectiveProvider } from '../career-objective/online-career-objective';

@Injectable()
export class SynchronizationProvider {

  constructor(private storageService: StorageService,
    private careerObjectiveTransformer: CareerObjectiveTransformerProvider,
    private onlineCareerObjectiveProvider: OnlineCareerObjectiveProvider) {
  }

  synchronizeOfflineData() {
    const careerObjectivesToCreate = this.storageService.findAllEDossierPncObjectToCreate(Entity.CAREER_OBJECTIVE);
    const waypointsToCreate = this.storageService.findAllEDossierPncObjectToCreate(Entity.WAYPOINT);


    for (const careerObjective of careerObjectivesToCreate) {
      careerObjective.waypoints = waypointsToCreate.filter(waypoint => {
        return waypoint.careerObjective.techId === careerObjective.techId;
      });
    }
    console.log('Objectifs à créer', careerObjectivesToCreate);



  }

}
