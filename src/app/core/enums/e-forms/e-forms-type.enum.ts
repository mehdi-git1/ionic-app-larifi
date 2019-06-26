import { SpecialityEnum } from '../speciality.enum';

export enum EFormsTypeEnum {
    eHST,
    eCC,
    eCCP
}

export namespace EFormsTypeEnum {
    const EHST_ECC = 'eHST / eCC';
    const ECC_ECCP = 'eCC / eCCP';
    const ECCP = 'eCCP';

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
            case SpecialityEnum['HOT']: return EHST_ECC;
            case SpecialityEnum['STW']: return EHST_ECC;
            case SpecialityEnum['CC']: return ECC_ECCP;
            case SpecialityEnum['CCT']: return EHST_ECC;
            case SpecialityEnum['CCP']: return ECCP;
            case SpecialityEnum['CCPT']: return ECC_ECCP;
            default: return null;
        }
    }
}
