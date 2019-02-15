import { fakeAsync } from '@angular/core/testing';

import { OfflineLegService } from './offline-leg.service';
import { CrewMemberEnum } from '../../models/crew-member.enum';

const storageServiceMock = jasmine.createSpyObj('storageServiceMock', ['findAll']);

describe('offlineLegService', () => {

    let offlineLegService: OfflineLegService;
    let crewMemberArray: CrewMemberEnum[];

    beforeEach(() => {
        offlineLegService = new OfflineLegService(storageServiceMock);
    });

    describe('getFlightCrewFromLeg', () => {

        beforeEach(() => {
            crewMemberArray = [new CrewMemberEnum(), new CrewMemberEnum(), new CrewMemberEnum()];
            crewMemberArray[0].legId = 654;
            crewMemberArray[1].legId = 785;
            crewMemberArray[2].legId = 654;
            storageServiceMock.findAll.and.returnValue(crewMemberArray);
        });

        it('doit remener la liste des crewMemeber pour le legId 654', fakeAsync(() => {
            offlineLegService.getFlightCrewFromLeg(654).then(
                crewMembers => {
                    expect(crewMembers.length).toBe(2);
                }
            );
        }));

    });

});
