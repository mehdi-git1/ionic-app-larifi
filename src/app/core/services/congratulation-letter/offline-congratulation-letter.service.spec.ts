import { fakeAsync } from '@angular/core/testing';

import { CongratulationLetterModel } from './../../models/congratulation-letter.model';
import { OfflineCongratulationLetterService } from './offline-congratulation-letter.service';
import { PncModel } from '../../models/pnc.model';

const storageServiceMock = jasmine.createSpyObj('storageServiceMock', ['findAll']);

describe('offlineCongratulationLetterService', () => {

    let offlineCongratulationLetterService: OfflineCongratulationLetterService;
    let congratulationLetterModelArray: CongratulationLetterModel[];

    beforeEach(() => {
        offlineCongratulationLetterService = new OfflineCongratulationLetterService(storageServiceMock);
    });

    beforeEach(() => {
        congratulationLetterModelArray = [new CongratulationLetterModel(), new CongratulationLetterModel(), new CongratulationLetterModel()];
        congratulationLetterModelArray[0].creationDate = new Date('01/01/2017');
        congratulationLetterModelArray[0].redactor = new PncModel();
        congratulationLetterModelArray[0].redactor.matricule = '787878';
        congratulationLetterModelArray[0].concernedPncs = [new PncModel(), new PncModel()];
        congratulationLetterModelArray[0].concernedPncs[0].matricule = '727272';
        congratulationLetterModelArray[0].concernedPncs[1].matricule = '787878';
        congratulationLetterModelArray[1].creationDate = new Date('01/01/2018');
        congratulationLetterModelArray[1].redactor = new PncModel();
        congratulationLetterModelArray[1].redactor.matricule = '787898';
        congratulationLetterModelArray[1].concernedPncs = [new PncModel(), new PncModel()];
        congratulationLetterModelArray[1].concernedPncs[0].matricule = '989898';
        congratulationLetterModelArray[1].concernedPncs[1].matricule = '787822';
        congratulationLetterModelArray[2].creationDate = new Date('01/01/2019');
        congratulationLetterModelArray[2].redactor = new PncModel();
        congratulationLetterModelArray[2].redactor.matricule = '787878';
        congratulationLetterModelArray[2].concernedPncs = [new PncModel(), new PncModel()];
        congratulationLetterModelArray[2].concernedPncs[0].matricule = '787878';
        congratulationLetterModelArray[2].concernedPncs[1].matricule = '787822';
        storageServiceMock.findAll.and.returnValue(congratulationLetterModelArray);
    });

    describe('getReceivedCongratulationLetters', () => {

        it('doit renvoyer les lettres de felicitations recues par 787878 trié par date décroissante', fakeAsync(() => {
            offlineCongratulationLetterService.getReceivedCongratulationLetters('787878').then(
                congratulationLetters => {
                    expect(congratulationLetters[0].concernedPncs[0].matricule).toBe('787878');
                    expect(congratulationLetters[0].creationDate).toEqual(new Date('01/01/2019'));
                    expect(congratulationLetters[1].concernedPncs[1].matricule).toBe('787878');
                    expect(congratulationLetters[1].creationDate).toEqual(new Date('01/01/2017'));
                }
            );
        }));
    });

    describe('getWrittenCongratulationLetters', () => {

        it('doit renvoyer les lettres de felicataions écrites par 787878 trié par date décroissante', fakeAsync(() => {
            offlineCongratulationLetterService.getWrittenCongratulationLetters('787878').then(
                congratulationLetters => {
                    expect(congratulationLetters[0].redactor.matricule).toBe('787878');
                    expect(congratulationLetters[0].creationDate).toEqual(new Date('01/01/2019'));
                    expect(congratulationLetters[1].redactor.matricule).toBe('787878');
                    expect(congratulationLetters[1].creationDate).toEqual(new Date('01/01/2017'));
                }
            );
        }));
    });

});
