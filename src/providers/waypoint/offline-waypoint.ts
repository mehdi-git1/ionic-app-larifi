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
    return this.storageService.save(Entity.WAYPOINT, waypoint);
  }

  getCareerObjectiveWaypoints(careerObjectiveId: number): Promise<Waypoint[]> {
    return new Promise((resolve, reject) => {
      this.storageService.findAll(Entity.WAYPOINT).then(waypointList => {
        resolve(waypointList.filter(waypoint => {
          return waypoint.careerObjective.techId === careerObjectiveId;
        }));
      });
    });
  }

  getWaypoint(id: number): Promise<Waypoint> {
    return this.storageService.findOne(Entity.WAYPOINT, `${id}`);
  }

  delete(id: number): Promise<Waypoint> {
    return this.storageService.delete(Entity.WAYPOINT, `${id}`);
  }
}
