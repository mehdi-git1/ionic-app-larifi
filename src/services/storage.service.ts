import { DatePipe } from '@angular/common';
import { Entity } from './../models/entity';
import { AuthenticatedUser } from './../models/authenticatedUser';
import { Config } from './../configuration/environment-variables/config';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { EDossierPncObject } from '../models/eDossierPncObject';

@Injectable()
export class StorageService {

  private offlineMap;
  private sequenceGeneratorName = 'sequence';

  constructor(
    private storage: Storage,
    private config: Config,
    private datePipe: DatePipe) {
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
    if (offlineMap[this.sequenceGeneratorName] === undefined) {
      offlineMap[this.sequenceGeneratorName] = 0;
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
      eDossierPncObject.availableOffline = true;
      eDossierPncObject.offlineStorageDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');
      this.offlineMap[entity][this.getStorageId(eDossierPncObject)] = eDossierPncObject;
      this.persistOfflineMap();
      resolve(eDossierPncObject);
    });
  }

  deleteAll(entity: Entity): void {
    this.offlineMap[entity] = {};
    this.persistOfflineMap();
  }

  delete(entity: Entity, storageId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const deletedObject = this.offlineMap[entity][storageId];
      delete this.offlineMap[entity][storageId];
      this.persistOfflineMap();
      resolve(deletedObject);
    });
  }

  /**
   * Persiste la map en mémoire dans le stockage Ionic
   */
  persistOfflineMap(): void {
    this.storage.set(this.config.appName, this.offlineMap);
  }

  /**
   * Attribut une clef de stockage à un objet.
   * Pour les objets existants, on prend la clef primaire de l'objet.
   * S'il s'agit d'une nouvelle création, il faut générer un id temporaire.
   */
  getStorageId(eDossierPncObject: EDossierPncObject): string {
    if (eDossierPncObject.getTechId() === undefined || eDossierPncObject.getTechId() === 'undefined') {
      const nextSequenceId = this.nextSequenceId();
      eDossierPncObject.techId = nextSequenceId;
      return `${nextSequenceId}`;
    }
    return eDossierPncObject.getTechId();
  }

  /**
   * Génère une clef de stockage pour les nouvelles créations d'objets
   */
  nextSequenceId(): number {
    return --this.offlineMap[this.sequenceGeneratorName];
  }
}

