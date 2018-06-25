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
    this.storageService.save(Entity.PNC, pnc);
  }

  getPnc(matricule: string): Promise<Pnc> {
    return this.storageService.findOne(Entity.PNC, matricule);
  }

}
