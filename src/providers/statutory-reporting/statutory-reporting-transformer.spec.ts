import { StatutoryReporting } from './../../models/statutoryReporting/statutory-reporting';
import { Pnc } from './../../models/pnc';
import { StatutoryReportingTransformerProvider } from './statutory-reporting-transformer';
import { TestBed } from '@angular/core/testing';
import { StatutoryReportingProvider } from './statutory-reporting';
import { Config } from './../../configuration/environment-variables/rct';
import { ConnectivityService } from './../../services/connectivity/connectivity.service';

describe('StatutoryReportingProvider', () => {

    let statutoryReportingTransformerProvider: StatutoryReportingTransformerProvider;

    beforeEach(() => {
        statutoryReportingTransformerProvider = new StatutoryReportingTransformerProvider();
    });


    describe('test de la fonction toStatutoryReporting', () => {
        it('doit vérifier que la fonction envoie bien un objet de type StatutoryReporting', () => {
            const object = {
                matricule: 'plo',
                stagesList: []
            };
            const result = statutoryReportingTransformerProvider.toStatutoryReporting(object);
            expect(result.stagesList).toBeDefined();
        });

        it('doit vérifier que la fonction n\'envoie pas un objet de type StatutoryReporting quand on envoie un objet différent du type StatutoryReporting', () => {
            const object = {
                matricule: 'plo',
                stage: []
            };
            const result = statutoryReportingTransformerProvider.toStatutoryReporting(object);
            expect(result.stagesList).toBeUndefined();
        });

        it('doit vérifier que la fonction envoie null quand on envois rien en paramètre', () => {
            const result = statutoryReportingTransformerProvider.toStatutoryReporting(null);
            expect(result).toEqual(null);
        });
    });
});
