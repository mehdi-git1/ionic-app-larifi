import { EObservationItemModel } from './eobservation-item.model';
import { ReferentialThemeModel } from './referential-theme.model';

export class EObservationItemsByTheme {

    referentialTheme: ReferentialThemeModel;
    subThemes: EObservationItemsByTheme[];
    eObservationItems: EObservationItemModel[];

    constructor (referentialTheme: ReferentialThemeModel) {
        this.referentialTheme = referentialTheme;
        this.eObservationItems = new Array<EObservationItemModel>();
        this.subThemes = new Array<EObservationItemsByTheme>();
    }
}
