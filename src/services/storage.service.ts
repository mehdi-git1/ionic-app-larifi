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
    return new Promise((resolve, reject) => {
      const array = [];
      for (const entry of Object.keys(this.offlineMap[entity])) {
        array.push(this.offlineMap[entity][entry]);
      }
      resolve(array);
    });
  }

  findOne(entity: Entity, storageId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.offlineMap[entity][storageId]);
    });
  }

  save(entity: Entity, eDossierPncObject: EDossierPncObject): Promise<any> {
    return new Promise((resolve, reject) => {
      this.offlineMap[entity][eDossierPncObject.getStorageId()] = eDossierPncObject;
      this.persistOfflineMap();
      resolve(eDossierPncObject);
    });
  }

  deleteAll(entity: Entity): void {
    this.offlineMap[entity] = {};
    this.persistOfflineMap();
  }

  persistOfflineMap(): void {
    this.storage.set(this.config.appName, this.offlineMap);
  }


}
