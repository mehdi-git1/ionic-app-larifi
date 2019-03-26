import { EObservationItemModel } from './eobservation-item.model';
import { ReferentialThemeModel } from './referential-theme.model';

export class EobservationItemsByTheme {

    referentialTheme: ReferentialThemeModel;
    subThemes: EobservationItemsByTheme[];
    eObservationItems: EObservationItemModel[];
    themeComment: string;

    constructor (referentialTheme: ReferentialThemeModel) {
        this.referentialTheme = referentialTheme;
        this.eObservationItems = new Array<EObservationItemModel>();
        this.subThemes = new Array<EobservationItemsByTheme>();
    }
}
