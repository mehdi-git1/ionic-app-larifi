import { OnlinePncService } from '../../../../core/services/pnc/online-pnc.service';
import { OfflinePncService } from '../../../../core/services/pnc/offline-pnc.service';
import { PncTransformerService } from '../../../../core/services/pnc/pnc-transformer.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { LegService } from '../../../../core/services/leg/leg.service';
import { GenderService } from '../../../../core/services/gender/gender.service';
import { IonicModule, Platform, NavController, NavParams } from 'ionic-angular';
import { CrewMemberEnum } from '../../../../core/models/crew-member.enum';
import { FlightCrewListPage } from './flight-crew-list.page';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { } from 'jasmine';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    NavMock,
    PlatformMock
} from '../../../../../test-config/mocks-ionic';
import { SpecialityEnum } from '../../../../core/enums/speciality.enum';


describe('FlightCrewListPage', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FlightCrewListPage],
            imports: [
                IonicModule.forRoot(FlightCrewListPage)
            ],
            providers: [
                { provide: Platform, useClass: PlatformMock },
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavMock },
                { provide: GenderService },
                { provide: LegService },
                { provide: ConnectivityService },
                { provide: ToastService },
                { provide: TranslateService },
                { provide: PncService },
                { provide: OfflinePncService },
                { provide: OnlinePncService },
                { provide: SessionService },
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

    function createCrewMember(prioritized: boolean, particularity: string, speciality: SpecialityEnum, lastName: string): CrewMemberEnum {
        const crewMember: CrewMemberEnum = new CrewMemberEnum();
        crewMember.particularity = particularity;
        crewMember.pnc = new PncModel();
        crewMember.pnc.prioritized = prioritized;
        crewMember.pnc.speciality = speciality;
        crewMember.pnc.lastName = lastName;
        return crewMember;
    }

    it('Dans une liste d\'équipage sans priorité, les membres doivent être triés par spécialité, puis par nom', () => {
        expect(comp).toBeDefined();
        const unsortedFlightCrewList: CrewMemberEnum[] = new Array();
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
        const unsortedFlightCrewList: CrewMemberEnum[] = new Array();
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
        const unsortedFlightCrewList: CrewMemberEnum[] = new Array();
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
        const unsortedFlightCrewList: CrewMemberEnum[] = new Array();
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

