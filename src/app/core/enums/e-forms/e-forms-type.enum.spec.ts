import { EFormsTypeEnum } from './e-forms-type.enum';

describe('EFormsTypeEnum', () => {
    describe('getTextType', () => {
        it(`doit retourner le type eHST si le PNC est HOT`, () => {
            expect(EFormsTypeEnum.getTextType(EFormsTypeEnum['HOT'])).toEqual('eHST / eCC');
        });

        it(`doit retourner le type eHST si le PNC est STW`, () => {
            expect(EFormsTypeEnum.getTextType(EFormsTypeEnum['STW'])).toEqual('eHST / eCC');
        });

        it(`doit retourner le type eCC si le PNC est CC`, () => {
            expect(EFormsTypeEnum.getTextType(EFormsTypeEnum['CC'])).toEqual('eCC / eCCP');
        });

        it(`doit retourner le type eCCP si le PNC est CCP`, () => {
            expect(EFormsTypeEnum.getTextType(EFormsTypeEnum['CCP'])).toEqual('eCCP');
        });

        it(`doit retourner le type eALT si le PNC est ALT`, () => {
            expect(EFormsTypeEnum.getTextType(EFormsTypeEnum['ALT'])).toEqual('eALT');
        });

        it(`doit retourner le type ePCB si le PNC est PCB`, () => {
            expect(EFormsTypeEnum.getTextType(EFormsTypeEnum['PCB'])).toEqual('ePCB');
        });

        it(`doit retourner null si le PNC est testLibelle (inexistant)`, () => {
            expect(EFormsTypeEnum.getTextType(EFormsTypeEnum['testLibelle'])).toEqual(null);
        });
    });

    describe('getType', () => {
        it(`doit retourner le type 16 si le PNC est HOT`, () => {
            expect(EFormsTypeEnum.getType(EFormsTypeEnum['HOT'])).toEqual('16');
        });

        it(`doit retourner le type 16 si le PNC est STW`, () => {
            expect(EFormsTypeEnum.getType(EFormsTypeEnum['STW'])).toEqual('16');
        });

        it(`doit retourner le type 17 si le PNC est CC`, () => {
            expect(EFormsTypeEnum.getType(EFormsTypeEnum['CC'])).toEqual('17');
        });

        it(`doit retourner le type 18 si le PNC est CCP`, () => {
            expect(EFormsTypeEnum.getType(EFormsTypeEnum['CCP'])).toEqual('18');
        });

        it(`doit retourner null si le PNC est testLibelle (inexistant)`, () => {
            expect(EFormsTypeEnum.getType(EFormsTypeEnum['testLibelle'])).toEqual(null);
        });
    });
});
