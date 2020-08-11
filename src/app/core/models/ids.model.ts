/**
 * Ressource générique utilisée pour transmettre/récupérer des ids
 */
export class IdsModel {
    ids: Array<number>;

    constructor(ids: Array<number>) {
        this.ids = ids;
    }
}
