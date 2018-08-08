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
import { CareerObjective } from '../../models/careerObjective';
import { Waypoint } from '../../models/waypoint';
import { Rotation } from '../../models/rotation';
import { SecurityProvider } from './../../providers/security/security';
import { LegProvider } from './../../providers/leg/leg';
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
    private legProvider: LegProvider) {
  }



  /**
   * Stocke en cache le EDossier du PNC
   * @param matricule le matricule du PNC dont on souhaite mettre en cache le EDossier
   * @return une promesse résolue quand le EDossier est mis en cache
   */
  storeEDossierOffline(matricule: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.pncSynchroProvider.getPncSynchro(matricule).then(pncSynchro => {
        this.summarySheetProvider.getSummarySheet(matricule).then(summarySheet => {
          pncSynchro.summarySheet = summarySheet;
          this.updateLocalStorageFromPncSynchroResponse(pncSynchro);
          resolve(true);
        });
      }, error => {
        reject(matricule);
      });
    });
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

    if (pncSynchroResponse.legs != null) {
      for (const leg of pncSynchroResponse.legs) {
        const techIdRotation: number = leg.rotation.techId;
        leg.rotation = new Rotation();
        leg.rotation.techId = techIdRotation;

        this.storageService.save(Entity.LEG, this.legTransformerProvider.toLeg(leg), true);

        // Pour chaque troncon, on recupere la liste equipage
        this.legProvider.getFlightCrewFromLeg(leg.techId).then(flightCrewList => {
          for (const flightCrew of flightCrewList) {
            flightCrew.legId = leg.techId;
            this.storageService.save(Entity.CREW_MEMBER, this.crewMemberTransformerProvider.toCrewMember(flightCrew), true);
          }
        });
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

    this.storageService.persistOfflineMap();
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

    //  Suppression de tous les vols et rotations
    this.storageService.deleteAll(Entity.ROTATION);
    this.storageService.deleteAll(Entity.LEG);

    // Suppression de la fiche synthese
    this.storageService.delete(Entity.SUMMARY_SHEET, pnc.matricule);
  }

  /**
   * Lance le processus de synchronisation des données modifiées offline
   */
  synchronizeOfflineData() {
    const pncSynchroList = this.getPncSynchroList();

    if (pncSynchroList.length > 0) {
      this.synchroStatusChange.emit(true);

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
