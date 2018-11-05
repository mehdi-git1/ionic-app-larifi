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


    describe('test de la fonction toProfessionalLevel', () => {
        it('doit vérifier que la fonction envoie bien un objet de type ProfessionalLevel', () => {
            const object = {
                matricule: 'plo',
                stagesList: []
            };
            const result = professionalLevelTransformerProvider.toProfessionalLevel(object);
            expect(result.stagesList).toBeDefined();
        });

        it('doit vérifier que la fonction n\'envoie pas un objet de type ProfessionalLevel quand on envoie un objet différent du type ProfessionalLevel', () => {
            const object = {
                matricule: 'plo',
                stage: []
            };
            const result = professionalLevelTransformerProvider.toProfessionalLevel(object);
            expect(result.stagesList).toBeUndefined();
        });

        it('doit vérifier que la fonction envoie null quand on envois rien en paramètre', () => {
            const result = professionalLevelTransformerProvider.toProfessionalLevel(null);
            expect(result).toEqual(null);
        });
    });
});
