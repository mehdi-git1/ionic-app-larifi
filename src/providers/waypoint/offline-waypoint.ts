import { OfflineAction } from './../../models/offlineAction';
import { Entity } from './../../models/entity';
import { Waypoint } from './../../models/waypoint';
import { Injectable } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { CareerObjective } from '../../models/careerObjective';

@Injectable()
export class OfflineWaypointProvider {

  constructor(private storageService: StorageService) {
  }

  store(waypoint: Waypoint, careerObjectiveId: number): Promise<Waypoint> {
    return this.createOrUpdate(waypoint, careerObjectiveId);
  }

  createOrUpdate(waypoint: Waypoint, careerObjectiveId: number): Promise<Waypoint> {
    waypoint.careerObjective = new CareerObjective();
    waypoint.careerObjective.techId = careerObjectiveId;
    return this.storageService.saveAsync(Entity.WAYPOINT, waypoint);
  }

  getCareerObjectiveWaypoints(careerObjectiveId: number): Promise<Waypoint[]> {
    return new Promise((resolve, reject) => {
      const waypointList = this.storageService.findAll(Entity.WAYPOINT);
      resolve(waypointList.filter(waypoint => {
        return waypoint.careerObjective.techId === careerObjectiveId && waypoint.offlineAction !== OfflineAction.DELETE;
      }));
    });
  }

  getWaypoint(id: number): Promise<Waypoint> {
    return this.storageService.findOneAsync(Entity.WAYPOINT, `${id}`);
  }

  delete(id: number): Promise<Waypoint> {
    return this.storageService.deleteAsync(Entity.WAYPOINT, `${id}`);
  }
}
