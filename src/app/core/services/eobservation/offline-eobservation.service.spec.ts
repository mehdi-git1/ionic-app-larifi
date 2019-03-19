import { fakeAsync } from '@angular/core/testing';

import { EObservationModel } from './../../models/eobservation/eobservation.model';
import { OfflineEObservationService } from './offline-eobservation.service';
import { OfflineActionEnum } from '../../enums/offline-action.enum';
import { PncModel } from '../../models/pnc.model';

const storageServiceMock = jasmine.createSpyObj('storageServiceMock', ['findAll']);

describe('offlineEobservationService', () => {

    let offlineEObservationService: OfflineEObservationService;
    let eObservationModelArray: EObservationModel[];

    beforeEach(() => {
        offlineEObservationService = new OfflineEObservationService(storageServiceMock);
    });

    beforeEach(() => {
        eObservationModelArray = [new EObservationModel(), new EObservationModel(), new EObservationModel()];
        eObservationModelArray[0].pnc = new PncModel();
        eObservationModelArray[0].pnc.matricule = '778855';
        eObservationModelArray[0].offlineAction = OfflineActionEnum.DELETE;
        eObservationModelArray[1].pnc = new PncModel();
        eObservationModelArray[1].pnc.matricule = '775544';
        eObservationModelArray[1].offlineAction = OfflineActionEnum.CREATE;
        eObservationModelArray[2].pnc = new PncModel();
        eObservationModelArray[2].pnc.matricule = '778855';
        eObservationModelArray[2].offlineAction = OfflineActionEnum.UPDATE;
        storageServiceMock.findAll.and.returnValue(eObservationModelArray);
    });

    describe('getEObservations', () => {

        it('doit retourner les Eobservations du PNC 778855 non supprimé en offline', fakeAsync(() => {
            offlineEObservationService.getEObservations('778855').then(
                careerObjective => {
                    expect(careerObjective[0].pnc.matricule).toBe('778855');
                    expect(careerObjective[0].offlineAction).toBe(OfflineActionEnum.UPDATE);
                }
            );
        }));
    });



});
