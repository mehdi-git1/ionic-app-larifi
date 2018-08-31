import { CrewMember } from './../../models/crewMember';
import { PncPhotoTransformerProvider } from './../pnc-photo/pnc-photo-transformer';
import { PncPhotoProvider } from './../pnc-photo/pnc-photo';
import { CareerObjective } from './../../models/careerObjective';
import { ToastProvider } from './../toast/toast';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from './../../services/session.service';
import { CrewMemberTransformerProvider } from './../crewMember/crewMember-transformer';
import { LegTransformerProvider } from './../leg/leg-transformer';
import { RotationTransformerProvider } from './../rotation/rotation-transformer';
import { SummarySheet } from './../../models/summarySheet';
import { SummarySheetProvider } from './../summary-sheet/summary-sheet';
import { PncTransformerProvider } from './../pnc/pnc-transformer';
import { WaypointTransformerProvider } from './../waypoint/waypoint-transformer';
import { PncSynchro } from './../../models/pncSynchro';
import { Observable } from 'rxjs/Rx';
import { OfflineAction } from './../../models/offlineAction';
import { PncSynchroProvider } from './pnc-synchro';
import { CareerObjectiveTransformerProvider } from './../career-objective/career-objective-transformer';
import { StorageService } from './../../services/storage.service';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Entity } from '../../models/entity';
import { Pnc } from '../../models/pnc';
import { Waypoint } from '../../models/waypoint';
import { Rotation } from '../../models/rotation';
import { SecurityProvider } from './../../providers/security/security';
import { LegProvider } from './../../providers/leg/leg';
import { CareerObjectiveProvider } from '../career-objective/career-objective';
@Injectable()
export class SynchronizationProvider {

  @Output()
  synchroStatusChange = new EventEmitter<boolean>();

  constructor(private storageService: StorageService,
    private careerObjectiveTransformer: CareerObjectiveTransformerProvider,
    private waypointTransformer: WaypointTransformerProvider,
    private pncTransformer: PncTransformerProvider,
    private pncSynchroProvider: PncSynchroProvider,
    private rotationTransformerProvider: RotationTransformerProvider,
    private legTransformerProvider: LegTransformerProvider,
    private crewMemberTransformerProvider: CrewMemberTransformerProvider,
    public securityProvider: SecurityProvider,
    private summarySheetProvider: SummarySheetProvider,
    private pncPhotoProvider: PncPhotoProvider,
    private pncPhotoTransformer: PncPhotoTransformerProvider,
    private legProvider: LegProvider,
    private sessionService: SessionService,
    private toastProvider: ToastProvider,
    private translateService: TranslateService,
    private careerObjectiveProvider: CareerObjectiveProvider) {
  }



  /**
   * Stocke en cache le EDossier du PNC
   * @param matricule le matricule du PNC dont on souhaite mettre en cache le EDossier
   * @return une promesse résolue quand le EDossier est mis en cache
   */
  storeEDossierOffline(matricule: string): Promise<boolean> {

    return new Promise((resolve, reject) => {
      if (!this.isPncModifiedOffline(matricule)) {
        this.pncSynchroProvider.getPncSynchro(matricule).then(pncSynchro => {
          this.summarySheetProvider.getSummarySheet(matricule).then(summarySheet => {
            pncSynchro.summarySheet = summarySheet;
            this.pncPhotoProvider.getPncPhoto(matricule).then(pncPhoto => {
              pncSynchro.photo = pncPhoto;
              this.updateLocalStorageFromPncSynchroResponse(pncSynchro);
              resolve(true);
            });
          }, error => {
            reject(this.translateService.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE_ERROR', { 'matricule': matricule }));
          });
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

    const allCareerObjectives = this.storageService.findAll(Entity.CAREER_OBJECTIVE);
    const allWaypoints = this.storageService.findAll(Entity.WAYPOINT);

    const pncCareerObjectives = allCareerObjectives.filter(careerObjective => {
      return careerObjective.pnc.matricule === matricule;
    });

    const pncWaypoints = allWaypoints.filter(waypoint => {
      const careerObjective = this.storageService.findOne(Entity.CAREER_OBJECTIVE, waypoint.careerObjective.techId);
      return careerObjective.pnc.matricule === matricule;
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
   */
  updateLocalStorageFromPncSynchroResponse(pncSynchroResponse: PncSynchro) {
    this.deleteAllPncOfflineObject(pncSynchroResponse.pnc);

    this.storageService.save(Entity.PNC, this.pncTransformer.toPnc(pncSynchroResponse.pnc), true);

    if (pncSynchroResponse.rotations != null) {
      for (const rotation of pncSynchroResponse.rotations) {
        this.storageService.save(Entity.ROTATION, this.rotationTransformerProvider.toRotation(rotation), true);
      }
    }

    const crewMembersPromise: Promise<CrewMember[]>[] = new Array();

    if (pncSynchroResponse.legs != null) {
      for (const leg of pncSynchroResponse.legs) {
        const techIdRotation: number = leg.rotation.techId;
        leg.rotation = new Rotation();
        leg.rotation.techId = techIdRotation;

        this.storageService.save(Entity.LEG, this.legTransformerProvider.toLeg(leg), true);

        crewMembersPromise.push(this.legProvider.getFlightCrewFromLeg(leg.techId));
      }
    }

    Promise.all(crewMembersPromise).then(flightCrewMatrix => {
      for (const flightCrewList of flightCrewMatrix) {
        for (const flightCrew of flightCrewList) {
          this.storageService.save(Entity.CREW_MEMBER, this.crewMemberTransformerProvider.toCrewMember(flightCrew), true);
        }
      }

      // Création des nouveaux objets
      for (const careerObjective of pncSynchroResponse.careerObjectives) {
        delete careerObjective.offlineAction;
        this.storageService.save(Entity.CAREER_OBJECTIVE, this.careerObjectiveTransformer.toCareerObjective(careerObjective), true);
      }
      for (const waypoint of pncSynchroResponse.waypoints) {
        // On ajoute la clef de l'objectif à chaque point d'étape
        delete waypoint.offlineAction;
        // On ne garde que le techId pour réduire le volume de données en cache
        const careerObjectiveTechId = waypoint.careerObjective.techId;
        waypoint.careerObjective = new CareerObjective();
        waypoint.careerObjective.techId = careerObjectiveTechId;
        this.storageService.save(Entity.WAYPOINT, this.waypointTransformer.toWaypoint(waypoint), true);
      }

      // Sauvegarde de la fiche synthese
      this.storageService.save(Entity.SUMMARY_SHEET, pncSynchroResponse.summarySheet, true);

      // Sauvegarde de la photo du PNC
      this.storageService.save(Entity.PNC_PHOTO, this.pncPhotoTransformer.toPncPhoto(pncSynchroResponse.photo), true);
      this.storageService.persistOfflineMap();
    }, error => { });
  }

  /**
   * Supprime tous les objets du cache, liés à un PNC
   * @param pnc le PNC dont on souhaite supprimer le cache
   */
  deleteAllPncOfflineObject(pnc: Pnc) {
    // Suppression des objectifs du PNC
    const careerObjectives = this.storageService.findAll(Entity.CAREER_OBJECTIVE);
    const pncCareerObjectives = careerObjectives.filter(careerObjective => {
      return careerObjective.pnc.matricule === pnc.matricule;
    });
    for (const careerObjective of pncCareerObjectives) {
      // Suppression des points d'étape
      const waypoints = this.storageService.findAll(Entity.WAYPOINT);
      const careerObjectiveWaypoints = waypoints.filter(waypoint => {
        return careerObjective.techId === waypoint.careerObjective.techId;
      });
      for (const waypoint of careerObjectiveWaypoints) {
        this.storageService.delete(Entity.WAYPOINT,
          this.waypointTransformer.toWaypoint(waypoint).getStorageId());
      }
      this.storageService.delete(Entity.CAREER_OBJECTIVE,
        this.careerObjectiveTransformer.toCareerObjective(careerObjective).getStorageId());
    }


    //  Suppression de toutes les rotations, vols et listes d'équipage
    if (this.sessionService.authenticatedUser.matricule === pnc.matricule) {
      this.storageService.deleteAll(Entity.ROTATION);
      this.storageService.deleteAll(Entity.LEG);
      this.storageService.deleteAll(Entity.CREW_MEMBER);
    }

    // Suppression de la fiche synthese
    this.storageService.delete(Entity.SUMMARY_SHEET, pnc.matricule);
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
  getPncSynchroList(): PncSynchro[] {
    const unsynchronizedCareerObjectives = this.storageService.findAllEDossierPncObjectWithOfflineAction(Entity.CAREER_OBJECTIVE);
    const unsynchronizedWaypoints = this.storageService.findAllEDossierPncObjectWithOfflineAction(Entity.WAYPOINT);

    const pncMap = this.buildPncSynchroMap(unsynchronizedCareerObjectives, unsynchronizedWaypoints);
    return Array.from(pncMap.values());
  }

  /**
   * Retourne une map contenant les objets PncSynchro à synchroniser.
   * La clef est le matricule du PNC, la valeur est l'objet PncSynchro.
   * @param unsynchronizedCareerObjectives la liste des objectifs à synchroniser
   * @param unsynchronizedWaypoints la liste des points d'étape à synchroniser
   * @return la map contenant les objets PncSynchro, associés au matricule de chaque PNC
   */
  private buildPncSynchroMap(unsynchronizedCareerObjectives: CareerObjective[], unsynchronizedWaypoints: Waypoint[]): any {
    const pncMap = new Map();
    for (const careerObjective of unsynchronizedCareerObjectives) {
      if (!pncMap.get(careerObjective.pnc.matricule)) {
        const pncSynchro = new PncSynchro();
        pncSynchro.pnc = careerObjective.pnc;
        pncSynchro.careerObjectives = [];
        pncSynchro.waypoints = [];
        pncMap.set(careerObjective.pnc.matricule, pncSynchro);
      }
      pncMap.get(careerObjective.pnc.matricule).careerObjectives.push(careerObjective);
    }

    for (const waypoint of unsynchronizedWaypoints) {
      const waypointCareerObjective = this.storageService.findOne(Entity.CAREER_OBJECTIVE, `${waypoint.careerObjective.techId}`);

      if (!pncMap.get(waypointCareerObjective.pnc.matricule)) {
        const pncSynchro = new PncSynchro();
        pncSynchro.pnc = waypointCareerObjective.pnc;
        pncSynchro.careerObjectives = [];
        pncSynchro.waypoints = [];
        pncMap.set(waypointCareerObjective.pnc.matricule, pncSynchro);
      }
      pncMap.get(waypointCareerObjective.pnc.matricule).waypoints.push(waypoint);
    }

    return pncMap;
  }

}
