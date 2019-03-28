import { SpecialityEnum } from '../speciality.enum';

export enum EFormsTypeEnum {
    eHST,
    eCC,
    eCCP
}

export namespace EFormsTypeEnum {
    /**
     * Retourne le bon type en fonction de l'enum
     * @param type enum à tester
     */
    export function getType(type: EFormsTypeEnum) {
        switch (type) {
            case EFormsTypeEnum['eHST']: return '16';
            case EFormsTypeEnum['eCC']: return '17';
            case EFormsTypeEnum['eCCP']: return '18';
            default: return null;
        }
    }

    /**
     * Retourne le bon texte de type de formulaire en fonction de l'enum
     * @param type enum à tester
     */
    export function getTextType(type: SpecialityEnum) {
        switch (type) {
            case SpecialityEnum['HOT']: return 'eHST / eCC';
            case SpecialityEnum['STW']: return 'eHST / eCC';
            case SpecialityEnum['CC']: return 'eCC / eCCP';
            case SpecialityEnum['CCP']: return 'eCCP';
            default: return null;
        }
    }
}
