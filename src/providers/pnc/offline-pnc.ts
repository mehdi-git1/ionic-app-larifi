import { Rotation } from './../../models/rotation';
import { Entity } from './../../models/entity';
import { StorageService } from './../../services/storage.service';
import { Pnc } from './../../models/pnc';
import { Injectable } from '@angular/core';
import { EDossierPncObject } from '../../models/eDossierPncObject';

@Injectable()
export class OfflinePncProvider {

  constructor(private storageService: StorageService) {
  }

  save(pnc: Pnc): void {
    this.storageService.saveAsync(Entity.PNC, pnc);
  }

  getPnc(matricule: string): Promise<Pnc> {
    return this.storageService.findOneAsync(Entity.PNC, matricule);
  }

  getUpcomingRotations(matricule: string): Promise<Rotation[]> {
    return new Promise((resolve, reject) => {
      resolve([]);
    });
  }

  getLastPerformedRotation(matricule: string): Promise<Rotation> {
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }

}
