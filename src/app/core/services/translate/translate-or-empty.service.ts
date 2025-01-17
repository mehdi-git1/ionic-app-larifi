import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class TranslateOrEmptyService {

    constructor(
        private translateService: TranslateService) {
    }

    /**
     * Traduit la clé en valeur à partir du fichier d'internationalisation
     * @param key clé du message
     * @return la valeur dans la fichier d'internationalisation ou renvoie vide si la clé est nulle, undefined ou
     * si la clé et la valeur sont identiques
     */
    public translate(key: string): string {
        if (!key || key === undefined) {
            return '';
        }
        const status: string = this.translateService.instant(key);
        if (status === key) {
            return '';
        }
        return status;
    }
}
