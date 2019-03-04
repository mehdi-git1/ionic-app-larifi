import { fakeAsync } from '@angular/core/testing';

import { OfflineLegService } from './offline-leg.service';
import { CrewMemberModel } from '../../models/crew-member.model';

const storageServiceMock = jasmine.createSpyObj('storageServiceMock', ['findAll']);

describe('offlineLegService', () => {

    let offlineLegService: OfflineLegService;
    let crewMemberArray: CrewMemberModel[];

    beforeEach(() => {
        offlineLegService = new OfflineLegService(storageServiceMock);
    });

    describe('getFlightCrewFromLeg', () => {

        beforeEach(() => {
            crewMemberArray = [new CrewMemberModel(), new CrewMemberModel(), new CrewMemberModel()];
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
