import { fakeAsync } from '@angular/core/testing';
import { OfflineCareerObjectiveService } from './offline-career-objective.service';
import { CareerObjectiveModel } from '../../models/career-objective.model';
import { OfflineActionEnum } from '../../enums/offline-action.enum';
import { PncModel } from '../../models/pnc.model';


const storageServiceMock = jasmine.createSpyObj('storageServiceMock', ['findAll']);


describe('OfflineCareerObjectiveService', () => {


    let offlineCareerObjectiveService: OfflineCareerObjectiveService;
    let careerObjectiveModelArray: CareerObjectiveModel[];

    beforeEach(() => {
        offlineCareerObjectiveService = new OfflineCareerObjectiveService(storageServiceMock);
    });

    describe('getPncCareerObjectives', () => {

        beforeEach(() => {
            careerObjectiveModelArray = [new CareerObjectiveModel(), new CareerObjectiveModel(), new CareerObjectiveModel()];
            careerObjectiveModelArray[0].pnc = new PncModel();
            careerObjectiveModelArray[0].pnc.matricule = '778855';
            careerObjectiveModelArray[0].offlineAction = OfflineActionEnum.DELETE;
            careerObjectiveModelArray[1].pnc = new PncModel();
            careerObjectiveModelArray[1].pnc.matricule = '775544';
            careerObjectiveModelArray[1].offlineAction = OfflineActionEnum.CREATE;
            careerObjectiveModelArray[2].pnc = new PncModel();
            careerObjectiveModelArray[2].pnc.matricule = '778855';
            careerObjectiveModelArray[2].offlineAction = OfflineActionEnum.UPDATE;
            storageServiceMock.findAll.and.returnValue(careerObjectiveModelArray);
        });

        it('doit retourner le career objective du PNC 778855 non supprimé en offline', fakeAsync(() => {
            offlineCareerObjectiveService.getPncCareerObjectives('778855').then(
                careerObjective => {
                    expect(careerObjective[0].pnc.matricule).toBe('778855');
                    expect(careerObjective[0].offlineAction).toBe(OfflineActionEnum.UPDATE);
                }
            );
        }));
    });

});
