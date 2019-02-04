import { CongratulationLetterFlightModel } from './../../../../core/models/congratulation-letter-flight.model';
import { CongratulationLetterModeEnum } from '../../../../core/enums/congratulation-letter/congratulation-letter-mode.enum';
import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { CongratulationLetterModel } from '../../../../core/models/congratulation-letter.model';
import { PncModel } from '../../../../core/models/pnc.model';

@Component({
    selector: 'congratulation-letters',
    templateUrl: 'congratulation-letters.page.html',
})
export class CongratulationLettersPage {

    CongratulationLetterModeEnum = CongratulationLetterModeEnum;

    selectedCongratulationLetterMode: CongratulationLetterModeEnum;

    receivedCongratulationLetters: CongratulationLetterModel[];

    writtenCongratulationLetters: CongratulationLetterModel[];

    constructor(private navCtrl: NavController) {

    }

    ionViewDidEnter() {
        this.selectedCongratulationLetterMode = CongratulationLetterModeEnum.RECEIVED;
        const f = new CongratulationLetterFlightModel();
        f.airline = 'AF';
        f.number = '022';
        const w = new PncModel();
        w.firstName = 'Thibaut';
        w.lastName = 'Dumont';

        this.receivedCongratulationLetters = new Array();
        const c1 = new CongratulationLetterModel();
        c1.flight = f;
        c1.creationDate = new Date();
        c1.collective = true;
        c1.writer = w;
        const c2 = new CongratulationLetterModel();
        c2.flight = f;
        c2.creationDate = new Date();
        c2.collective = false;
        c2.writer = w;
        const c4 = new CongratulationLetterModel();
        c4.flight = f;
        c4.creationDate = new Date();
        c4.collective = true;
        c4.writer = w;
        this.receivedCongratulationLetters.push(c1);
        this.receivedCongratulationLetters.push(c2);
        this.receivedCongratulationLetters.push(c4);


        this.writtenCongratulationLetters = new Array();
        const c3 = new CongratulationLetterModel();
        c3.creationDate = new Date();
        c3.collective = true;
        c3.flight = f;
        const c6 = new CongratulationLetterModel();
        c6.creationDate = new Date();
        c6.collective = false;
        c6.flight = f;
        this.writtenCongratulationLetters.push(c3);
        this.writtenCongratulationLetters.push(c6);
    }

    displayReceivedLetters(): void {
        this.selectedCongratulationLetterMode = CongratulationLetterModeEnum.RECEIVED;
    }

    displayWrittenLetters(): void {
        this.selectedCongratulationLetterMode = CongratulationLetterModeEnum.WRITTEN;
    }

    isTabActive(mode: CongratulationLetterModeEnum): boolean {
        return mode === this.selectedCongratulationLetterMode;
    }
}
