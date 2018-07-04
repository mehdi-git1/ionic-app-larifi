import { AppConstant } from './../app/app.constant';
import { OfflineAction } from './../models/offlineAction';
import { DatePipe } from '@angular/common';
import { Entity } from './../models/entity';
import { AuthenticatedUser } from './../models/authenticatedUser';
import { Config } from './../configuration/environment-variables/config';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { EDossierPncObject } from '../models/eDossierPncObject';
import * as moment from 'moment';

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

  findAll(entity: Entity): any[] {
    const array = [];
    for (const entry of Object.keys(this.offlineMap[entity])) {
      array.push(this.offlineMap[entity][entry]);
    }
    return array;
  }

  findAllAsync(entity: Entity): Promise<any[]> {
    return new Promise((resolve, reject) => {
      resolve(this.findAll(entity));
    });
  }

  findOne(entity: Entity, storageId: string): any {
    return this.offlineMap[entity][storageId];
  }

  findOneAsync(entity: Entity, storageId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.findOne(entity, storageId));
    });
  }

  save(entity: Entity, eDossierPncObject: EDossierPncObject, online: boolean = false) {
    eDossierPncObject.availableOffline = true;
    eDossierPncObject.offlineStorageDate = moment().format(AppConstant.isoDateFormat);
    if (!online) {
      eDossierPncObject.offlineAction =
        this.isOfflineStorageId(this.getStorageId(eDossierPncObject)) ? OfflineAction.CREATE : OfflineAction.UPDATE;
    }
    this.offlineMap[entity][this.getStorageId(eDossierPncObject)] = eDossierPncObject;
  }


  saveAsync(entity: Entity, eDossierPncObject: EDossierPncObject, online: boolean = false): Promise<any> {
    return new Promise((resolve, reject) => {
      this.save(entity, eDossierPncObject, online);
      this.persistOfflineMap();
      resolve(eDossierPncObject);
    });
  }

  deleteAll(entity: Entity): void {
    this.offlineMap[entity] = {};
    this.persistOfflineMap();
  }

  delete(entity: Entity, storageId: string) {
    delete this.offlineMap[entity][storageId];
  }

  deleteAsync(entity: Entity, storageId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const deletedObject = this.offlineMap[entity][storageId];
      if (this.isOfflineStorageId(storageId)) {
        this.delete(entity, storageId);
      } else {
        this.offlineMap[entity][storageId].offlineAction = OfflineAction.DELETE;
      }
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
    if (eDossierPncObject.getStorageId() === undefined || eDossierPncObject.getStorageId() === 'undefined') {
      const nextSequenceId = this.nextSequenceId();
      eDossierPncObject.techId = nextSequenceId;
      return `${nextSequenceId}`;
    }
    return eDossierPncObject.getStorageId();
  }

  /**
   * Génère une clef de stockage pour les nouvelles créations d'objets
   */
  nextSequenceId(): number {
    return --this.offlineMap[this.sequenceGeneratorName];
  }

  /**
   * Récupère tous les objets d'un certains type qui ont fait l'objet d'une action offline
   * @param entity le type d'objet qu'on souhaite récupérer
   * @return la liste des objets du type demandé et ayant fait l'objet d'une action offline
   */
  findAllEDossierPncObjectWithOfflineAction(entity: Entity): any[] {
    const newEDossierPncObjectList = [];
    for (const key of Object.keys(this.offlineMap[entity])) {
      // Si la clef est négative, c'est que l'objet a été créé en mode déconnecté
      if (this.offlineMap[entity][key].offlineAction) {
        newEDossierPncObjectList.push(this.offlineMap[entity][key]);
      }
    }
    return newEDossierPncObjectList;
  }

  /**
   * Vérifie si un id est un id de stockage local (id négatif)
   * @param storageId l'id à tester
   * @return true si l'id est un id de stockage local, false sinon.
   */
  isOfflineStorageId(storageId: string) {
    return storageId.indexOf('-') === 0;
  }
}

