import { fakeAsync } from '@angular/core/testing';

import { OfflineLegService } from './offline-leg.service';
import { CrewMemberModel } from '../../models/crew-member.model';
import { LegModel } from '../../models/leg.model';

const storageServiceMock = jasmine.createSpyObj('storageServiceMock', ['findAll']);

describe('offlineLegService', () => {

    let offlineLegService: OfflineLegService;
    let crewMemberArray: CrewMemberModel[];

    const AF = 'AF';
    const AF022 = '022';
    const AF006 = '006';
    const VINGT_MAI_2019_10H00 = '2019-05-20T10:00:00';
    const VINGT_DEUX_MAI_2019_10H00 = '2019-05-22T10:00:00';

    beforeEach(() => {
        offlineLegService = new OfflineLegService(storageServiceMock);
    });

    describe('getCrewMembersFromLeg', () => {

        beforeEach(() => {
            crewMemberArray = [new CrewMemberModel(), new CrewMemberModel(), new CrewMemberModel()];
            crewMemberArray[0].leg = new LegModel();
            crewMemberArray[0].leg.company = AF;
            crewMemberArray[0].leg.number = AF022;
            crewMemberArray[0].leg.departureDate = VINGT_MAI_2019_10H00;

            crewMemberArray[1].leg = new LegModel();
            crewMemberArray[1].leg.company = AF;
            crewMemberArray[1].leg.number = AF022;
            crewMemberArray[1].leg.departureDate = VINGT_MAI_2019_10H00;

            crewMemberArray[2].leg = new LegModel();
            crewMemberArray[2].leg.company = AF;
            crewMemberArray[2].leg.number = AF006;
            crewMemberArray[2].leg.departureDate = VINGT_DEUX_MAI_2019_10H00;

            storageServiceMock.findAll.and.returnValue(crewMemberArray);
        });

        it('On devrait avoir 2 membres d\'équipage pour le vol AF022 du 20 Mai 2019 10:00', fakeAsync(() => {
            const leg = new LegModel();
            leg.company = AF;
            leg.number = AF022;
            leg.departureDate = VINGT_MAI_2019_10H00;

            offlineLegService.getCrewMembersFromLeg(leg).then(
                crewMembers => {
                    expect(crewMembers.length).toBe(2);
                }
            );
        }));

    });

});
