import { EObservationItemModel } from "./eobservation-item.model";
import { ReferentialThemeModel } from "./referential-theme.model";

export class EobservationItemsByTheme {

    referentialTheme : ReferentialThemeModel;
    eObservationItems: EObservationItemModel[];

    constructor (referentialTheme: ReferentialThemeModel) {
        this.referentialTheme = referentialTheme;
        this.eObservationItems = new Array<EObservationItemModel>();
    }
}