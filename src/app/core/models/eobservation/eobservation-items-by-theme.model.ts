import { EObservationItemModel } from './eobservation-item.model';
import { ReferentialThemeModel } from './referential-theme.model';
import { EObservationCommentModel } from './eobservation-comment.model';

export class EObservationItemsByTheme {

    referentialTheme: ReferentialThemeModel;
    subThemes: EObservationItemsByTheme[];
    eObservationItems: EObservationItemModel[];
    eObservationComment: EObservationCommentModel;

    constructor(referentialTheme: ReferentialThemeModel) {
        this.referentialTheme = referentialTheme;
        this.eObservationItems = new Array<EObservationItemModel>();
        this.subThemes = new Array<EObservationItemsByTheme>();
    }
}
