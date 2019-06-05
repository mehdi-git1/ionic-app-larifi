import { TabNavModeEnum } from './../../../core/enums/tab-nav-mode.enum';
import { Component, Input } from '@angular/core';
import { PncModel } from '../../../core/models/pnc.model';

@Component({
    selector: 'pnc-edossier-header',
    templateUrl: 'pnc-edossier-header.component.html'
})
export class PncEdossierHeaderComponent {

    @Input() pnc: PncModel;

    TabNavModeEnum = TabNavModeEnum;

    constructor() {
    }

    /**
     * Vérifie si le pnc connecté peut voir le header
     * @return vrai si le pnc connecté peut voir le header, faux sinon
     */
    canViewPncHeader(): boolean {
        return true;
    }

}
