import { Pipe, PipeTransform } from '@angular/core';
import { SessionService } from '../../../core/services/session/session.service';

@Pipe({
    name: 'isMyPage'
})
export class IsMyPage implements PipeTransform {

    constructor(
        private sessionService: SessionService
    ) { }

    /**
     * Récupére le titre personnel si on est sur une de nos pages
     * Sinon, si on est sur une page d'un PNC, on met le titre normal
     * @param value : Valeur du champ à traduire
     */
    transform(value, pnc) {
        // La condition pnc === undefined est nécessaire pour lorsque l'on vient du header
        // On considére que si il n'y a pas de pnc en entré, c'est que l'on est sur une page de l'utilisateur principal
        if (this.sessionService.isActiveUser(pnc) || pnc === undefined) {
            return this.addMyToTranslate(value);
        }
        return value;
    }

    /**
     * Transforme le libellé en libellé personnel
     */
    addMyToTranslate(value) {
        const tmpValue = value.split('.');
        tmpValue[tmpValue.length - 1] = 'MY_' + tmpValue[tmpValue.length - 1];
        return tmpValue.join('.');
    }

}
