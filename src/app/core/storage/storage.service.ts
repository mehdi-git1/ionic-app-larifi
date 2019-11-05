import * as _ from 'lodash';
import * as moment from 'moment';

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Config } from '../../../environments/config';
import { AppConstant } from '../../app.constant';
import { EntityEnum } from '../enums/entity.enum';
import { OfflineActionEnum } from '../enums/offline-action.enum';
import { AppDataModel } from '../models/app-data.model';
import { EDossierPncObjectModel } from '../models/e-dossier-pnc-object.model';
import { TransformerService } from '../services/transformer/transformer.service';

@Injectable({ providedIn: 'root' })
export class StorageService {

  private offlineMap;
  private sequenceGeneratorName = 'sequence';
  // Clef de stockage des données applicatives
  private APP_DATA = 'APP_DATA';

  constructor(
    private storage: Storage,
    private config: Config,
    private transformerService: TransformerService) {
  }

  reinitOfflineMap(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.offlineMap = null;
      this.persistOfflineMap().then(() => {
        this.initOfflineMap().then(() => {
          resolve();
        });
      });
    });
  }

  /**
   * Initialise la map de stockage qui sera persistée dans le cache.
   * La map contient une entrée par entité et un numéro de séquence, utilisé pour les créations offline
   * @return une promesse contenant la map créé/mise à jour
   */
  initOfflineMap(): Promise<any> {
    return this.storage.get(this.config.appName).then(offlineMap => {
      this.preInit(offlineMap);
      this.offlineMap = this.updateMap(offlineMap);
      this.persistOfflineMap();
    });
  }

  /**
   * S'assure que la montée de version du cache ne se fait qu'une fois
   * @param offlineMap la map récupérée du cache
   */
  private preInit(offlineMap: any) {
    if (offlineMap && (!offlineMap[this.APP_DATA] || offlineMap[this.APP_DATA].appVersion !== this.config.appVersion)) {
      this.processStorageUpgrade(offlineMap);
    }
  }

  /**
   * Réalise les transformations nécessaires sur le cache, suite à une montée de version.
   * ATTENTION ! Penser à supprimer les upgrades une fois les iPads tous passés en version supérieur
   * @param offlineMap la map récupérée du cache sur laquelle les opérations de montée de version vont être réalisées
   */
  private processStorageUpgrade(offlineMap: any) {
    // Si on n'a pas d'entrée APP_DATA dans le cache, c'est que la version précédente est antérieure à la 1.7.1
    if (!offlineMap[this.APP_DATA]) {
      delete offlineMap[EntityEnum.EOBSERVATION];
    }
  }

  /**
   * Met à jour la map de stockage en vérifiant que toutes les entités ont leur entrée dans la map.
   * @param offlineMap la map de stockage à mettre à jour
   */
  updateMap(offlineMap) {
    if (offlineMap === null) {
      offlineMap = {};
    }
    for (const entity in EntityEnum) {
      if (offlineMap[entity] === undefined) {
        offlineMap[entity] = {};
      }
    }
    if (offlineMap[this.sequenceGeneratorName] === undefined) {
      offlineMap[this.sequenceGeneratorName] = 0;
    }

    // Création d'une entrée pour le stockage des données applicatives
    if (!offlineMap[this.APP_DATA]) {
      offlineMap[this.APP_DATA] = new AppDataModel();
    }
    offlineMap[this.APP_DATA].appVersion = this.config.appVersion;

    return offlineMap;
  }

  /**
   * Retrouve toutes les entités d'un certains type
   * @param entity le type des entités à retrouver
   * @return la liste de toutes les entités trouvées
   */
  findAll(entity: EntityEnum): any[] {
    const array = [];
    for (const entry of Object.keys(this.offlineMap[entity])) {
      array.push(_.cloneDeep(this.offlineMap[entity][entry]));
    }
    return array;
  }

  /**
   * Retrouve toutes les entités d'un certains type, de manière asynchrone
   * @param entity le type des entités à retrouver
   * @return une promesse contenant la liste des entités trouvées
   */
  findAllAsync(entity: EntityEnum): Promise<any[]> {
    return Promise.resolve(this.findAll(entity));
  }

  /**
   * Retrouve une entité à partir de son id de stockage
   * @param entity le type de l'entité à retrouver
   * @param storageId l'id de stockage de l'entité (correspond à la clef primaire)
   * @return l'entité trouvée
   */
  findOne(entity: EntityEnum, storageId: string): any {
    if (this.offlineMap && this.offlineMap[entity] && this.offlineMap[entity][storageId]) {
      return _.cloneDeep(this.offlineMap[entity][storageId]);
    } else {
      return null;
    }
  }

  /**
   * Retrouve une entité à partir de son id de stockage, de manière asynchrone
   * @param entity le type de l'entité à retrouver
   * @param storageId l'id de stockage de l'entité (correspond à la clef primaire)
   * @return une promesse contenant l'entité trouvée
   */
  findOneAsync(entity: EntityEnum, storageId: string): Promise<any> {
    return Promise.resolve(_.cloneDeep(this.findOne(entity, storageId)));
  }

  /**
   * Sauvegarde une entité. Si on est en online, on ne flagge pas la donnée comme "à créer" car il s'agit d'une opération de mise en cache.
   * @param entity le type de l'entité à sauver
   * @param eDossierPncObject l'objet à sauver
   * @param online si on est connecté ou non
   * @return l'objet sauvé
   */
  save(entity: EntityEnum, eDossierPncObject: EDossierPncObjectModel, online: boolean = false): any {
    if (!eDossierPncObject) {
      return null;
    }
    eDossierPncObject = this.transformerService.transformObject(entity, eDossierPncObject);
    eDossierPncObject.offlineStorageDate = moment().format(AppConstant.isoDateFormat);
    if (!online) {
      eDossierPncObject.offlineAction =
        this.isOfflineStorageId(this.getStorageId(eDossierPncObject)) ? OfflineActionEnum.CREATE : OfflineActionEnum.UPDATE;
    }
    if (this.offlineMap) {
      this.offlineMap[entity][this.getStorageId(eDossierPncObject)] = eDossierPncObject;
    }
    return eDossierPncObject;
  }

  /**
   * Sauvegarde une entité, de manière asynchrone
   * @param entity le type de l'entité à sauver
   * @param eDossierPncObject l'objet à sauver
   * @param online si on est connecté ou non
   * @return une promesse contenant l'objet sauvé
   */
  saveAsync(entity: EntityEnum, eDossierPncObject: EDossierPncObjectModel, online: boolean = false): Promise<any> {
    return new Promise((resolve, reject) => {
      eDossierPncObject = this.save(entity, eDossierPncObject, online);
      this.persistOfflineMap();
      resolve(eDossierPncObject);
    });
  }

  /**
   * Supprime toutes les entités d'un certains type
   * @param entity le type de l'entité à supprimer
   */
  deleteAll(entity: EntityEnum): void {
    if (this.offlineMap) {
      this.offlineMap[entity] = {};
      this.persistOfflineMap();
    }
  }

  /**
   * Supprime une entité à partir de son id
   * @param entity le type de l'entité à supprimer
   * @param storageId l'id de stockage de l'entité qu'on souhaite supprimer
   */
  delete(entity: EntityEnum, storageId: string): void {
    delete this.offlineMap[entity][storageId];
  }

  /**
   * Supprime une entité à partir de son id, de manière asynchrone
   * @param entity le type de l'entité à supprimer
   * @param storageId l'id de stockage de l'entité qu'on souhaite supprimer
   */
  deleteAsync(entity: EntityEnum, storageId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const deletedObject = this.offlineMap[entity][storageId];
      if (this.isOfflineStorageId(storageId)) {
        this.delete(entity, storageId);
      } else {
        this.offlineMap[entity][storageId].offlineAction = OfflineActionEnum.DELETE;
      }
      this.persistOfflineMap();
      resolve(deletedObject);
    });
  }

  /**
   * Persiste la map en cache, dans le stockage Ionic
   */
  persistOfflineMap(): Promise<any> {
    return this.storage.set(this.config.appName, this.offlineMap);
  }

  /**
   * Attribut une clef de stockage à un objet.
   * Pour les objets existants, on prend la clef primaire de l'objet.
   * S'il s'agit d'une nouvelle création, il faut générer un id temporaire.
   * @param eDossierPncObject l'objet dont on souhaite récupérer l'id de stockage
   * @return l'id de stockage de l'objet
   */
  getStorageId(eDossierPncObject: EDossierPncObjectModel): string {
    if (eDossierPncObject.getStorageId() === undefined || eDossierPncObject.getStorageId() === 'undefined') {
      const nextSequenceId = this.nextSequenceId();
      eDossierPncObject.techId = nextSequenceId;
      return `${nextSequenceId}`;
    }
    return eDossierPncObject.getStorageId();
  }

  /**
   * Génère un id de stockage pour les nouvelles créations d'objets en hors connexion
   * @return l'id de stockage hors connexion
   */
  nextSequenceId(): number {
    return --this.offlineMap[this.sequenceGeneratorName];
  }

  /**
   * Récupère tous les objets d'un certains type qui ont fait l'objet d'une action offline
   * @param entity le type d'objet qu'on souhaite récupérer
   * @return la liste des objets du type demandé et ayant fait l'objet d'une action offline
   */
  findAllEDossierPncObjectWithOfflineAction(entity: EntityEnum): any[] {
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

