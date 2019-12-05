import { HtmlService } from 'src/app/core/file/html/html.service';
import { PncModel } from 'src/app/core/models/pnc.model';
import { DeviceService } from 'src/app/core/services/device/device.service';
import { SessionService } from 'src/app/core/services/session/session.service';

import { Component, Input, OnInit } from '@angular/core';

import { AppParameterModel } from '../../../../core/models/app-parameter.model';
import { SecurityService } from '../../../../core/services/security/security.service';

@Component({
    selector: 'contact',
    templateUrl: 'contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

    @Input() pnc: PncModel;
    phoneNumbers: string[];
    contactPNLink: AppParameterModel;

    constructor(private sessionService: SessionService,
        private htmlService: HtmlService,
        private deviceService: DeviceService,
        private securityService: SecurityService) {
    }

    ngOnInit() {
        this.contactPNLink = this.sessionService.getActiveUser().appInitData.contactPNLink;
        this.phoneNumbers = this.pnc.phoneNumber.split(';');
    }

    /**
     * Ouvre un onglet avec l'url en paramètre
     * @param url url
     */
    goToLink(link: string) {
        if (link) {
            this.htmlService.displayHTML(link.replace('%MATRICULE%', this.pnc.matricule));
        }
    }

    /**
     * Vérifie si le PNC est manager
     * @return vrai si le PNC est manager, faux sinon
     */
    isManager(): boolean {
        return this.securityService.isManager();
    }

    /**
     * Verifie si on est en mode Web
     */
    isBrowser() {
        return this.deviceService.isBrowser();
    }
}
