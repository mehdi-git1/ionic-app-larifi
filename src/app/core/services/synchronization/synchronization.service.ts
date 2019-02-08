import { EObservationTransformerService } from './../eobservation/eobservation-transformer.service';
import { FormsInputParamsModel } from './../../models/forms-input-params.model';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Rx';

import { ProfessionalLevelTransformerService } from '../professional-level/professional-level-transformer.service';
import { FormsEObservationService } from '../forms/forms-e-observation.service';
import { PncPhotoTransformerService } from '../pnc-photo/pnc-photo-transformer.service';
import { CareerObjectiveModel } from '../../models/career-objective.model';
import { SessionService } from '../session/session.service';
import { CrewMemberTransformerService } from '../crewMember/crew-member-transformer.service';
import { LegTransformerService } from '../leg/leg-transformer.service';
import { RotationTransformerService } from '../rotation/rotation-transformer.service';
import { PncTransformerService } from '../pnc/pnc-transformer.service';
import { WaypointTransformerService } from '../waypoint/waypoint-transformer.service';
import { PncSynchroModel } from '../../models/pnc-synchro.model';
import { PncSynchroService } from './pnc-synchro.service';
import { CareerObjectiveTransformerService } from '../career-objective/career-objective-transformer.service';
import { StorageService } from '../../storage/storage.service';
import { EntityEnum } from '../../enums/entity.enum';
import { PncModel } from '../../models/pnc.model';
import { WaypointModel } from '../../models/waypoint.model';
import { RotationModel } from '../../models/rotation.model';
import { SecurityService } from '../security/security.service';
import { LegService } from '../leg/leg.service';
import { CrewMemberEnum } from '../../models/crew-member.enum';
import { LegModel } from '../../models/leg.model';
import { StatutoryCertificateTransformerService } from '../statutory-certificate/statutory-certificate-transformer.service';

@Injectable()
export class SynchronizationService {

  @Output()
  synchroStatusChange = new EventEmitter<boolean>();

  constructor(private storageService: StorageService,
    private eObservationService: FormsEObservationService,
    private careerObjectiveTransformer: CareerObjectiveTransformerService,
    private waypointTransformer: WaypointTransformerService,
    private pncTransformer: PncTransformerService,
    private pncSynchroProvider: PncSynchroService,
    private rotationTransformerProvider: RotationTransformerService,
    private legTransformerProvider: LegTransformerService,
    private crewMemberTransformerService: CrewMemberTransformerService,
    public securityProvider: SecurityService,
    private pncPhotoTransformer: PncPhotoTransformerService,
    private legProvider: LegService,
    private sessionService: SessionService,
    private translateService: TranslateService,
    private professionalLevelTransformer: ProfessionalLevelTransformerService,
    private statutoryCertificateTransformer: StatutoryCertificateTransformerService,
    private eObservationTransformerService: EObservationTransformerService) {
  }



  /**
   * Stocke en cache le EDossier du PNC
   * @param matricule le matricule du PNC dont on souhaite mettre en cache le EDossier
   * @param storeCrewMembers false si l'on ne veut pas charger les crewMembers des vols du PncModel
   * @return une promesse résolue quand le EDossier est mis en cache
   */
  storeEDossierOffline(matricule: string, storeCrewMembers: boolean = true): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // On ne met pas en cache si des données sont en attente de synchro
      if (!this.isPncModifiedOffline(matricule)) {
        this.pncSynchroProvider.getPncSynchro(matricule).then(pncSynchro => {
          this.updateLocalStorageFromPncSynchroResponse(pncSynchro, storeCrewMembers).then(
            success => resolve(),
            error => reject(this.translateService.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE_ERROR', { 'matricule': matricule }))
          );
        }, error => {
          reject(this.translateService.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE_ERROR', { 'matricule': matricule }));
        });
      } else {
        reject(this.translateService.instant('GLOBAL.MESSAGES.ERROR.APPLICATION_SYNCHRO_PENDING', { 'matricule': matricule }));
      }
    });
  }

  /**
   * Determine si il y a eu du mouvement (creation, modification...) pour un pnc donné
   * @param matricule le matricule du PNC
   * @return  Vrai lorsqu'un objectif ou point d'étape a été crée ou modifié pour un pnc, sinon Faux
   */
  isPncModifiedOffline(matricule: string): boolean {

    const allCareerObjectives = this.storageService.findAll(EntityEnum.CAREER_OBJECTIVE);
    const allWaypoints = this.storageService.findAll(EntityEnum.WAYPOINT);

    const pncCareerObjectives = allCareerObjectives.filter(careerObjective => {
      return careerObjective.pnc.matricule === matricule;
    });

    const pncWaypoints = allWaypoints.filter(waypoint => {
      if (waypoint && waypoint.careerObjective && waypoint.careerObjective.techId) {
        const careerObjective = this.storageService.findOne(EntityEnum.CAREER_OBJECTIVE, waypoint.careerObjective.techId);
        return careerObjective.pnc.matricule === matricule;
      }
    });

    for (const careerObjective of pncCareerObjectives) {
      if (careerObjective.offlineAction) {
        return true;
      }
    }

    for (const waypoint of pncWaypoints) {
      if (waypoint.offlineAction) {
        return true;
      }
    }

    return false;
  }

  /**
   * Gère la réponse de synchronisation du serveur. Supprime tous les objets associés au PNC pour les recréer ensuite.
   * @param pncSynchroResponse l'objet reçu du serveur
   * @param storeCrewMembers false si l'on ne veut pas traiter les crewMembers des vols du PncModel
   * @return une promesse qui se résout quand tout a été sauvegardé
   */
  updateLocalStorageFromPncSynchroResponse(pncSynchroResponse: PncSynchroModel, storeCrewMembers: boolean = true): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.deleteAllPncOfflineObject(pncSynchroResponse.pnc);
      this.storageService.save(EntityEnum.PNC, this.pncTransformer.toPnc(pncSynchroResponse.pnc), true);
      this.storeRotations(pncSynchroResponse.rotations);
      const crewMembersPromisesArray = this.storeLegs(pncSynchroResponse.legs);
      const storeCrewMembersPromises = new Array<Promise<boolean[]>>();

      Promise.all(crewMembersPromisesArray).then(flightCrewMatrix => {
        if (storeCrewMembers) {
          storeCrewMembersPromises.push(this.storeCrewMembers(pncSynchroResponse.pnc.matricule, flightCrewMatrix));
        }
        // Création des nouveaux objets
        for (const careerObjective of pncSynchroResponse.careerObjectives) {
          delete careerObjective.offlineAction;
          this.storageService.save(EntityEnum.CAREER_OBJECTIVE, this.careerObjectiveTransformer.toCareerObjective(careerObjective), true);
        }
        for (const waypoint of pncSynchroResponse.waypoints) {
          // On ajoute la clef de l'objectif à chaque point d'étape
          delete waypoint.offlineAction;
          // On ne garde que le techId pour réduire le volume de données en cache
          const careerObjectiveTechId = waypoint.careerObjective.techId;
          waypoint.careerObjective = new CareerObjectiveModel();
          waypoint.careerObjective.techId = careerObjectiveTechId;
          this.storageService.save(EntityEnum.WAYPOINT, this.waypointTransformer.toWaypoint(waypoint), true);
        }
        // Sauvegarde de la fiche synthese
        this.storageService.save(EntityEnum.SUMMARY_SHEET, pncSynchroResponse.summarySheet, true);

        // Sauvegarde de la photo du PNC
        this.storageService.save(EntityEnum.PNC_PHOTO, this.pncPhotoTransformer.toPncPhoto(pncSynchroResponse.photo), true);

        // Sauvegarde de l'attestation réglementaire
        this.storageService.save(EntityEnum.STATUTORY_CERTIFICATE, this.statutoryCertificateTransformer.toStatutoryCertificate(pncSynchroResponse.statutoryCertificate), true);

        // Sauvegarde des EObservations
        for (const eObservation of pncSynchroResponse.eobservations) {
          delete eObservation.offlineAction;
          this.storageService.save(EntityEnum.EOBSERVATION, this.eObservationTransformerService.toEObservation(eObservation), true);
        }

        // Sauvegarde du suivi réglementaire
        this.storageService.save(EntityEnum.PROFESSIONAL_LEVEL, this.professionalLevelTransformer.toProfessionalLevel(pncSynchroResponse.professionalLevel), true);
        this.storageService.persistOfflineMap();

        Promise.all(storeCrewMembersPromises).then(success => resolve(), error => reject());
      }, error => { });
    });
  }

  /**
   * Enregistre les rotations en cache
   * @param rotations tableau de rotations
   */
  private storeRotations(rotations: RotationModel[]) {
    if (rotations != null) {
      for (const rotation of rotations) {
        this.storageService.save(EntityEnum.ROTATION, this.rotationTransformerProvider.toRotation(rotation), true);
      }
    }
  }

  /**
   * Enregistre les vols en cache
   * @param legs tableau de vols
   * @return un tableau de Promise<CrewMemberEnum> dont chaque item est la liste d'équipage d'un des vols en paramètre
   */
  private storeLegs(legs: LegModel[]): Promise<CrewMemberEnum[]>[] {
    const crewMembersPromisesArray: Promise<CrewMemberEnum[]>[] = new Array();
    if (legs != null) {
      for (const leg of legs) {
        const techIdRotation: number = leg.rotation.techId;
        leg.rotation = new RotationModel();
        leg.rotation.techId = techIdRotation;
        this.storageService.save(EntityEnum.LEG, this.legTransformerProvider.toLeg(leg), true);
        crewMembersPromisesArray.push(this.legProvider.getFlightCrewFromLeg(leg.techId));
      }
    }
    return crewMembersPromisesArray;
  }

  /**
   * Enregistre les crewMembers en cache, ainsi que les eObservations.
   * Un traitement est effectué afin de gérer l'unicité (par matricule) des crewMembers. De meme pour les eObservations (unicité par couple matricule/rotationId)
   * Le crewMember correspondant au matricule en paramètre ne sera pas traité
   * @param matricule le matricule du PncModel principal (celui dont on charge le eDossier initialement)
   * @param flightCrewMatrix matrice de crewMembers
   * @return une promesse qui se résout quand tout l'équipage a été mis en cache
   */
  private storeCrewMembers(matricule: string, flightCrewMatrix: CrewMemberEnum[][]): Promise<boolean[]> {
    const crewMembers: Array<CrewMemberEnum> = new Array();
    for (const flightCrewList of flightCrewMatrix) {
      for (const flightCrew of flightCrewList) {
        this.storageService.save(EntityEnum.CREW_MEMBER, this.crewMemberTransformerService.toCrewMember(flightCrew), true);
        if (matricule != flightCrew.pnc.matricule) {
          crewMembers.push(flightCrew);
        }
      }
    }
    const eObservationsPromises: Promise<FormsInputParamsModel>[] = new Array();
    const storeEDossierOfflinePromises = new Array<Promise<boolean>>();
    const crewMembersAlreadyStored: Array<String> = new Array();
    const eObsRotationsAlreadyCreated: Map<String, number[]> = new Map<String, number[]>();
    for (const crewMember of crewMembers) {
      // charge l'edossier PNC de chaque membre d'équipage si il n'a a pas encore été stocké
      if (crewMembersAlreadyStored.indexOf(crewMember.pnc.matricule) < 0) {
        storeEDossierOfflinePromises.push(this.storeEDossierOffline(crewMember.pnc.matricule, false));
        crewMembersAlreadyStored.push(crewMember.pnc.matricule);
      }

      // alimente un tableau de promises du service eObs (1 appel par couple matricule/rotationId)
      if (!eObsRotationsAlreadyCreated.get(crewMember.pnc.matricule)) {
        eObsRotationsAlreadyCreated.set(crewMember.pnc.matricule, new Array());
      }
      if (eObsRotationsAlreadyCreated.get(crewMember.pnc.matricule).indexOf(crewMember.rotationId) < 0) {
        eObservationsPromises.push(this.eObservationService.getFormsInputParams(crewMember.pnc.matricule, crewMember.rotationId));
        eObsRotationsAlreadyCreated.get(crewMember.pnc.matricule).push(crewMember.rotationId);
      }
    }
    Promise.all(eObservationsPromises).then(eObservations => {
      for (const eObservation of eObservations) {
        this.storageService.save(EntityEnum.EOBSERVATION, eObservation, true);
      }
      this.storageService.persistOfflineMap();
    }, error => { });

    return Promise.all(storeEDossierOfflinePromises);
  }

  /**
   * Supprime tous les objets du cache, liés à un PNC
   * @param pnc le PNC dont on souhaite supprimer le cache
   */
  deleteAllPncOfflineObject(pnc: PncModel) {
    // Suppression des objectifs du PNC
    const careerObjectives = this.storageService.findAll(EntityEnum.CAREER_OBJECTIVE);
    const pncCareerObjectives = careerObjectives.filter(careerObjective => {
      return careerObjective.pnc.matricule === pnc.matricule;
    });
    for (const careerObjective of pncCareerObjectives) {
      // Suppression des points d'étape
      const waypoints = this.storageService.findAll(EntityEnum.WAYPOINT);
      const careerObjectiveWaypoints = waypoints.filter(waypoint => {
        return careerObjective.techId === waypoint.careerObjective.techId;
      });
      for (const waypoint of careerObjectiveWaypoints) {
        this.storageService.delete(EntityEnum.WAYPOINT,
          this.waypointTransformer.toWaypoint(waypoint).getStorageId());
      }
      this.storageService.delete(EntityEnum.CAREER_OBJECTIVE,
        this.careerObjectiveTransformer.toCareerObjective(careerObjective).getStorageId());
    }


    //  Suppression de toutes les rotations, vols, listes d'équipage et infos pour les eObservations
    if (this.sessionService.getActiveUser().matricule === pnc.matricule) {
      this.storageService.deleteAll(EntityEnum.ROTATION);
      this.storageService.deleteAll(EntityEnum.LEG);
      this.storageService.deleteAll(EntityEnum.CREW_MEMBER);
      this.storageService.deleteAll(EntityEnum.EOBSERVATION);
    }

    // Suppression de la fiche synthese
    this.storageService.delete(EntityEnum.SUMMARY_SHEET, pnc.matricule);

    // Suppression de l'attestation réglementaire
    this.storageService.delete(EntityEnum.STATUTORY_CERTIFICATE, pnc.matricule);

    // Suppression du niveau pro SV
    this.storageService.delete(EntityEnum.PROFESSIONAL_LEVEL, pnc.matricule);
  }

  /**
   * Lance le processus de synchronisation des données modifiées offline
   */
  synchronizeOfflineData() {
    this.synchroStatusChange.emit(true);
    const pncSynchroList = this.getPncSynchroList();

    if (pncSynchroList.length > 0) {
      let promiseCount;
      let resolvedPromiseCount = 0;
      Observable.create(
        observer => {
          promiseCount = pncSynchroList.length;
          for (const pncSynchro of pncSynchroList) {
            this.pncSynchroProvider.synchronize(pncSynchro).then(pncSynchroResponse => {
              this.updateLocalStorageFromPncSynchroResponse(pncSynchroResponse);
              resolvedPromiseCount++;
              observer.next(true);
            }, error => {
              resolvedPromiseCount++;
              observer.next(true);
            });
          }
        }).subscribe(promiseResolved => {
          if (resolvedPromiseCount >= promiseCount) {
            this.synchroStatusChange.emit(false);
          }
        });
    } else {
      this.synchroStatusChange.emit(false);
    }
  }

  /**
   * Recheche tous les eDossiers nécessitant une synchronisation
   * @return la liste des synchronisations à réaliser
   */
  getPncSynchroList(): PncSynchroModel[] {
    const unsynchronizedCareerObjectives = this.storageService.findAllEDossierPncObjectWithOfflineAction(EntityEnum.CAREER_OBJECTIVE);
    const unsynchronizedWaypoints = this.storageService.findAllEDossierPncObjectWithOfflineAction(EntityEnum.WAYPOINT);

    const pncMap = this.buildPncSynchroMap(unsynchronizedCareerObjectives, unsynchronizedWaypoints);
    return Array.from(pncMap.values());
  }

  /**
   * Retourne une map contenant les objets PncSynchroModel à synchroniser.
   * La clef est le matricule du PNC, la valeur est l'objet PncSynchroModel.
   * @param unsynchronizedCareerObjectives la liste des objectifs à synchroniser
   * @param unsynchronizedWaypoints la liste des points d'étape à synchroniser
   * @return la map contenant les objets PncSynchroModel, associés au matricule de chaque PNC
   */
  private buildPncSynchroMap(unsynchronizedCareerObjectives: CareerObjectiveModel[], unsynchronizedWaypoints: WaypointModel[]): any {
    const pncMap = new Map();
    for (const careerObjective of unsynchronizedCareerObjectives) {
      if (!pncMap.get(careerObjective.pnc.matricule)) {
        const pncSynchro = new PncSynchroModel();
        pncSynchro.pnc = careerObjective.pnc;
        pncSynchro.careerObjectives = [];
        pncSynchro.waypoints = [];
        pncMap.set(careerObjective.pnc.matricule, pncSynchro);
      }
      pncMap.get(careerObjective.pnc.matricule).careerObjectives.push(careerObjective);
    }

    for (const waypoint of unsynchronizedWaypoints) {
      const waypointCareerObjective = this.storageService.findOne(EntityEnum.CAREER_OBJECTIVE, `${waypoint.careerObjective.techId}`);

      if (waypointCareerObjective && waypointCareerObjective.pnc && !pncMap.get(waypointCareerObjective.pnc.matricule)) {
        const pncSynchro = new PncSynchroModel();
        pncSynchro.pnc = waypointCareerObjective.pnc;
        pncSynchro.careerObjectives = [];
        pncSynchro.waypoints = [];
        pncMap.set(waypointCareerObjective.pnc.matricule, pncSynchro);
      }
      if (waypointCareerObjective && waypointCareerObjective.pnc) {
        pncMap.get(waypointCareerObjective.pnc.matricule).waypoints.push(waypoint);
      }
    }

    return pncMap;
  }

}
