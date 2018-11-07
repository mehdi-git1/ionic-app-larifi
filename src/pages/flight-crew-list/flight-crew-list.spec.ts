import { OnlinePncProvider } from '../../providers/pnc/online-pnc';
import { OfflinePncProvider } from './../../providers/pnc/offline-pnc';
import { PncTransformerProvider } from './../../providers/pnc/pnc-transformer';
import { SessionService } from './../../services/session.service';
import { PncProvider } from './../../providers/pnc/pnc';
import { TranslateService } from '@ngx-translate/core';
import { ToastProvider } from './../../providers/toast/toast';
import { ConnectivityService } from '../../services/connectivity/connectivity.service';
import { LegProvider } from './../../providers/leg/leg';
import { GenderProvider } from './../../providers/gender/gender';
import { IonicModule, Platform, NavController, NavParams } from 'ionic-angular';
import { Speciality } from './../../models/speciality';
import { CrewMember } from './../../models/crewMember';
import { FlightCrewListPage } from './flight-crew-list';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { } from 'jasmine';
import { Pnc } from '../../models/pnc';
import {
    NavMock,
    PlatformMock
} from '../../test-config/mocks-ionic';


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
                { provide: GenderProvider },
                { provide: LegProvider },
                { provide: ConnectivityService },
                { provide: ToastProvider },
                { provide: TranslateService },
                { provide: PncProvider },
                { provide: OfflinePncProvider },
                { provide: OnlinePncProvider },
                { provide: SessionService },
                { provide: PncTransformerProvider }
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

    function createCrewMember(prioritized: boolean, particularity: string, speciality: Speciality, lastName: string): CrewMember {
        const crewMember: CrewMember = new CrewMember();
        crewMember.particularity = particularity;
        crewMember.pnc = new Pnc();
        crewMember.pnc.prioritized = prioritized;
        crewMember.pnc.speciality = speciality;
        crewMember.pnc.lastName = lastName;
        return crewMember;
    }

    it('Dans une liste d\'équipage sans prioritaire, les membres doivent être triés par spécialité, puis par nom', () => {
        expect(comp).toBeDefined();
        const unsortedFlightCrewList: CrewMember[] = new Array();
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.STW, 'I'));
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.STW, 'D'));
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.STW, 'G'));
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.STW, 'J'));
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.STW, 'B'));
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.STW, 'E'));
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.STW, 'F'));
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.STW, 'C'));
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.STW, 'A'));
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.STW, 'H'));

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
        const unsortedFlightCrewList: CrewMember[] = new Array();
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.STW, 'E'));
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.HOT, 'D'));
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.STW, 'C'));
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.STW, 'A'));
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.HOT, 'B'));

        const sortedFlightCrewList = comp.sortFlightCrewList(unsortedFlightCrewList);
        expect(sortedFlightCrewList[0].pnc.lastName).toEqual('A');
        expect(sortedFlightCrewList[1].pnc.lastName).toEqual('B');
        expect(sortedFlightCrewList[2].pnc.lastName).toEqual('C');
        expect(sortedFlightCrewList[3].pnc.lastName).toEqual('D');
        expect(sortedFlightCrewList[4].pnc.lastName).toEqual('E');
    });

    it('Dans une liste d\'équipage avent des membres ayant la même spécialité et le même nom, les membres doivent être triés par priorité', () => {
        expect(comp).toBeDefined();
        const unsortedFlightCrewList: CrewMember[] = new Array();
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.CC, 'A'));
        unsortedFlightCrewList.push(createCrewMember(false, 'P', Speciality.CC, 'A'));
        unsortedFlightCrewList.push(createCrewMember(true, 'P', Speciality.CC, 'A'));

        const sortedFlightCrewList = comp.sortFlightCrewList(unsortedFlightCrewList);
        expect(sortedFlightCrewList[0].pnc.prioritized).toEqual(true);
        expect(sortedFlightCrewList[1].pnc.prioritized).toEqual(false);
        expect(sortedFlightCrewList[1].particularity).toEqual('P');
        expect(sortedFlightCrewList[2].pnc.prioritized).toEqual(false);
        expect(sortedFlightCrewList[2].particularity).toEqual(null);
    });

    it('Dans une liste d\'équipage, les membres doivent être triés par priorité, puis par specialité et enfin par nom', () => {

        expect(comp).toBeDefined();
        const unsortedFlightCrewList: CrewMember[] = new Array();
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.STW, 'I'));
        unsortedFlightCrewList.push(createCrewMember(false, 'P', Speciality.STW, 'D'));
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.CC, 'G'));
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.STW, 'J'));
        unsortedFlightCrewList.push(createCrewMember(true, 'P', Speciality.STW, 'B'));
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.CAD, 'E'));
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.CCP, 'F'));
        unsortedFlightCrewList.push(createCrewMember(false, 'P', Speciality.CAD, 'C'));
        unsortedFlightCrewList.push(createCrewMember(true, 'P', Speciality.CC, 'A'));
        unsortedFlightCrewList.push(createCrewMember(false, null, Speciality.HOT, 'H'));

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

