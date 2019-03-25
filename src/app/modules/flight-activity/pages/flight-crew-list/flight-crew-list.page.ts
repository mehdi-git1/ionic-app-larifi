import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { LegModel } from '../../../../core/models/leg.model';
import { PncHomePage } from '../../../home/pages/pnc-home/pnc-home.page';
import { LegService } from '../../../../core/services/leg/leg.service';
import { GenderService } from '../../../../core/services/gender/gender.service';
import { CrewMemberModel } from '../../../../core/models/crew-member.model';
import { SpecialityEnum } from '../../../../core/enums/speciality.enum';
import { PncService } from '../../../../core/services/pnc/pnc.service';

@Component({
    selector: 'page-flight-crew-list',
    templateUrl: 'flight-crew-list.page.html',
})
export class FlightCrewListPage {

    flightCrewList: CrewMemberModel[];
    leg: LegModel;
    connectedCrewMember: CrewMemberModel;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public genderProvider: GenderService,
        private legProvider: LegService,
        public connectivityService: ConnectivityService,
        private sessionService: SessionService,
        private pncService: PncService) {
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
                    if (crew.pnc.matricule !== undefined && crew.pnc.matricule === this.sessionService.getActiveUser().matricule) {
                        this.sessionService.appContext.onBoardRedactorFunction = crew.onBoardFonction;
                        this.connectedCrewMember = crew;
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
     * Tri d'une liste équipage
     * @param flightCrewList liste à trier
     * @return liste triée
     */
    sortFlightCrewList(flightCrewList: CrewMemberModel[]): CrewMemberModel[] {
        return flightCrewList.sort((crewMember, otherCrewMember) => {
            return this.sortCrew(crewMember, otherCrewMember);
        });
    }

    /**
     * Tri 2 crewMember par priorité, puis grade, puis nom
     * @param crewMember crewMember de base
     * @param otherCrewMember crewMember à comparer
     */
    sortCrew(crewMember: CrewMemberModel, otherCrewMember: CrewMemberModel): number {
        if (crewMember.pnc.prioritized && otherCrewMember.pnc.prioritized) {
            return this.sortBySpeciality(crewMember, otherCrewMember);
        } else if (crewMember.pnc.prioritized && !otherCrewMember.pnc.prioritized) {
            return -1;
        } else if (!crewMember.pnc.prioritized && otherCrewMember.pnc.prioritized) {
            return 1;
        } else if (crewMember.particularity === 'P' && otherCrewMember.particularity === 'P') {
            return this.sortBySpeciality(crewMember, otherCrewMember);
        } else if (crewMember.particularity === 'P' && otherCrewMember.particularity !== 'P') {
            return -1;
        } else if (crewMember.particularity !== 'P' && otherCrewMember.particularity === 'P') {
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
    sortBySpeciality(crewMember: CrewMemberModel, otherCrewMember: CrewMemberModel): number {
        if ((crewMember.pnc.speciality === otherCrewMember.pnc.speciality) || (crewMember.pnc.speciality === SpecialityEnum.HOT && otherCrewMember.pnc.speciality === SpecialityEnum.STW) || (crewMember.pnc.speciality === SpecialityEnum.STW && otherCrewMember.pnc.speciality === SpecialityEnum.HOT)) {
            return this.sortByName(crewMember, otherCrewMember);
        } else if (crewMember.pnc.speciality === SpecialityEnum.CAD) {
            return -1;
        } else if (crewMember.pnc.speciality === SpecialityEnum.CCP && (otherCrewMember.pnc.speciality === SpecialityEnum.CC || otherCrewMember.pnc.speciality === SpecialityEnum.HOT || otherCrewMember.pnc.speciality === SpecialityEnum.STW)) {
            return -1;
        } else if (crewMember.pnc.speciality === SpecialityEnum.CC && (otherCrewMember.pnc.speciality === SpecialityEnum.HOT || otherCrewMember.pnc.speciality === SpecialityEnum.STW)) {
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
    sortByName(crewMember: CrewMemberModel, otherCrewMember: CrewMemberModel): number {
        return crewMember.pnc.lastName < otherCrewMember.pnc.lastName ? -1 : 1;
    }

    /**
     * redirige vers la page d'accueil du pnc ou du cadre
     * @param matricule matricule du pnc concerné
     * @param onBoardFonction la fontion a bord du pnc concerné
     */
    openPncHomePage(matricule) {
        this.pncService.getPnc(matricule).then(crewMember => {
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
