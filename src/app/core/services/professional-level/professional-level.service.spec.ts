import { ProfessionalLevelService } from './professional-level.service';
import { ProfessionalLevelModel } from '../../models/professional-level/professional-level.model';
import { StageModel } from '../../models/professional-level/stage.model';
import { ModuleModel } from '../../models/professional-level/module.model';


const connectivityServiceMock = jasmine.createSpyObj('connectivityServiceMock', ['isConnected']);
const onlineServiceMock = jasmine.createSpyObj('onlineServiceMock', ['']);
const offlineServiceMock = jasmine.createSpyObj('offlineServiceMock', ['']);

describe('ProfessionalLevelPage', () => {

    let professionalLevelService;

    beforeEach(() => {
        professionalLevelService = new ProfessionalLevelService(connectivityServiceMock, onlineServiceMock, offlineServiceMock);
    });

    describe('sortScoreModuleByOrder', () => {

        let professionalLevelModel: ProfessionalLevelModel;
        professionalLevelModel = new ProfessionalLevelModel();

        beforeEach(() => {
            professionalLevelModel.stages = [new StageModel()];
            professionalLevelModel.stages[0].modules = [new ModuleModel()];
        });

        it('doit trier les scores des modules par ordre A-T-R', () => {
            professionalLevelModel.stages[0].modules[0].scores = [
                { evaluationCode: 'T', score: 90, order: 2 },
                { evaluationCode: 'R', score: 90, order: 3 },
                { evaluationCode: 'A', score: 90, order: 1 }
            ];
            console.log(professionalLevelModel);
            const professionalLevelModelCurrent = professionalLevelService.sortScoreModuleByOrder(professionalLevelModel);
            expect(professionalLevelModelCurrent.stages[0].modules[0].scores[0].evaluationCode).toEqual('A');
            expect(professionalLevelModelCurrent.stages[0].modules[0].scores[1].evaluationCode).toEqual('T');
            expect(professionalLevelModelCurrent.stages[0].modules[0].scores[2].evaluationCode).toEqual('R');
        });

        it('doit trier les scores des modules par ordre E1-E2-FC', () => {
            professionalLevelModel.stages[0].modules[0].scores = [
                { evaluationCode: 'E2', score: 90, order: 2 },
                { evaluationCode: 'FC', score: 90, order: 3 },
                { evaluationCode: 'E1', score: 90, order: 1 }
            ];
            console.log(professionalLevelModel);
            const professionalLevelModelCurrent = professionalLevelService.sortScoreModuleByOrder(professionalLevelModel);
            expect(professionalLevelModelCurrent.stages[0].modules[0].scores[0].evaluationCode).toEqual('E1');
            expect(professionalLevelModelCurrent.stages[0].modules[0].scores[1].evaluationCode).toEqual('E2');
            expect(professionalLevelModelCurrent.stages[0].modules[0].scores[2].evaluationCode).toEqual('FC');
        });
    });

});
