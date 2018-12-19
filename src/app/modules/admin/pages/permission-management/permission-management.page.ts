import { UserProfileService } from '../../../../core/services/user-profile/user-profile.service';
import { Component, Input } from '@angular/core';
import { UserPermission } from '../../../../core/models/admin/user-permission.model';
import { UserPermissionService } from '../../../../core/services/user-permission/user-permission.service';
import { NavController, NavParams } from 'ionic-angular';


@Component({
    selector: 'page-permission-management',
    templateUrl: 'permission-management.page.html',
})
export class PermissionManagementPage {
    userProfileName: string;

    allUserPermissions: UserPermission[];
    userPermissionsByProfile: UserPermission[];

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private userProfile: UserProfileService,
        private userPermissionProvider: UserPermissionService) {
    }

    ionViewDidEnter() {
        this.initPage();
    }

    /**
     * Initialisation du contenu de la page.
     */
    initPage() {

        // vérifie le profil habile
        if (this.navParams.get('name')) {
            this.userProfileName = this.navParams.get('name');
        }

        // retourne la liste de toutes les permissions de l'application
        this.userPermissionProvider.getAllUserPermission().then(userPermissions => {
            this.allUserPermissions = userPermissions;
        }, error => { });

        // retourne la liste des permissions en fonction de profil en paramètre
        this.userProfile.getUserPermissionsByUserProfile(this.userProfileName).then(userPermissionsByProfile => {
            this.userPermissionsByProfile = userPermissionsByProfile;
        }, error => { });
    }

    /**
     * retourne true si la permission en paramètre est accessible au profil utilisateur défini
     * @param userPermission une permission
     * @return true si la permission en paramètre est accessible au profil utilisateur défini
     */
    isChecked(userPermission: string): boolean {
        if (this.userPermissionsByProfile != null) {
            for (let i = 0; i < this.userPermissionsByProfile.length; i++) {
                if (this.userPermissionsByProfile[i].name == userPermission) {
                    return true;
                }
            }
        }
        return false;
    }
}
