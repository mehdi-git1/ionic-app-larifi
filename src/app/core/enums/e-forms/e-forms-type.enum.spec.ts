import { EFormsTypeEnum } from './e-forms-type.enum';

describe('EFormsTypeEnum', () => {
    describe('getTextType', () => {
        it(`doit retourner le type eHST si on a HOT en Specialité`, () => {
            expect(EFormsTypeEnum.getTextType(EFormsTypeEnum['HOT'])).toEqual('eHST / eCC');
        });

        it(`doit retourner le type eHST si on a STW en Specialité`, () => {
            expect(EFormsTypeEnum.getTextType(EFormsTypeEnum['STW'])).toEqual('eHST / eCC');
        });

        it(`doit retourner le type eCC si on a CC en Specialité`, () => {
            expect(EFormsTypeEnum.getTextType(EFormsTypeEnum['CC'])).toEqual('eCC / eCCP');
        });

        it(`doit retourner le type eCCP si on a CCP en Specialité`, () => {
            expect(EFormsTypeEnum.getTextType(EFormsTypeEnum['CCP'])).toEqual('eCCP');
        });

        it(`doit retourner le type eALT si on a ALT en Specialité`, () => {
            expect(EFormsTypeEnum.getTextType(EFormsTypeEnum['ALT'])).toEqual('eALT');
        });

        it(`doit retourner le type ePCB si on a PCB en Specialité`, () => {
            expect(EFormsTypeEnum.getTextType(EFormsTypeEnum['PCB'])).toEqual('ePCB');
        });

        it(`doit retourner null si on a testLibelle en Specialité`, () => {
            expect(EFormsTypeEnum.getTextType(EFormsTypeEnum['testLibelle'])).toEqual(null);
        });
    });

    describe('getType', () => {
        it(`doit retourner le type 16 si on a HOT en Specialité`, () => {
            expect(EFormsTypeEnum.getType(EFormsTypeEnum['HOT'])).toEqual('16');
        });

        it(`doit retourner le type 16 si on a STW en Specialité`, () => {
            expect(EFormsTypeEnum.getType(EFormsTypeEnum['STW'])).toEqual('16');
        });

        it(`doit retourner le type 17 si on a CC en Specialité`, () => {
            expect(EFormsTypeEnum.getType(EFormsTypeEnum['CC'])).toEqual('17');
        });

        it(`doit retourner le type 18 si on a CCP en Specialité`, () => {
            expect(EFormsTypeEnum.getType(EFormsTypeEnum['CCP'])).toEqual('18');
        });

        it(`doit retourner null si on a testLibelle en Specialité`, () => {
            expect(EFormsTypeEnum.getType(EFormsTypeEnum['testLibelle'])).toEqual(null);
        });
    });
});
