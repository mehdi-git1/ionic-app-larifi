import * as moment from 'moment';
import { SortChange, SortOption } from 'src/app/shared/components/sort-list/sort-list.component';

import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AppConstant } from '../../../../app.constant';
import { SortDirection } from '../../../../core/enums/sort-direction-enum';
import { SpecialityEnum } from '../../../../core/enums/speciality.enum';
import { CrewMemberModel } from '../../../../core/models/crew-member.model';
import { LegModel } from '../../../../core/models/leg.model';
import { Events } from '../../../../core/services/events/events.service';
import { LegService } from '../../../../core/services/leg/leg.service';
import { PncPhotoService } from '../../../../core/services/pnc-photo/pnc-photo.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { Utils } from '../../../../shared/utils/utils';

@Component({
    selector: 'page-flight-crew-list',
    templateUrl: 'flight-crew-list.page.html',
    styleUrls: ['./flight-crew-list.page.scss']
})
export class FlightCrewListPage {

    flightCrewList: CrewMemberModel[];
    leg: LegModel;
    connectedCrewMember: CrewMemberModel;
    sortColumn: string;
    sortDirection: SortDirection;

    sortOptions: Array<SortOption>;

    constructor(
        private legService: LegService,
        private sessionService: SessionService,
        private pncService: PncService,
        private pncPhotoService: PncPhotoService,
        private translateService: TranslateService,
        private loadingCtrl: LoadingController,
        private events: Events) {
        this.initPage();
        this.initSortOptions();
    }

    /**
     * Initialisation du contenu de la page.
     */
    initPage() {
        this.leg = history.state.data.leg;
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
            this.flightCrewList = flightCrews;
            this.sortCrewList({ value: '', direction: SortDirection.ASC });
        }, error => { this.flightCrewList = []; });
    }

    /**
     * Initialise les options de tri
     */
    initSortOptions() {
        this.sortOptions = [
            {
                value: '',
                label: this.translateService.instant('GLOBAL.SORT_LIST.BY_DEFAULT')
            },
            {
                value: 'lastEObservationDate',
                label: this.translateService.instant('GLOBAL.SORT_LIST.LAST_EOBSERVATION')
            },
            {
                value: 'lastProfessionalInterviewDate',
                label: this.translateService.instant('GLOBAL.SORT_LIST.LAST_PROFESSIONAL_INTERVIEW')
            },
            {
                value: 'lastCareerObjectiveUpdateDate',
                label: this.translateService.instant('GLOBAL.SORT_LIST.LAST_UPDATED_CAREER_OBJECTIVE')
            }
        ];
    }


    /**
     * Tri la liste équipage
     * @param sortChange les options de tri
     */
    sortCrewList(sortChange: SortChange) {
        // Permet de gérer le signe des retours des fonctions "sort"
        const asc = sortChange.direction === SortDirection.ASC ? 1 : -1;
        const desc = asc * -1;

        // On commence par le tri par défaut dans tous les cas, afin d'avoir une liste triée au cas où les dates sont vides
        this.flightCrewList.sort((crew1, crew2) => {
            return this.sortCrew(crew1, crew2);
        });
        if (sortChange.direction === SortDirection.DESC) {
            this.flightCrewList.reverse();
        }

        if (sortChange.value === 'lastEObservationDate') {
            this.flightCrewList.sort((crew1, crew2) => {
                if (crew1.pnc.metadataDate.lastEObservationDate === crew2.pnc.metadataDate.lastEObservationDate) {
                    return 0;
                }
                if (Utils.isEmpty(crew1.pnc.metadataDate.lastEObservationDate)) {
                    return 1;
                }
                if (Utils.isEmpty(crew2.pnc.metadataDate.lastEObservationDate)) {
                    return -1;
                }
                return moment(crew1.pnc.metadataDate.lastEObservationDate, AppConstant.isoDateFormat)
                    .isBefore(moment(crew2.pnc.metadataDate.lastEObservationDate, AppConstant.isoDateFormat)) ? desc : asc;
            });
        }
        else if (sortChange.value === 'lastProfessionalInterviewDate') {
            this.flightCrewList.sort((crew1, crew2) => {
                if (crew1.pnc.metadataDate.lastProfessionalInterviewDate === crew2.pnc.metadataDate.lastProfessionalInterviewDate) {
                    return 0;
                }
                if (Utils.isEmpty(crew1.pnc.metadataDate.lastProfessionalInterviewDate)) {
                    return 1;
                }
                if (Utils.isEmpty(crew2.pnc.metadataDate.lastProfessionalInterviewDate)) {
                    return -1;
                }
                return moment(crew1.pnc.metadataDate.lastProfessionalInterviewDate, AppConstant.isoDateFormat)
                    .isBefore(moment(crew2.pnc.metadataDate.lastProfessionalInterviewDate, AppConstant.isoDateFormat)) ? desc : asc;
            });
        }
        else if (sortChange.value === 'lastCareerObjectiveUpdateDate') {
            this.flightCrewList.sort((crew1, crew2) => {
                if (crew1.pnc.metadataDate.lastCareerObjectiveUpdateDate === crew2.pnc.metadataDate.lastCareerObjectiveUpdateDate) {
                    return 0;
                }
                if (Utils.isEmpty(crew1.pnc.metadataDate.lastCareerObjectiveUpdateDate)) {
                    return 1;
                }
                if (Utils.isEmpty(crew2.pnc.metadataDate.lastCareerObjectiveUpdateDate)) {
                    return -1;
                }
                return moment(crew1.pnc.metadataDate.lastCareerObjectiveUpdateDate, AppConstant.isoDateFormat)
                    .isBefore(moment(crew2.pnc.metadataDate.lastCareerObjectiveUpdateDate, AppConstant.isoDateFormat)) ? desc : asc;
            });
        }
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
        if ((crewMember.pnc.speciality === otherCrewMember.pnc.speciality)
            || (crewMember.pnc.speciality === SpecialityEnum.HOT && otherCrewMember.pnc.speciality === SpecialityEnum.STW)
            || (crewMember.pnc.speciality === SpecialityEnum.STW && otherCrewMember.pnc.speciality === SpecialityEnum.HOT)) {
            return this.sortByName(crewMember, otherCrewMember);
        } else if (crewMember.pnc.speciality === SpecialityEnum.CAD) {
            return -1;
        } else if (crewMember.pnc.speciality === SpecialityEnum.CCP
            && (otherCrewMember.pnc.speciality === SpecialityEnum.CC
                || otherCrewMember.pnc.speciality === SpecialityEnum.HOT
                || otherCrewMember.pnc.speciality === SpecialityEnum.STW)) {
            return -1;
        } else if (crewMember.pnc.speciality === SpecialityEnum.CC
            && (otherCrewMember.pnc.speciality === SpecialityEnum.HOT || otherCrewMember.pnc.speciality === SpecialityEnum.STW)) {
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
        this.loadingCtrl.create().then(loading => {
            loading.present();

            this.pncService.getPnc(matricule).then(pnc => {
                loading.dismiss();
                this.events.publish('EDossier:visited', { visitedPnc: pnc });
            });
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
