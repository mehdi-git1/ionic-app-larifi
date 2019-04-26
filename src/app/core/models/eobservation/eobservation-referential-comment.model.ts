import { EDossierPncObjectModel } from '../e-dossier-pnc-object.model';
import { ReferentialThemeModel } from './eobservation-referential-theme.model';

export class ReferentialCommentModel extends EDossierPncObjectModel {

    theme: ReferentialThemeModel;

    label: string;

    xmlKey: string;

    version: string;

    getStorageId(): string {
        return `${this.techId}`;
    }
}
