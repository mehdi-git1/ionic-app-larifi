export enum EFormsTypeEnum {
    HOT,
    STW,
    CC,
    CCP,
    ALT,
    PCB,
    eHST,
    eCC,
    eCCP,
    eALT,
    ePCB
}

export namespace EFormsTypeEnum {
    /**
     * Retourne le bon type en fonction de l'enum
     * @param type enum à tester
     */
    export function getType(type: EFormsTypeEnum) {
        console.log('type', type);
        switch (type) {
            case EFormsTypeEnum['HOT']:
            case EFormsTypeEnum['eHST']:
            case EFormsTypeEnum['STW']:
                return '16';
            case EFormsTypeEnum['CC']:
            case EFormsTypeEnum['eCC']:
                return '17';
            case EFormsTypeEnum['CCP']:
            case EFormsTypeEnum['eCCP']:
                return '18';
            default: return null;
        }
    }

    /**
     * Retourne le bon texte de type de formulaire en fonction de l'enum
     * @param type enum à tester
     */
    export function getTextType(type: EFormsTypeEnum) {
        switch (type) {
            case EFormsTypeEnum['HOT']: return 'eHST / eCC';
            case EFormsTypeEnum['STW']: return 'eHST / eCC';
            case EFormsTypeEnum['CC']: return 'eCC / eCCP';
            case EFormsTypeEnum['CCP']: return 'eCCP';
            case EFormsTypeEnum['ALT']: return 'eALT';
            case EFormsTypeEnum['PCB']: return 'ePCB';
            default: return null;
        }
    }
}
