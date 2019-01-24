export enum EFormsTypeEnum {
    HOT,
    STW,
    CC,
    CCP,
    ALT,
    PCB
}

export namespace EFormsTypeEnum {
    /**
     * retourne le bon type en fonction de l'enum
     * @param type enum à tester
     */
    export function getType(type: EFormsTypeEnum) {
        switch (type) {
            case EFormsTypeEnum['HOT']: return '16';
            case EFormsTypeEnum['STW']: return '16';
            case EFormsTypeEnum['CC']: return '17';
            case EFormsTypeEnum['CCP']: return '18';
            default: return null;
        }
    }

    /**
     * retourne le bon texte de type de formulaire en fonction de l'enum
     * @param type enum à tester
     */
    export function getTextType(type: EFormsTypeEnum) {
        switch (type) {
            case EFormsTypeEnum['HOT']: return 'eHST';
            case EFormsTypeEnum['STW']: return 'eHST';
            case EFormsTypeEnum['CC']: return 'eCC';
            case EFormsTypeEnum['CCP']: return 'eCCP';
            case EFormsTypeEnum['ALT']: return 'eALT';
            case EFormsTypeEnum['PCB']: return 'ePCB';
            default: return null;
        }
    }
}
