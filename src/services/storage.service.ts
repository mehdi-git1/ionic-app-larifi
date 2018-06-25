import { Entity } from './../models/entity';
import { AuthenticatedUser } from './../models/authenticatedUser';
import { Config } from './../configuration/environment-variables/config';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { EDossierPncObject } from '../models/eDossierPncObject';

@Injectable()
export class StorageService {

  private offlineMap;

  constructor(
    private storage: Storage,
    private config: Config) {
  }

  initOfflineMap(): Promise<any> {
    return this.storage.get(this.config.appName).then(offlineMap => {
      this.offlineMap = this.updateMap(offlineMap);
      this.persistOfflineMap();
    });
  }

  updateMap(offlineMap): void {
    if (offlineMap === null) {
      offlineMap = {};
    }
    for (const entity in Entity) {
      if (offlineMap[entity] === undefined) {
        offlineMap[entity] = {};
      }
    }
    return offlineMap;
  }

  findAll(entity: Entity): Promise<any[]> {
    return this.offlineMap[entity];
  }

  findOne(entity: Entity, storageId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.offlineMap[entity][storageId]);
    });
  }

  save(entity: Entity, eDossierPncObject: EDossierPncObject): void {
    this.offlineMap[entity][eDossierPncObject.getStorageId()] = eDossierPncObject;
    this.persistOfflineMap();
  }

  deleteAll(entity: Entity): void {
    this.offlineMap[entity] = {};
    this.persistOfflineMap();
  }

  persistOfflineMap(): void {
    this.storage.set(this.config.appName, this.offlineMap);
  }


}
