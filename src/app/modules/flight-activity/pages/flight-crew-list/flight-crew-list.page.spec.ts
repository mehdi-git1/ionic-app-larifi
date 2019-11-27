import { async } from 'q';
import { of } from 'rxjs/observable/of';

import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SpecialityEnum } from '../../../../core/enums/speciality.enum';
import { CrewMemberModel } from '../../../../core/models/crew-member.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { GenderService } from '../../../../core/services/gender/gender.service';
import { LegService } from '../../../../core/services/leg/leg.service';
import { PncPhotoService } from '../../../../core/services/pnc-photo/pnc-photo.service';
import { PncTransformerService } from '../../../../core/services/pnc/pnc-transformer.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { FlightCrewListPage } from './flight-crew-list.page';

const pncServiceMock = jasmine.createSpyObj('pncServiceMock', ['getPnc']);
pncServiceMock.getPnc.and.returnValue(of({}));
const sessionServiceMock = jasmine.createSpyObj('sessionServiceMock', ['']);
const routerMock = jasmine.createSpyObj('routerMock', ['navigate']);

describe('FlightCrewListPage', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FlightCrewListPage],
            imports: [
                IonicModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
                        deps: [HttpClient]
                    }
                })
            ],
            providers: [
                { provide: Router, useValue: routerMock },
                ActivatedRoute,
                { provide: GenderService },
                { provide: LegService },
                { provide: ConnectivityService },
                { provide: ToastService },
                { provide: TranslateService },
                { provide: PncService, useValue: pncServiceMock },
                { provide: SessionService, useValue: sessionServiceMock },
                { provide: PncPhotoService },
                { provide: PncTransformerService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    let fixture: ComponentFixture<FlightCrewListPage>;
    let comp: FlightCrewListPage;

    beforeEach(() => {
        fixture = TestBed.createComponent(FlightCrewListPage);
        comp = fixture.componentInstance;
    });

    function createCrewMember(prioritized: boolean, particularity: string, speciality: SpecialityEnum, lastName: string): CrewMemberModel {
        const crewMember: CrewMemberModel = new CrewMemberModel();
        crewMember.particularity = particularity;
        crewMember.pnc = new PncModel();
        crewMember.pnc.prioritized = prioritized;
        crewMember.pnc.speciality = speciality;
        crewMember.pnc.lastName = lastName;
        return crewMember;
    }

    describe('sortFlightCrewList', () => {

        it('Dans une liste d\'équipage sans priorité, les membres doivent être triés par spécialité, puis par nom', () => {
            expect(comp).toBeDefined();
            const unsortedFlightCrewList: CrewMemberModel[] = new Array();
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.STW, 'I'));
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.STW, 'D'));
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.STW, 'G'));
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.STW, 'J'));
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.STW, 'B'));
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.STW, 'E'));
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.STW, 'F'));
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.STW, 'C'));
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.STW, 'A'));
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.STW, 'H'));

            const sortedFlightCrewList = comp.sortFlightCrewList(unsortedFlightCrewList);
            expect(sortedFlightCrewList[0].pnc.lastName).toEqual('A');
            expect(sortedFlightCrewList[1].pnc.lastName).toEqual('B');
            expect(sortedFlightCrewList[2].pnc.lastName).toEqual('C');
            expect(sortedFlightCrewList[3].pnc.lastName).toEqual('D');
            expect(sortedFlightCrewList[4].pnc.lastName).toEqual('E');
            expect(sortedFlightCrewList[5].pnc.lastName).toEqual('F');
            expect(sortedFlightCrewList[6].pnc.lastName).toEqual('G');
            expect(sortedFlightCrewList[7].pnc.lastName).toEqual('H');
            expect(sortedFlightCrewList[8].pnc.lastName).toEqual('I');
            expect(sortedFlightCrewList[9].pnc.lastName).toEqual('J');
        });


        it('Dans une liste d\'équipage ne contenant que des hotesses & stewards, les membres doivent être triés par nom', () => {
            expect(comp).toBeDefined();
            const unsortedFlightCrewList: CrewMemberModel[] = new Array();
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.STW, 'E'));
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.HOT, 'D'));
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.STW, 'C'));
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.STW, 'A'));
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.HOT, 'B'));

            const sortedFlightCrewList = comp.sortFlightCrewList(unsortedFlightCrewList);
            expect(sortedFlightCrewList[0].pnc.lastName).toEqual('A');
            expect(sortedFlightCrewList[1].pnc.lastName).toEqual('B');
            expect(sortedFlightCrewList[2].pnc.lastName).toEqual('C');
            expect(sortedFlightCrewList[3].pnc.lastName).toEqual('D');
            expect(sortedFlightCrewList[4].pnc.lastName).toEqual('E');
        });

        it('Dans une liste d\'équipage avec des membres ayant la même spécialité et le même nom, les membres doivent être triés par priorité', () => {
            expect(comp).toBeDefined();
            const unsortedFlightCrewList: CrewMemberModel[] = new Array();
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.CC, 'A'));
            unsortedFlightCrewList.push(createCrewMember(false, 'P', SpecialityEnum.CC, 'A'));
            unsortedFlightCrewList.push(createCrewMember(true, 'P', SpecialityEnum.CC, 'A'));

            const sortedFlightCrewList = comp.sortFlightCrewList(unsortedFlightCrewList);
            expect(sortedFlightCrewList[0].pnc.prioritized).toEqual(true);
            expect(sortedFlightCrewList[1].pnc.prioritized).toEqual(false);
            expect(sortedFlightCrewList[1].particularity).toEqual('P');
            expect(sortedFlightCrewList[2].pnc.prioritized).toEqual(false);
            expect(sortedFlightCrewList[2].particularity).toEqual(null);
        });

        it('Dans une liste d\'équipage, les membres doivent être triés par priorité, puis par specialité et enfin par nom', () => {

            expect(comp).toBeDefined();
            const unsortedFlightCrewList: CrewMemberModel[] = new Array();
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.STW, 'I'));
            unsortedFlightCrewList.push(createCrewMember(false, 'P', SpecialityEnum.STW, 'D'));
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.CC, 'G'));
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.STW, 'J'));
            unsortedFlightCrewList.push(createCrewMember(true, 'P', SpecialityEnum.STW, 'B'));
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.CAD, 'E'));
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.CCP, 'F'));
            unsortedFlightCrewList.push(createCrewMember(false, 'P', SpecialityEnum.CAD, 'C'));
            unsortedFlightCrewList.push(createCrewMember(true, 'P', SpecialityEnum.CC, 'A'));
            unsortedFlightCrewList.push(createCrewMember(false, null, SpecialityEnum.HOT, 'H'));

            const sortedFlightCrewList = comp.sortFlightCrewList(unsortedFlightCrewList);
            expect(sortedFlightCrewList[0].pnc.lastName).toEqual('A');
            expect(sortedFlightCrewList[1].pnc.lastName).toEqual('B');
            expect(sortedFlightCrewList[2].pnc.lastName).toEqual('C');
            expect(sortedFlightCrewList[3].pnc.lastName).toEqual('D');
            expect(sortedFlightCrewList[4].pnc.lastName).toEqual('E');
            expect(sortedFlightCrewList[5].pnc.lastName).toEqual('F');
            expect(sortedFlightCrewList[6].pnc.lastName).toEqual('G');
            expect(sortedFlightCrewList[7].pnc.lastName).toEqual('H');
            expect(sortedFlightCrewList[8].pnc.lastName).toEqual('I');
            expect(sortedFlightCrewList[9].pnc.lastName).toEqual('J');
        });
    });

    describe('openPncHomePage', () => {
        it('Dans une liste d\'équipage, quand on clique sur le dossier d\'un pnc, on change la valeur du pnc observé', () => {
            async(() => {
                expect(comp).toBeDefined();
                const matricule = 'XXX';
                comp.openPncHomePage(matricule);
                expect(this.sessionService.appContext.observedPncMatricule).toEqual(matricule);
            });
        });
    });

});

