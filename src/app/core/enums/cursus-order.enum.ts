export enum CursusOrderEnum {
    TVVC = 'CORRECT',
    TVT = 'TVT',
    TVT_R = 'TVT_R'
}


export namespace CursusOrderEnum {

    /**
     * Retourne l'ordre d'affichage de chaque valeur de l'enum
     * @param value valeur de l'enum
     * @return l'ordre d'affichage
     */
    export function getDisplayOrder(value: CursusOrderEnum): number {
        switch (value) {
            case CursusOrderEnum.TVVC: return 1;
            case CursusOrderEnum.TVT: return 2;
            case CursusOrderEnum.TVT_R: return 3;
            default: return 0;
        }
    }
}
