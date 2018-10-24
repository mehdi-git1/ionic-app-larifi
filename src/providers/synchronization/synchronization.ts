import { StatutoryReportingTransformerProvider } from './../statutory-reporting/statutory-reporting-transformer';
import { StatutoryCertificateTransformerProvider } from './../statutory-certificate/statutory-certificate-transformer';
import { StatutoryCertificate } from './../../models/statutoryCertificate';
import { EObservation } from './../../models/eObservation';
import { EObservationService } from './../../services/eObservation.service';
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
import { CrewMember } from '../../models/crewMember';
import { Leg } from '../../models/leg';
@Injectable()
export class SynchronizationProvider {

  @Output()
  synchroStatusChange = new EventEmitter<boolean>();

  constructor(private storageService: StorageService,
    private eObservationService: EObservationService,
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
    private careerObjectiveProvider: CareerObjectiveProvider,
    private statutoryCertificateTransformer: StatutoryCertificateTransformerProvider,
    private statutoryReportingTransformer: StatutoryReportingTransformerProvider) {
  }



  /**
   * Stocke en cache le EDossier du PNC
   * @param matricule le matricule du PNC dont on souhaite mettre en cache le EDossier
   * @param storeCrewMembers false si l'on ne veut pas charger les crewMembers des vols du Pnc
   * @return une promesse résolue quand le EDossier est mis en cache
   */
  storeEDossierOffline(matricule: string, storeCrewMembers: boolean = true): Promise<boolean> {

    return new Promise((resolve, reject) => {
      if (!this.isPncModifiedOffline(matricule)) {
        this.pncSynchroProvider.getPncSynchro(matricule).then(pncSynchro => {
          this.summarySheetProvider.getSummarySheet(matricule).then(summarySheet => {
            pncSynchro.summarySheet = summarySheet;
            this.pncPhotoProvider.getPncPhoto(matricule).then(pncPhoto => {
              pncSynchro.photo = pncPhoto;
              this.updateLocalStorageFromPncSynchroResponse(pncSynchro);
              resolve(true);
            }).catch(error => {
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
      if (waypoint && waypoint.careerObjective && waypoint.careerObjective.techId) {
        const careerObjective = this.storageService.findOne(Entity.CAREER_OBJECTIVE, waypoint.careerObjective.techId);
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
   * @param storeCrewMembers false si l'on ne veut pas traiter les crewMembers des vols du Pnc
   */
  updateLocalStorageFromPncSynchroResponse(pncSynchroResponse: PncSynchro, storeCrewMembers: boolean = true) {
    this.deleteAllPncOfflineObject(pncSynchroResponse.pnc);
    this.storageService.save(Entity.PNC, this.pncTransformer.toPnc(pncSynchroResponse.pnc), true);
    this.storeRotations(pncSynchroResponse.rotations);
    const crewMembersPromisesArray = this.storeLegs(pncSynchroResponse.legs);

    Promise.all(crewMembersPromisesArray).then(flightCrewMatrix => {
      if (storeCrewMembers) {
        this.storeCrewMembers(pncSynchroResponse.pnc.matricule, flightCrewMatrix);
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

      // Sauvegarde de l'attestation réglementaire
      this.storageService.save(Entity.STATUTORY_CERTIFICATE, this.statutoryCertificateTransformer.toStatutoryCertificate(pncSynchroResponse.statutoryCertificate), true);

      // Sauvegarde du suivi réglementaire
      this.storageService.save(Entity.STATUTORY_REPORTING, this.statutoryReportingTransformer.toStatutoryReporting(pncSynchroResponse.statutoryReporting), true);

    }, error => { });
  }

  /**
   * Enregistre les rotations en cache
   * @param rotations tableau de rotations
   */
  private storeRotations(rotations: Rotation[]) {
    if (rotations != null) {
      for (const rotation of rotations) {
        this.storageService.save(Entity.ROTATION, this.rotationTransformerProvider.toRotation(rotation), true);
      }
    }
  }

  /**
   * Enregistre les vols en cache
   * @param legs tableau de vols
   * @return une tableau de Promise<CrewMember> dont chaque item est la liste d'équipage d'un des vols en paramètre
   */
  private storeLegs(legs: Leg[]): Promise<CrewMember[]>[] {
    const crewMembersPromisesArray: Promise<CrewMember[]>[] = new Array();
    if (legs != null) {
      for (const leg of legs) {
        const techIdRotation: number = leg.rotation.techId;
        leg.rotation = new Rotation();
        leg.rotation.techId = techIdRotation;
        this.storageService.save(Entity.LEG, this.legTransformerProvider.toLeg(leg), true);
        crewMembersPromisesArray.push(this.legProvider.getFlightCrewFromLeg(leg.techId));
      }
    }
    return crewMembersPromisesArray;
  }

  /**
   * Enregistre les crewMembers en cache, ainsi que les eObservations.
   * Un traitement est effectué afin de gérer l'unicité (par matricule) des crewMembers. De meme pour les eObservations (unicité par couple matricule/rotationId)
   * Le crewMember correspondant au matricule en paramètre ne sera pas traité
   * @param matricule le matricule du Pnc principal (celui dont on charge le eDossier initialement)
   * @param flightCrewMatrix matrice de crewMembers
   */
  private storeCrewMembers(matricule: string, flightCrewMatrix: CrewMember[][]) {
    const crewMembers: Array<CrewMember> = new Array();
    for (const flightCrewList of flightCrewMatrix) {
      for (const flightCrew of flightCrewList) {
        this.storageService.save(Entity.CREW_MEMBER, this.crewMemberTransformerProvider.toCrewMember(flightCrew), true);
        if (matricule != flightCrew.pnc.matricule) {
          crewMembers.push(flightCrew);
        }
      }
    }
    const eObservationsPromises: Promise<EObservation>[] = new Array();
    const crewMembersAlreadyStored: Array<String> = new Array();
    const eObsRotationsAlreadyCreated: Map<String, number[]> = new Map<String, number[]>();
    for (const crewMember of crewMembers) {
      // charge l'edossier PNC de chaque membre d'équipage si il n'a a pas encore été storé
      if (crewMembersAlreadyStored.indexOf(crewMember.pnc.matricule) < 0) {
        this.storeEDossierOffline(crewMember.pnc.matricule, false);
        crewMembersAlreadyStored.push(crewMember.pnc.matricule);
      }

      // alimente un tableau de promises du service eObs (1 appel par couple matricule/rotationId)
      if (!eObsRotationsAlreadyCreated.get(crewMember.pnc.matricule)) {
        eObsRotationsAlreadyCreated.set(crewMember.pnc.matricule, new Array());
      }
      if (eObsRotationsAlreadyCreated.get(crewMember.pnc.matricule).indexOf(crewMember.rotationId) < 0) {
        eObservationsPromises.push(this.eObservationService.getEObservation(crewMember.pnc.matricule, crewMember.rotationId));
        eObsRotationsAlreadyCreated.get(crewMember.pnc.matricule).push(crewMember.rotationId);
      }
    }
    Promise.all(eObservationsPromises).then(eObservations => {
      for (const eObservation of eObservations) {
        this.storageService.save(Entity.EOBSERVATION, eObservation, true);
      }
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


    //  Suppression de toutes les rotations, vols, listes d'équipage et infos pour les eObservations
    if (this.sessionService.authenticatedUser.matricule === pnc.matricule) {
      this.storageService.deleteAll(Entity.ROTATION);
      this.storageService.deleteAll(Entity.LEG);
      this.storageService.deleteAll(Entity.CREW_MEMBER);
      this.storageService.deleteAll(Entity.EOBSERVATION);
    }

    // Suppression de la fiche synthese
    this.storageService.delete(Entity.SUMMARY_SHEET, pnc.matricule);

    // Suppression de l'attestation réglementaire
    this.storageService.delete(Entity.STATUTORY_CERTIFICATE, pnc.matricule);

    // Suppression du suivi réglementaire
    this.storageService.delete(Entity.STATUTORY_REPORTING, pnc.matricule);
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

      if (waypointCareerObjective && waypointCareerObjective.pnc && !pncMap.get(waypointCareerObjective.pnc.matricule)) {
        const pncSynchro = new PncSynchro();
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
