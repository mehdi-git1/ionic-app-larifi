import { OfflinePncProvider } from './../../providers/pnc/offline-pnc';
import { Speciality } from './../../models/speciality';
import { TranslateService } from '@ngx-translate/core';
import { ToastProvider } from './../../providers/toast/toast';
import { ConnectivityService } from './../../services/connectivity.service';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { PncProvider } from './../../providers/pnc/pnc';
import { SessionService } from './../../services/session.service';
import { Leg } from './../../models/leg';
import { PncHomePage } from './../pnc-home/pnc-home';
import { LegProvider } from './../../providers/leg/leg';
import { GenderProvider } from './../../providers/gender/gender';
import { SynchronizationProvider } from './../../providers/synchronization/synchronization';

import { CrewMember } from '../../models/crewMember';

@Component({
    selector: 'page-flight-crew-list',
    templateUrl: 'flight-crew-list.html',
})
export class FlightCrewListPage {

    flightCrewList: CrewMember[];
    leg: Leg;
    connectedCrewMember: CrewMember;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public genderProvider: GenderProvider,
        private legProvider: LegProvider,
        public connectivityService: ConnectivityService,
        private toastProvider: ToastProvider,
        private translate: TranslateService,
        private pncProvider: PncProvider,
        private sessionService: SessionService,
        private offlinePncProvider: OfflinePncProvider) {
    }

    ionViewDidEnter() {
        this.initPage();
    }

    /**
     * Initialisation du contenu de la page.
     */
    initPage() {
        const legId = this.navParams.get('legId');
        this.legProvider.getLeg(legId).then(legInfos => {
            this.leg = legInfos;
            this.legProvider.getFlightCrewFromLeg(legId).then(flightCrew => {
                flightCrew.forEach(crew => {
                    if (crew.pnc.matricule !== undefined) {
                        if (crew.pnc.matricule === this.sessionService.authenticatedUser.matricule) {
                            this.sessionService.appContext.onBoardRedactorFunction = crew.onBoardFonction;
                            this.connectedCrewMember = crew;
                        }
                    }
                });
                // On supprime le PNC connecté de la liste
                if (this.connectedCrewMember) {
                    flightCrew = flightCrew.filter(item => item !== this.connectedCrewMember);
                }
                this.flightCrewList = this.sortFlightCrewList(flightCrew);
            }, error => { this.flightCrewList = []; });
        }, error => { });
    }

    /**
     * Tri d'une liste de CrewMember
     * @param flightCrewList liste à trier
     * @return liste triée
     */
    sortFlightCrewList(flightCrewList: CrewMember[]): CrewMember[] {
        return flightCrewList.sort((crewMember, otherCrewMember) => {
            return this.sortCrew(crewMember, otherCrewMember);
        });
    }

    /**
     * Tri 2 crewMember par priorité, puis grade, puis nom
     * @param crewMember crewMember de base
     * @param otherCrewMember crewMember à comparer
     */
    sortCrew(crewMember: CrewMember, otherCrewMember: CrewMember): number {
        if (crewMember.pnc.prioritized && otherCrewMember.pnc.prioritized) {
            return this.sortBySpeciality(crewMember, otherCrewMember);
        } else if (crewMember.pnc.prioritized && !otherCrewMember.pnc.prioritized) {
            return -1;
        } else if (!crewMember.pnc.prioritized && otherCrewMember.pnc.prioritized) {
            return 1;
        } else if (crewMember.particularity === 'P' && otherCrewMember.particularity === 'P') {
            return this.sortBySpeciality(crewMember, otherCrewMember);
        } else if (crewMember.particularity === 'P' && !(otherCrewMember.particularity === 'P')) {
            return -1;
        } else if (!(crewMember.particularity === 'P') && otherCrewMember.particularity === 'P') {
            return 1;
        } else {
            return this.sortBySpeciality(crewMember, otherCrewMember);
        }
    }

    /**
     *  Tri par grade. Ordre : CAD > CCP > CC > HOT = STW
     * @param crewMember crewMember de base
     * @param otherCrewMember crewMember à comparer
     */
    sortBySpeciality(crewMember: CrewMember, otherCrewMember: CrewMember): number {
        if ((crewMember.pnc.speciality === otherCrewMember.pnc.speciality) || (crewMember.pnc.speciality === Speciality.HOT && otherCrewMember.pnc.speciality === Speciality.STW) || (crewMember.pnc.speciality === Speciality.STW && otherCrewMember.pnc.speciality === Speciality.HOT)) {
            return this.sortByName(crewMember, otherCrewMember);
        } else if (crewMember.pnc.speciality === Speciality.CAD) {
            return -1;
        } else if (crewMember.pnc.speciality === Speciality.CCP && (otherCrewMember.pnc.speciality === Speciality.CC || otherCrewMember.pnc.speciality === Speciality.HOT || otherCrewMember.pnc.speciality === Speciality.STW)) {
            return -1;
        } else if (crewMember.pnc.speciality === Speciality.CC && (otherCrewMember.pnc.speciality === Speciality.HOT || otherCrewMember.pnc.speciality === Speciality.STW)) {
            return -1;
        } else {
            return 1;
        }
    }
    /**
     * Tri par ordre alphabetique du nom
     * @param crewMember crewMember de base
     * @param otherCrewMember crewMember à comparer
     */
    sortByName(crewMember: CrewMember, otherCrewMember: CrewMember): number {
        return crewMember.pnc.lastName < otherCrewMember.pnc.lastName ? -1 : 1;
    }

    /**
     * redirige vers la page d'accueil du pnc ou du cadre
     * @param matricule matricule du pnc concerné
     * @param onBoardFonction la fontion a bord du pnc concerné
     */
    openPncHomePage(matricule) {
        this.offlinePncProvider.getPnc(matricule).then(crewMember => {
            if (crewMember) {
                this.sessionService.appContext.observedPncMatricule = matricule;
                this.navCtrl.push(PncHomePage, { matricule: matricule });
            }
        });
    }

    /**
    * Vérifie que le chargement est terminé
    * @return true si c'est le cas, false sinon
    */
    loadingIsOver(): boolean {
        return this.leg !== undefined && this.flightCrewList !== undefined;
    }

}
