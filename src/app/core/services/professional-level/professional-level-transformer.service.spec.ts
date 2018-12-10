import { ProfessionalLevelTransformerService } from './professional-level-transformer.service';
import { ProfessionalLevelService } from './professional-level.service';

describe('ProfessionalLevelService', () => {

    let professionalLevelTransformerProvider: ProfessionalLevelTransformerService;

    beforeEach(() => {
        professionalLevelTransformerProvider = new ProfessionalLevelTransformerService();
    });


    describe('toProfessionalLevel', () => {
        it('L\'objet retourné devrait être de type ProfessionalLevelModel car l\'objet donné en entrée respecte le format de cette classe', () => {
            const object = {
                matricule: 'plo',
                stages: []
            };
            const result = professionalLevelTransformerProvider.toProfessionalLevel(object);
            expect(result.stages).toBeDefined();
        });

        it('L\'objet retourné ne devrait pas être de type ProfessionalLevelModel car l\'objet donné en entrée ne respecte pas le format de cette classe', () => {
            const object = {
                matricule: 'plo',
                stage: []
            };
            const result = professionalLevelTransformerProvider.toProfessionalLevel(object);
            expect(result.stages).toBeUndefined();
        });

        it('L\'objet retourné devrait être null car l\'objet donné en entrée est null', () => {
            const result = professionalLevelTransformerProvider.toProfessionalLevel(null);
            expect(result).toBeNull();
        });
    });
});
