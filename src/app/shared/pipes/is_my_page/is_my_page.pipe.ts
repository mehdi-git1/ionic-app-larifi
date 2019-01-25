import { Pipe, PipeTransform } from '@angular/core';
import { SessionService } from '../../../core/services/session/session.service';
import { PncModel } from '../../../core/models/pnc.model';

@Pipe({
    name: 'isMyPage'
})
export class IsMyPage implements PipeTransform {

    constructor(
        private sessionService: SessionService
    ) { }

    /**
     * Récupère le titre personnel si on est sur une de nos pages
     * Sinon, si on est sur une page d'un PNC, on met le titre normal
     * @param localizationKey une clef de localization
     * @param pnc le pnc/user connecté
     * @return la nouvelle valeur
     */
    transform(localizationKey: string, pnc: PncModel): string {
        // La condition pnc === undefined est nécessaire pour lorsque l'on vient du header
        // On considére que si il n'y a pas de pnc en entré, c'est que l'on est sur une page de l'utilisateur principal
        if (this.sessionService.isActiveUser(pnc) || pnc === undefined) {
            return this.addMyToTranslate(localizationKey);
        }
        return localizationKey;
    }

    /**
     * Ajoute à la clef de localisation un préfixe "MY_" permettant de pointer vers son pendant possessif
     * @param localizationKey une clef de localisation
     * @return la nouvelle clef de localisation
     */
    addMyToTranslate(localizationKey: string): string {
        const splitLocalizationKey = localizationKey.split('.');
        splitLocalizationKey[splitLocalizationKey.length - 1] = 'MY_' + splitLocalizationKey[splitLocalizationKey.length - 1];
        return splitLocalizationKey.join('.');
    }

}
