import { SpecialityEnum } from './../speciality.enum';
import { EFormsTypeEnum } from './e-forms-type.enum';

describe('EFormsTypeEnum', () => {
    describe('getTextType', () => {
        it(`doit retourner le type eHST si le PNC est HOT`, () => {
            expect(EFormsTypeEnum.getTextType(SpecialityEnum['HOT'])).toEqual('eHST / eCC');
        });

        it(`doit retourner le type eHST si le PNC est STW`, () => {
            expect(EFormsTypeEnum.getTextType(SpecialityEnum['STW'])).toEqual('eHST / eCC');
        });

        it(`doit retourner le type eCC si le PNC est CC`, () => {
            expect(EFormsTypeEnum.getTextType(SpecialityEnum['CC'])).toEqual('eCC / eCCP');
        });

        it(`doit retourner le type eCCP si le PNC est CCP`, () => {
            expect(EFormsTypeEnum.getTextType(SpecialityEnum['CCP'])).toEqual('eCCP');
        });

        it(`doit retourner null si le PNC est testLibelle (inexistant)`, () => {
            expect(EFormsTypeEnum.getTextType(SpecialityEnum['testLibelle'])).toEqual(null);
        });
    });

    describe('getType', () => {

        it(`doit retourner le type 16 si le type de formulaire est eHST`, () => {
            expect(EFormsTypeEnum.getType(EFormsTypeEnum['eHST'])).toEqual('16');
        });

        it(`doit retourner le type 17 si le type de formulaire est eCC`, () => {
            expect(EFormsTypeEnum.getType(EFormsTypeEnum['eCC'])).toEqual('17');
        });

        it(`doit retourner le type 18 si le type de formulaire est eCCP`, () => {
            expect(EFormsTypeEnum.getType(EFormsTypeEnum['eCCP'])).toEqual('18');
        });

        it(`doit retourner null si le PNC est testLibelle (inexistant)`, () => {
            expect(EFormsTypeEnum.getType(EFormsTypeEnum['testLibelle'])).toEqual(null);
        });
    });
});
