import { EObservationItemModel } from './../../../../core/models/eobservation/eobservation-item.model';
import { EObservationComponent } from './e-observation.component';
import { ReferentialItemLevelModel } from '../../../../core/models/eobservation/referential-item-level.model';
import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';

describe('EObservationComponent', () => {

    let eObservationComponent: EObservationComponent;

    beforeEach(() => {
        eObservationComponent = new EObservationComponent();
    });
    describe('isEObservationItemAbnormal', () => {
        it(`doit retourner vrai si le niveau est différent de LEVEL_3, NO, C`, () => {
            const eObservationItem = new EObservationItemModel();
            const refItemLevel = new ReferentialItemLevelModel();
            eObservationItem.refItemLevel = refItemLevel;
            refItemLevel.level = EObservationLevelEnum.LEVEL_1;
            expect(eObservationComponent.isEObservationItemAbnormal(eObservationItem)).toBeTruthy();
            refItemLevel.level = EObservationLevelEnum.LEVEL_2;
            expect(eObservationComponent.isEObservationItemAbnormal(eObservationItem)).toBeTruthy();
            refItemLevel.level = EObservationLevelEnum.LEVEL_3;
            expect(eObservationComponent.isEObservationItemAbnormal(eObservationItem)).toBeFalsy();
            refItemLevel.level = EObservationLevelEnum.LEVEL_4;
            expect(eObservationComponent.isEObservationItemAbnormal(eObservationItem)).toBeTruthy();
            refItemLevel.level = EObservationLevelEnum.A;
            expect(eObservationComponent.isEObservationItemAbnormal(eObservationItem)).toBeTruthy();
            refItemLevel.level = EObservationLevelEnum.C;
            expect(eObservationComponent.isEObservationItemAbnormal(eObservationItem)).toBeFalsy();
            refItemLevel.level = EObservationLevelEnum.NO;
            expect(eObservationComponent.isEObservationItemAbnormal(eObservationItem)).toBeFalsy();

        });
    });
});
