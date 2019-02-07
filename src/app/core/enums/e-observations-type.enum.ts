export enum EObservationTypeEnum {
    E_ALT = 'E_ALT',
    E_CC = 'E_CC',
    E_CCP = 'E_CCP',
    E_HST = 'E_HST'
}

export namespace EObservationTypeEnum {

    /**
     * Retourne le label correspondant à la valeur de l'enum
     * @param value valeur de l'enum
     * @return le label correspondant au type d'eObservation
     */
    export function getLabel(value: EObservationTypeEnum): string {
        switch (value) {
            case EObservationTypeEnum.E_ALT: return 'eALT';
            case EObservationTypeEnum.E_CC: return 'eCC';
            case EObservationTypeEnum.E_CCP: return 'eCCP';
            case EObservationTypeEnum.E_HST: return 'eHST';
            default: return '';
        }
    }
}
