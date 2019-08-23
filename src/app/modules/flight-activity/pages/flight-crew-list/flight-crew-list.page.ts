import { Events, LoadingController, NavParams } from 'ionic-angular';

import { Component } from '@angular/core';

import { SpecialityEnum } from '../../../../core/enums/speciality.enum';
import { CrewMemberModel } from '../../../../core/models/crew-member.model';
import { LegModel } from '../../../../core/models/leg.model';
import { LegService } from '../../../../core/services/leg/leg.service';
import { PncPhotoService } from '../../../../core/services/pnc-photo/pnc-photo.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';

@Component({
    selector: 'page-flight-crew-list',
    templateUrl: 'flight-crew-list.page.html',
})
export class FlightCrewListPage {

    flightCrewList: CrewMemberModel[];
    leg: LegModel;
    connectedCrewMember: CrewMemberModel;

    constructor(
        private navParams: NavParams,
        private legService: LegService,
        private sessionService: SessionService,
        private pncService: PncService,
        private pncPhotoService: PncPhotoService,
        private loadingCtrl: LoadingController,
        private events: Events) {
    }

    ionViewDidEnter() {
        this.initPage();
    }

    /**
     * Initialisation du contenu de la page.
     */
    initPage() {
        this.leg = this.navParams.get('leg');
        this.legService.getCrewMembersFromLeg(this.leg).then(flightCrews => {
            this.pncPhotoService.synchronizePncsPhotos(flightCrews.map(flightCrew => flightCrew.pnc.matricule));
            flightCrews.forEach(crewMember => {
                if (crewMember.pnc.matricule !== undefined && crewMember.pnc.matricule === this.sessionService.getActiveUser().matricule) {
                    this.sessionService.appContext.onBoardRedactorFunction = crewMember.onBoardFonction;
                    this.connectedCrewMember = crewMember;
                }
            });
            // On supprime le PNC connecté de la liste
            if (this.connectedCrewMember) {
                flightCrews = flightCrews.filter(item => item !== this.connectedCrewMember);
            }
            this.flightCrewList = this.sortFlightCrewList(flightCrews);
        }, error => { this.flightCrewList = []; });
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
        const loading = this.loadingCtrl.create();
        loading.present();
        this.pncService.getPnc(matricule).then(pnc => {
            loading.dismiss();
            if (pnc) {
                this.sessionService.appContext.observedPnc = pnc;
                this.events.publish('EDossier:visited', pnc);
            }
        });
    }

    /**
    * Vérifie que le chargement est terminé
    * @return true si c'est le cas, false sinon
    */
    loadingIsOver(): boolean {
        return this.flightCrewList !== undefined;
    }

}
