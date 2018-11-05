import { ProfessionalLevel } from './../../models/professionalLevel/professional-level';
import { Pnc } from './../../models/pnc';
import { ProfessionalLevelTransformerProvider } from './professional-level-transformer';
import { TestBed } from '@angular/core/testing';
import { ProfessionalLevelProvider } from './professional-level';
import { Config } from './../../configuration/environment-variables/rct';
import { ConnectivityService } from './../../services/connectivity/connectivity.service';

describe('ProfessionalLevelProvider', () => {

    let professionalLevelTransformerProvider: ProfessionalLevelTransformerProvider;

    beforeEach(() => {
        professionalLevelTransformerProvider = new ProfessionalLevelTransformerProvider();
    });


    describe('fonction toProfessionalLevel', () => {
        it('L\'objet retourné devrait être de type ProfessionalLevel car l\'objet donné en entrée respecte le format de cette classe', () => {
            const object = {
                matricule: 'plo',
                stagesList: []
            };
            const result = professionalLevelTransformerProvider.toProfessionalLevel(object);
            expect(result.stagesList).toBeDefined();
        });

        it('L\'objet retourné ne devrait pas être de type ProfessionalLevel car l\'objet donné en entrée ne respecte pas le format de cette classe', () => {
            const object = {
                matricule: 'plo',
                stage: []
            };
            const result = professionalLevelTransformerProvider.toProfessionalLevel(object);
            expect(result.stagesList).toBeUndefined();
        });

        it('L\'objet retourné devrait être null car l\'objet donné en entrée est null', () => {
            const result = professionalLevelTransformerProvider.toProfessionalLevel(null);
            expect(result).toBeNull();
        });
    });
});
