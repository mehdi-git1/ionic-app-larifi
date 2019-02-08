import { Component } from '@angular/core';
import { UserPermission } from '../../../../core/models/admin/user-permission.model';
import { UserProfile } from '../../../../core/models/admin/user-profile.model';
import { UserProfileService } from '../../../../core/services/user-profile/user-profile.service';
import { UserPermissionService } from '../../../../core/services/user-permission/user-permission.service';
import { NavController } from 'ionic-angular';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'page-profile-management',
    templateUrl: 'profile-management.page.html',
})
export class ProfileManagementPage {

    userProfiles: UserProfile[];
    userProfileName: string;
    allPermissions: UserPermission[];
    profilePermissions: UserPermission[];

    constructor(
        private userProfileProvider: UserProfileService,
        private navCtrl: NavController,
        public translateService: TranslateService,
        private toastService: ToastService,
        private userProfileService: UserProfileService,
        private userPermissionService: UserPermissionService) {
    }

    ionViewDidEnter() {
        this.userProfileProvider.getAllUserProfiles().then(userProfiles => {
            this.userProfiles = userProfiles;
        }, error => { });
    }

    goToPermissionManagement(userProfile: string) {
        // Vérifie le profil habile
        this.userProfileName = userProfile;

        const promises = new Array();
        // Retourne la liste de toutes les permissions de l'application
        promises.push(this.userPermissionService.getAllUserPermission().then(allPermissions => {
            this.allPermissions = allPermissions;
        }, error => { }));

        // Retourne la liste des permissions en fonction de profil en paramètre
        promises.push(this.userProfileService.getUserPermissionsByUserProfile(this.userProfileName).then(profilePermissions => {
            this.profilePermissions = profilePermissions;
        }, error => { }));

        // une fois les permissions reçues, indique si la permission appartient au profil
        Promise.all(promises).then(() => {
            this.allPermissions.forEach(permission => {
                if (this.profileHasPermission(permission)) {
                    permission.checked = true;
                }
            });
            console.log(this.allPermissions);
        });
    }


    /**
     * Teste si un profil possède une permission
     * @param permission la permission à tester
     * @return true si la permission en paramètre est accessible au profil utilisateur défini
     */
    profileHasPermission(permission: UserPermission): boolean {
        for (const profilePermission of this.profilePermissions) {
            if (profilePermission.name === permission.name) {
                return true;
            }
        }
        return false;
    }

    /**
     * Met à jour les permissions d'un profil
     */
    updatePermissions(): void {
        // Si aucun profil n'a été selectionné envoie une erreur
        if (this.allPermissions == undefined) {
            this.toastService.error(this.translateService.instant('ADMIN.PERMISSION_MANAGEMENT.ERROR.PROFILE_UNDEFINED'));
        } else {
            const checkedPermissions = this.allPermissions.filter(permission => {
                return permission.checked;
            });

            this.userProfileService.updatePermissions(this.userProfileName, checkedPermissions);
            // informe la réussite de la mise à jour
            this.toastService.success(this.translateService.instant('ADMIN.PERMISSION_MANAGEMENT.SUCCESS.UPDATED_PERMISSIONS'));
        }
    }
}
