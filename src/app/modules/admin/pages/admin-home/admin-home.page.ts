import { ProfileManagementPage } from './../profile-management/profile-management.page';
import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
    selector: 'admin-home',
    templateUrl: 'admin-home.page.html',
})
export class AdminHomePage {
    constructor(private navCtrl: NavController) { }

    /**
     * Redirige vers la page de gestion des profils
     */
    goToProfileManagement() {
        this.navCtrl.push(ProfileManagementPage);
    }
}
