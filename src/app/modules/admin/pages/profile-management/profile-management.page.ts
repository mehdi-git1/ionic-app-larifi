import { Component } from '@angular/core';
import { UserProfile } from '../../../../core/models/admin/user-profile.model';
import { UserProfileService } from '../../../../core/services/user-profile/user-profile.service';

import { PermissionManagementPage } from './../permission-management/permission-management.page';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'page-profile-management',
    templateUrl: 'profile-management.page.html',
})
export class ProfileManagementPage {

    userProfiles: UserProfile[];

    constructor(private userProfileProvider: UserProfileService, private navCtrl: NavController) {
    }

    ionViewDidEnter() {
        this.userProfileProvider.getAllUserProfiles().then(userProfiles => {
            this.userProfiles = userProfiles;
        }, error => { });
    }

    /**
    * Redirige vers la page des permissions du profil en paramètre
    * @param name le nom du profil pour trouver ses permissions
    */
    goToPermissionManagement(name) {
        this.navCtrl.push(PermissionManagementPage, { name: name });

    }

}
