import { ProfessionalLevelResultStatusUtil } from './professional-level-result-status.util';
import { ProfessionalLevelResultStatus } from '../../core/enums/professional-level-result-status.enum';

describe('professional-level-result-status.util', () => {

    describe('getStatusCssClass', () => {
        it(`doit renvoyer green si le résultat est ${ProfessionalLevelResultStatus.SUCCESS}`, () => {
            expect(ProfessionalLevelResultStatusUtil.getStatusCssClass(ProfessionalLevelResultStatus.SUCCESS)).toEqual('green');
        });

        it(`doit renvoyer yellow si le résultat est ${ProfessionalLevelResultStatus.SUCCESS_WITH_FC}`, () => {
            expect(ProfessionalLevelResultStatusUtil.getStatusCssClass(ProfessionalLevelResultStatus.SUCCESS_WITH_FC)).toEqual('yellow');
        });

        it(`doit renvoyer orange si le résultat est ${ProfessionalLevelResultStatus.SUCCESS_WITH_FC_AND_TESTS}`, () => {
            expect(ProfessionalLevelResultStatusUtil.getStatusCssClass(ProfessionalLevelResultStatus.SUCCESS_WITH_FC_AND_TESTS)).toEqual('orange');
        });

        it(`doit renvoyer orange si le résultat est ${ProfessionalLevelResultStatus.SUCCESS_WITH_RETAKE}`, () => {
            expect(ProfessionalLevelResultStatusUtil.getStatusCssClass(ProfessionalLevelResultStatus.SUCCESS_WITH_RETAKE)).toEqual('orange');
        });

        it(`doit renvoyer red si le résultat est ${ProfessionalLevelResultStatus.FAILED}`, () => {
            expect(ProfessionalLevelResultStatusUtil.getStatusCssClass(ProfessionalLevelResultStatus.FAILED)).toEqual('red');
        });
    });

});
