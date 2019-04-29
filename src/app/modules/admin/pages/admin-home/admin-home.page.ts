import { MenuController, Nav } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { UserMessageManagementPage } from './../user-message-management/user-message-management.page';
import { AppVersionManagementPage } from './../app-version-management/app-version-management.page';
import { ProfileManagementPage } from './../profile-management/profile-management.page';
import { PncHomePage } from 'E:/git/edospnc-cs/src/app/modules/home/pages/pnc-home/pnc-home.page';

@Component({
    selector: 'admin-home',
    templateUrl: 'admin-home.page.html',
})
export class AdminHomePage {

    @ViewChild(Nav) nav: Nav;

    rootPage: any = ProfileManagementPage;
    activePage: any;

    pages: Array<{ title: string, component: any }>;

    constructor(public menuCtrl: MenuController,
        private translateService: TranslateService
    ) {
        this.pages = [
            { title: this.translateService.instant('ADMIN.ADMIN_HOME.BUTTON.PROFILE_MANAGEMENT'), component: ProfileManagementPage },
            { title: this.translateService.instant('ADMIN.ADMIN_HOME.BUTTON.APP_VERSION_MANAGEMENT'), component: AppVersionManagementPage },
            { title: this.translateService.instant('ADMIN.ADMIN_HOME.BUTTON.USER_MESSAGE_MANAGEMENT'), component: UserMessageManagementPage }
        ];
    }

    ionViewWillEnter() {
        this.activePage = this.pages[0];
    }

    /**
     * Ouvre le menu d'administration
     */
    openMenu() {
        this.menuCtrl.open();
    }
    /**
     * Permet d'ouvrir une page à travers le menu
     * @param page la page à ouvrir
     */
    openPage(page) {
        this.nav.setRoot(page.component);
        // Le menu se ferme lors de la sélection d'une page
        this.menuCtrl.close();
        this.activePage = page;
    }

    /**
     * permet de savoir si une page est active ou non
     * @param page activé
     */
    checkActive(page) {
        return page == this.activePage;
    }


}
