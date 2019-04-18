export enum EObservationLevelEnum {
    LEVEL_1 = 'LEVEL_1',
    LEVEL_2 = 'LEVEL_2',
    LEVEL_3 = 'LEVEL_3',
    LEVEL_4 = 'LEVEL_4',
    NO = 'NO',
    C = 'C',
    A = 'A',
    CONFORME = 'CONFORME',
    AMELIORABLE = 'AMELIORABLE',
    POINT_FORT = 'POINT_FORT'
}

export namespace EObservationLevelEnum {

    /**
    * Retourne le label correspondant à la valeur de l'enum
    * @param value valeur de l'enum
    * @return le label correspondant au niveau d'eObservation
    */
    export function getLabel(value: EObservationLevelEnum): string {
        switch (value) {
            case EObservationLevelEnum.LEVEL_1: return '1';
            case EObservationLevelEnum.LEVEL_2: return '2';
            case EObservationLevelEnum.LEVEL_3: return '3';
            case EObservationLevelEnum.LEVEL_4: return '4';
            case EObservationLevelEnum.NO: return 'NO';
            case EObservationLevelEnum.C: return 'C';
            case EObservationLevelEnum.A: return 'A';
            default: return '';
        }
    }
}
