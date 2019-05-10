import { ProfessionalInterviewTransformerService } from './../professional-interview/professional-interview-transformer.service';
import { CongratulationLetterModel } from './../../models/congratulation-letter.model';
import { CongratulationLetterTransformerService } from './../congratulation-letter/congratulation-letter-transformer.service';
import { EObservationTransformerService } from './../eobservation/eobservation-transformer.service';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Rx';

import { ProfessionalLevelTransformerService } from '../professional-level/professional-level-transformer.service';
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
import { CrewMemberModel } from '../../models/crew-member.model';
import { LegModel } from '../../models/leg.model';
import { StatutoryCertificateTransformerService } from '../statutory-certificate/statutory-certificate-transformer.service';
import { Events } from 'ionic-angular';
import { EObservationModel } from '../../models/eobservation/eobservation.model';
import { TransformerService } from '../transformer/transformer.service';
import { ProfessionalInterviewModel } from '../../models/professional-interview/professional-interview.model';

@Injectable()
export class SynchronizationService {

  @Output()
  synchroStatusChange = new EventEmitter<boolean>();

  constructor(private storageService: StorageService,
    private waypointTransformer: WaypointTransformerService,
    private pncSynchroProvider: PncSynchroService,
    public securityProvider: SecurityService,
    private translateService: TranslateService,
    private sessionService: SessionService,
    private careerObjectiveTransformer: CareerObjectiveTransformerService,
    private pncTransformer: PncTransformerService,
    private pncPhotoTransformer: PncPhotoTransformerService,
    private congratulationLetterTransformer: CongratulationLetterTransformerService,
    private professionalLevelTransformer: ProfessionalLevelTransformerService,
    private transformerService: TransformerService,
    private statutoryCertificateTransformer: StatutoryCertificateTransformerService,
    private crewMemberTransformerService: CrewMemberTransformerService,
    private rotationTransformerProvider: RotationTransformerService,
    private legTransformerProvider: LegTransformerService,
    private eObservationTransformerService: EObservationTransformerService,
    private professionalInterviewTransformerService: ProfessionalInterviewTransformerService,
    private events: Events) {
  }

  /**
   * Stocke en cache le EDossier du PNC
   * @param matricule le matricule du PNC dont on souhaite mettre en cache le EDossier
   * @return une promesse résolue quand le EDossier est mis en cache
   */
  storeEDossierOffline(matricule: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // On ne met pas en cache si des données sont en attente de synchro
      if (!this.isPncModifiedOffline(matricule)) {
        this.pncSynchroProvider.getPncSynchro(matricule).then(pncSynchro => {
          this.updateLocalStorageFromPncSynchroResponse(pncSynchro);
          resolve(true);
        }, error => {
          reject(error.detailMessage);
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
    const allEObservations = this.storageService.findAll(EntityEnum.EOBSERVATION);

    const pncCareerObjectives = allCareerObjectives.filter(careerObjective => {
      return careerObjective.pnc.matricule === matricule;
    });

    const pncWaypoints = allWaypoints.filter(waypoint => {
      if (waypoint && waypoint.careerObjective && waypoint.careerObjective.techId) {
        const careerObjective = this.storageService.findOne(EntityEnum.CAREER_OBJECTIVE, waypoint.careerObjective.techId);
        return careerObjective.pnc.matricule === matricule;
      }
    });

    const pncEObservations = allEObservations.filter(eObservation => {
      return eObservation.pnc.matricule === matricule;
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

    for (const eObservation of pncEObservations) {
      if (eObservation.offlineAction) {
        return true;
      }
    }

    return false;
  }

  /**
   * Gère la réponse de synchronisation du serveur. Supprime tous les objets associés au PNC pour les recréer ensuite.
   * @param pncSynchroResponse l'objet reçu du serveur
   */
  updateLocalStorageFromPncSynchroResponse(pncSynchroResponse: PncSynchroModel, storeCrewMembers = true): void {
    this.deleteAllPncOfflineObject(pncSynchroResponse.pnc);
    this.storageService.save(EntityEnum.PNC, this.pncTransformer.toPnc(pncSynchroResponse.pnc), true);
    this.storeRotations(pncSynchroResponse.rotations);
    this.storeCrewMembers(pncSynchroResponse.crewMembers, storeCrewMembers);
    this.storeCareerObjectives(pncSynchroResponse.careerObjectives);
    this.storeWaypoints(pncSynchroResponse.waypoints);
    this.storeEObservations(pncSynchroResponse.eobservations);
    this.storeCongratulationLetters(pncSynchroResponse.congratulationLetters);

    // Sauvegarde de la photo du PNC
    this.storageService.save(EntityEnum.PNC_PHOTO, this.pncPhotoTransformer.toPncPhoto(pncSynchroResponse.photo), true);

    // Sauvegarde de l'attestation réglementaire
    this.storageService.save(EntityEnum.STATUTORY_CERTIFICATE, this.statutoryCertificateTransformer.toStatutoryCertificate(pncSynchroResponse.statutoryCertificate), true);

    // Sauvegarde du suivi réglementaire
    this.storageService.save(EntityEnum.PROFESSIONAL_LEVEL, this.professionalLevelTransformer.toProfessionalLevel(pncSynchroResponse.professionalLevel), true);

    // Sauvegarde des bilans professionnels
    this.storeProfessionalInterviews(pncSynchroResponse.professionalInterviews);

    this.storageService.persistOfflineMap();
  }

  /**
   * Enregistre les rotations en cache
   * @param rotations les rotations à stocker en cache
   */
  private storeRotations(rotations: RotationModel[]) {
    if (rotations != null) {
      for (const rotation of rotations) {
        this.storageService.save(EntityEnum.ROTATION, this.rotationTransformerProvider.toRotation(rotation), true);
        this.storeLegs(rotation.legs, rotation);
      }
    }
  }

  /**
   * Enregistre les vols en cache
   * @param legs les vols à stocker en cache
   */
  private storeLegs(legs: LegModel[], rotation: RotationModel) {
    if (legs != null) {
      for (const leg of legs) {
        leg.rotationStorageId = rotation.number + rotation.departureDate;
        this.storageService.save(EntityEnum.LEG, this.legTransformerProvider.toLeg(leg), true);
      }
    }
  }

  /**
   * Enregistre une liste de membre d'équipage en cache
   * @param crewMembers les membres d'équipage à stocker en cache
   * @param storeCrewMembers si on doit déclencher la mise en cache des dossiers des membres d'équipage
   */
  private storeCrewMembers(crewMembers: CrewMemberModel[], storeCrewMembers: boolean): void {
    if (crewMembers) {
      for (const crewMember of crewMembers) {
        this.storageService.save(EntityEnum.CREW_MEMBER, this.crewMemberTransformerService.toCrewMember(crewMember), true);
        // Ajoute en file d'attente la mise en cache du dossier du membre d'équipage sauf s'il s'agit du user connecté
        if (storeCrewMembers && this.sessionService.getActiveUser().matricule !== crewMember.pnc.matricule) {
          this.events.publish('SynchroRequest:add', crewMember.pnc);
        }
      }
    }
  }

  /**
   * Enregistre une liste d'objectifs en cache
   * @param careerObjectives les objectifs à stocker en cache
   */
  private storeCareerObjectives(careerObjectives: CareerObjectiveModel[]): void {
    for (const careerObjective of careerObjectives) {
      delete careerObjective.offlineAction;
      this.storageService.save(EntityEnum.CAREER_OBJECTIVE, this.careerObjectiveTransformer.toCareerObjective(careerObjective), true);
    }
  }

  /**
   * Enregistre une liste de points d'étape en cache
   * @param waypoints les points d'étape à stocker en cache
   */
  private storeWaypoints(waypoints: WaypointModel[]): void {
    for (const waypoint of waypoints) {
      // On ajoute la clef de l'objectif à chaque point d'étape
      delete waypoint.offlineAction;
      // On ne garde que le techId pour réduire le volume de données en cache
      const careerObjectiveTechId = waypoint.careerObjective.techId;
      waypoint.careerObjective = new CareerObjectiveModel();
      waypoint.careerObjective.techId = careerObjectiveTechId;
      this.storageService.save(EntityEnum.WAYPOINT, this.waypointTransformer.toWaypoint(waypoint), true);
    }
  }

  /**
   * Enregistre une liste d'eObservations en cache
   * @param eObservations les eObservations à stocker en cache
   */
  private storeEObservations(eObservations: EObservationModel[]): void {
    if (eObservations) {
      for (const eObservation of eObservations) {
        delete eObservation.offlineAction;
        this.storageService.save(EntityEnum.EOBSERVATION, this.eObservationTransformerService.toEObservation(eObservation), true);
      }
    }
  }

  /**
 * Enregistre une liste de bilans professionnels en cache
 * @param professionalInterviews les bilans professionnels à stocker en cache
 */
  private storeProfessionalInterviews(professionalInterviews: ProfessionalInterviewModel[]): void {
    if (professionalInterviews) {
      for (const professionalInterview of professionalInterviews) {
        delete professionalInterview.offlineAction;
        this.storageService.save(EntityEnum.PROFESSIONAL_INTERVIEW, this.transformerService.universalTransformObject(ProfessionalInterviewModel, professionalInterview), true);
      }
    }
  }

  /**
   * Enregistre une liste lettres de félicitation en cache
   * @param congratulationLetters les lettres de félicitation à stocker en cache
   */
  private storeCongratulationLetters(congratulationLetters: CongratulationLetterModel[]): void {
    if (congratulationLetters) {
      for (const congratulationLetter of congratulationLetters) {
        this.storageService.save(EntityEnum.CONGRATULATION_LETTER, this.congratulationLetterTransformer.toCongratulationLetter(congratulationLetter), true);
      }
    }
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

    // supression des eObservations
    const eObservations = this.storageService.findAll(EntityEnum.EOBSERVATION);
    const pncEObservations = eObservations.filter(eObservation => {
      return eObservation.pnc.matricule === pnc.matricule;
    });
    for (const eObservation of pncEObservations) {
      this.storageService.delete(EntityEnum.EOBSERVATION,
        this.eObservationTransformerService.toEObservation(eObservation).getStorageId());
    }

    //  Suppression de toutes les rotations, vols, listes d'équipage et infos pour les paramètres d'entrée pour lappel eforms
    if (this.sessionService.getActiveUser().matricule === pnc.matricule) {
      this.storageService.deleteAll(EntityEnum.ROTATION);
      this.storageService.deleteAll(EntityEnum.LEG);
      this.storageService.deleteAll(EntityEnum.CREW_MEMBER);
    }

    // Suppression de l'attestation réglementaire
    this.storageService.delete(EntityEnum.STATUTORY_CERTIFICATE, pnc.matricule);

    // Suppression du niveau pro SV
    this.storageService.delete(EntityEnum.PROFESSIONAL_LEVEL, pnc.matricule);

    // Suppression des bilans professionnels
    const professionalInterviews = this.storageService.findAll(EntityEnum.PROFESSIONAL_INTERVIEW);
    const pncProfessionalInterviews = professionalInterviews.filter(professionalInterview => {
      return professionalInterview.matricule === pnc.matricule;
    });
    for (const professionalInterview of pncProfessionalInterviews) {
      this.storageService.delete(EntityEnum.PROFESSIONAL_INTERVIEW,
        this.professionalInterviewTransformerService.toProfessionalInterview(professionalInterview).getStorageId());
    }
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
              this.updateLocalStorageFromPncSynchroResponse(pncSynchroResponse, false);
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
   * Recherche tous les eDossiers nécessitant une synchronisation
   * @return la liste des synchronisations à réaliser
   */
  getPncSynchroList(): PncSynchroModel[] {
    const unsynchronizedCareerObjectives = this.storageService.findAllEDossierPncObjectWithOfflineAction(EntityEnum.CAREER_OBJECTIVE);
    const unsynchronizedWaypoints = this.storageService.findAllEDossierPncObjectWithOfflineAction(EntityEnum.WAYPOINT);
    const unsynchronizedEObservations = this.storageService.findAllEDossierPncObjectWithOfflineAction(EntityEnum.EOBSERVATION);
    const unsynchronizedProfessionalInterviews = this.storageService.findAllEDossierPncObjectWithOfflineAction(EntityEnum.PROFESSIONAL_INTERVIEW);

    const pncMap = this.buildPncSynchroMap(unsynchronizedCareerObjectives, unsynchronizedWaypoints, unsynchronizedEObservations, unsynchronizedProfessionalInterviews);
    return Array.from(pncMap.values());
  }

  /**
   * Retourne une map contenant les objets PncSynchroModel à synchroniser.
   * La clef est le matricule du PNC, la valeur est l'objet PncSynchroModel.
   * @param unsynchronizedCareerObjectives la liste des objectifs à synchroniser
   * @param unsynchronizedWaypoints la liste des points d'étape à synchroniser
   * @param unsynchronizedEObservations la liste des eObservations à synchroniser
   * @return la map contenant les objets PncSynchroModel, associés au matricule de chaque PNC
   */
  private buildPncSynchroMap(unsynchronizedCareerObjectives: CareerObjectiveModel[], unsynchronizedWaypoints: WaypointModel[], unsynchronizedEObservations: EObservationModel[], unsynchronizedProfessionalInterviews: ProfessionalInterviewModel[]): any {
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

    for (const eObservation of unsynchronizedEObservations) {
      if (!pncMap.get(eObservation.pnc.matricule)) {
        const pncSynchro = new PncSynchroModel();
        pncSynchro.pnc = eObservation.pnc;
        pncSynchro.eobservations = [];
        pncMap.set(eObservation.pnc.matricule, pncSynchro);
      }
      pncMap.get(eObservation.pnc.matricule).eobservations.push(eObservation);
    }

    if (unsynchronizedProfessionalInterviews) {
      for (const professionalInterview of unsynchronizedProfessionalInterviews) {
        if (!pncMap.get(professionalInterview.matricule)) {
          const pncSynchro = new PncSynchroModel();
          pncSynchro.pnc = new PncModel();
          pncSynchro.pnc.matricule = professionalInterview.matricule;
          pncSynchro.pnc.firstName = professionalInterview.pncAtInterviewDate.firstName;
          pncSynchro.pnc.lastName = professionalInterview.pncAtInterviewDate.lastName;
          pncSynchro.pnc.speciality = professionalInterview.pncAtInterviewDate.speciality;
          pncSynchro.professionalInterviews = [];
          pncMap.set(professionalInterview.matricule, pncSynchro);
        }
        pncMap.get(professionalInterview.matricule).professionalInterviews.push(professionalInterview);
      }
    }

    return pncMap;
  }

}
